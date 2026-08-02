import { copyFile, cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";
import { assertSafeRelativePath, inspectPhysicalTree, sha256, verifyFileEvidence, verifyProhibitedContent } from "./release-integrity.mjs";

const root = resolve(import.meta.dirname, "..");
const allowlistPath = join(root, "scripts", "release-allowed-paths.json");
const bannedPathPatterns = [
  /(^|\/)\.hermes(?:\/|$|-)/,
  /(^|\/)\.diagnostics\//,
  /(^|\/)app\/api\/messenger\//,
  /(^|\/)app\/lib\//,
  /(^|\/)docs\//,
  /messenger.*test/i,
  /public\/apple-touch-icon\.svg$/,
  /(^|\/)(?:node_modules|\.next|\.vinext|\.wrangler|dist|test-results|playwright-report)\//,
  /(?:next-env\.d\.ts|tsconfig\.release\.tsbuildinfo)$/,
  /\.hermes-vercel-worktree/,
];
const verificationCommands = [
  ["npm", ["ci"]],
  ["npm", ["run", "lint"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["test"]],
  ["npm", ["run", "build"]],
  ["npm", ["audit", "--omit=dev"]],
  ["npm", ["run", "lint:raw"]],
  ["npm", ["run", "typecheck:release"]],
  ["npm", ["run", "test:raw"]],
  ["node", ["--experimental-strip-types", "--test", "tests/contact-protection.test.mjs"]],
  ["npm", ["run", "vercel-build"]],
  ["npm", ["run", "test:e2e"]],
];

function fail(message) {
  throw new Error(message);
}

function git(args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) fail(`git ${args.join(" ")} failed`);
  return result.stdout.trim();
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function webpDimensions(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") fail("Invalid WebP container");
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (chunk === "VP8X" && size >= 10) return { width: readUInt24LE(buffer, data + 4) + 1, height: readUInt24LE(buffer, data + 7) + 1 };
    if (chunk === "VP8 " && size >= 10 && buffer.toString("hex", data + 3, data + 6) === "9d012a") return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    if (chunk === "VP8L" && size >= 5 && buffer[data] === 0x2f) {
      const b1 = buffer[data + 1];
      const b2 = buffer[data + 2];
      const b3 = buffer[data + 3];
      const b4 = buffer[data + 4];
      return { width: 1 + b1 + ((b2 & 0x3f) << 8), height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10) };
    }
    offset = data + size + (size % 2);
  }
  fail("WebP dimensions not found");
}

function isWithin(parent, child) {
  const rel = relative(parent, child);
  return rel !== "" && rel !== ".." && !rel.startsWith("../") && !rel.startsWith("..\\") && !isAbsolute(rel);
}

const args = new Set(process.argv.slice(2));
const outputArgument = process.argv.find((value) => value.startsWith("--output="));
const verify = args.has("--verify");
const suffix = new Date().toISOString().replace(/[:.]/g, "-");
const directoryRoot = resolve(outputArgument?.slice("--output=".length) || join(tmpdir(), `northstar-release-${suffix}`));
if (directoryRoot === root || isWithin(root, directoryRoot)) fail("Release output must be outside the source repository");

const allowlistRaw = await readFile(allowlistPath);
const config = JSON.parse(allowlistRaw);
if (config.schemaVersion !== 1 || !Array.isArray(config.allowedPaths)) fail("Unsupported release allowlist schema");
const allowed = [...config.allowedPaths].sort();
if (allowed.length !== new Set(allowed).size) fail("Allowlist contains duplicate paths");
for (const path of allowed) {
  assertSafeRelativePath(path);
  if (bannedPathPatterns.some((pattern) => pattern.test(path))) fail(`Unsafe or excluded allowlist path: ${path}`);
}

try {
  await lstat(directoryRoot);
  fail(`Output already exists: ${directoryRoot}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

for (const path of allowed) {
  const source = resolve(root, path);
  if (!isWithin(root, source)) fail(`Source path escapes repository: ${path}`);
  const sourceStat = await lstat(source).catch(() => null);
  if (!sourceStat?.isFile() || sourceStat.isSymbolicLink()) fail(`Required release path is not a physical regular file: ${path}`);
  const destination = resolve(directoryRoot, path);
  if (!isWithin(directoryRoot, destination)) fail(`Destination path escapes export: ${path}`);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

const fileEvidence = await inspectPhysicalTree(directoryRoot);
const exported = fileEvidence.map(({ path }) => path);
if (JSON.stringify(exported) !== JSON.stringify(allowed)) {
  const extra = exported.filter((path) => !allowed.includes(path));
  const missing = allowed.filter((path) => !exported.includes(path));
  fail(`Export mismatch; extra=${JSON.stringify(extra)} missing=${JSON.stringify(missing)}`);
}
await verifyProhibitedContent(directoryRoot, fileEvidence);

const environmentExample = await readFile(join(directoryRoot, ".env.example"), "utf8");
const expectedEnvironment = new Map([
  ["NEXT_PUBLIC_SITE_URL", "https://northstarsystems.ph"],
  ["NEXT_PUBLIC_BOOKING_URL", ""],
  ["RESEND_API_KEY", ""],
  ["CONTACT_TO_EMAIL", ""],
  ["CONTACT_FROM_EMAIL", "Northstar Systems <hello@yourdomain.example>"],
  ["AI_GATEWAY_API_KEY", ""],
  ["AI_CHAT_MODEL", ""],
]);
const parsedEnvironment = new Map();
for (const rawLine of environmentExample.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const separator = line.indexOf("=");
  if (separator <= 0) fail("Invalid .env.example assignment");
  const key = line.slice(0, separator);
  if (parsedEnvironment.has(key)) fail(`Duplicate .env.example key: ${key}`);
  parsedEnvironment.set(key, line.slice(separator + 1));
}
if (JSON.stringify([...parsedEnvironment]) !== JSON.stringify([...expectedEnvironment])) {
  fail(".env.example must contain only the approved non-secret placeholders");
}

const siteData = await readFile(join(directoryRoot, "app", "site-data.ts"), "utf8");
const projectBlock = siteData.match(/export const projects[^=]*= \[([\s\S]*?)\n\];/);
if (!projectBlock) fail("Project dataset was not found");
const projectSlugs = [...projectBlock[1].matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
const projectImages = [...projectBlock[1].matchAll(/\bimage:\s*"\/project-thumbnails\/([^"]+)"/g)].map((match) => match[1]);
if (projectSlugs.length !== 15 || new Set(projectSlugs).size !== 15) fail(`Expected 15 unique projects; found ${projectSlugs.length}`);
if (projectImages.length !== 15 || new Set(projectImages).size !== 15) fail(`Expected 15 unique project thumbnails; found ${projectImages.length}`);
const expectedThumbnails = [...config.projectThumbnails].sort();
if (JSON.stringify([...projectImages].sort()) !== JSON.stringify(expectedThumbnails)) fail("Project thumbnail dataset does not match the release manifest");
for (const filename of config.newProjectPreviews) {
  const dimensions = webpDimensions(await readFile(join(directoryRoot, "public", "project-thumbnails", filename)));
  if (dimensions.width !== 1440 || dimensions.height !== 900) fail(`${filename} is ${dimensions.width}x${dimensions.height}; expected 1440x900`);
}

const sourceCommit = git(["rev-parse", "HEAD"]);
const sourceBranch = git(["branch", "--show-current"]);
const workspaceDirty = git(["status", "--porcelain"]).length > 0;
const verification = [];
let verificationRoot = null;
try {
  if (verify) {
    verificationRoot = await mkdtemp(join(tmpdir(), "northstar-release-verification-"));
    await cp(directoryRoot, verificationRoot, { recursive: true, force: false, errorOnExist: true });
    await verifyFileEvidence(verificationRoot, fileEvidence);
    for (const [command, commandArgs] of verificationCommands) {
      const result = spawnSync(command, commandArgs, {
        cwd: verificationRoot,
        encoding: "utf8",
        stdio: "inherit",
        shell: process.platform === "win32",
        env: { ...process.env, AI_GATEWAY_API_KEY: "", VERCEL_OIDC_TOKEN: "", NEXT_TELEMETRY_DISABLED: "1" },
      });
      verification.push({ command: [command, ...commandArgs].join(" "), exitStatus: result.status });
      if (result.status !== 0) fail(`Verification failed: ${command} ${commandArgs.join(" ")}`);
    }
  }
} finally {
  if (verificationRoot) await rm(verificationRoot, { recursive: true, force: true });
}
await verifyFileEvidence(directoryRoot, fileEvidence);

const audit = {
  schemaVersion: 2,
  createdAt: new Date().toISOString(),
  releaseDirectoryName: basename(directoryRoot),
  sourceBranch,
  sourceCommit,
  workspaceDirty,
  immutableSourceCommit: !workspaceDirty,
  sourceNote: workspaceDirty
    ? "Export includes allowlisted working-tree changes on top of the recorded commit; exact release content is identified by the outside per-file hashes."
    : "Export exactly associates with the recorded clean source commit.",
  allowlistSha256: sha256(allowlistRaw),
  releaseFileCount: fileEvidence.length,
  projectCount: projectSlugs.length,
  projectSlugs,
  verifiedNewPreviewDimensions: Object.fromEntries(config.newProjectPreviews.map((name) => [name, "1440x900 WebP"])),
  sealedExportBuiltInPlace: false,
  verificationUsedDisposableCopy: verify,
  verification,
  files: fileEvidence,
};
const auditDirectory = join(root, ".diagnostics", "release-manifests");
await mkdir(auditDirectory, { recursive: true });
const auditPath = join(auditDirectory, `release-manifest-${suffix}.json`);
if (isWithin(directoryRoot, auditPath) || auditPath === directoryRoot) fail("Audit artifact must remain outside the sealed export");
await writeFile(auditPath, `${JSON.stringify(audit, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  output: directoryRoot,
  auditArtifact: auditPath,
  releaseFileCount: fileEvidence.length,
  projectCount: projectSlugs.length,
  sourceCommit,
  workspaceDirty,
  immutableSourceCommit: !workspaceDirty,
  verified: verify,
  sealedExportBuiltInPlace: false,
  verificationUsedDisposableCopy: verify,
}, null, 2));
