import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

const textExtensions = new Set([".css", ".example", ".html", ".js", ".json", ".jsx", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yaml", ".yml"]);
const prohibitedContentPatterns = [
  { name: "private key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/ },
  { name: "OpenAI-style token", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { name: "AWS access key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Stripe live key", pattern: /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/ },
  { name: "assigned credential", pattern: /\b(?:AI_GATEWAY_API_KEY|RESEND_API_KEY|VERCEL_OIDC_TOKEN|AWS_SECRET_ACCESS_KEY|PASSWORD|SECRET|TOKEN)[ \t]*=[ \t]*[^\s'"`]{8,}/ },
];

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function assertSafeRelativePath(path) {
  if (typeof path !== "string" || !path || path.includes("\\") || path.includes("//") || isAbsolute(path) || /^[A-Za-z]:/.test(path)) {
    throw new Error(`Unsafe release path: ${path}`);
  }
  const parts = path.split("/");
  if (parts.some((part) => part === "" || part === "." || part === "..")) throw new Error(`Unsafe release path: ${path}`);
  return path;
}

function extension(path) {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index).toLowerCase() : "";
}

export async function inspectPhysicalTree(root) {
  const canonicalRoot = resolve(root);
  const evidence = [];

  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = resolve(directory, entry.name);
      const rel = relative(canonicalRoot, absolute).split(sep).join("/");
      assertSafeRelativePath(rel);
      if (absolute !== canonicalRoot && !absolute.startsWith(`${canonicalRoot}${sep}`)) throw new Error(`Path escapes release root: ${rel}`);
      const physical = await lstat(absolute);
      if (physical.isSymbolicLink()) throw new Error(`Symbolic link is prohibited in release export: ${rel}`);
      if (physical.isDirectory()) {
        await visit(absolute);
      } else if (physical.isFile()) {
        const buffer = await readFile(absolute);
        evidence.push({ path: rel, bytes: buffer.byteLength, sha256: sha256(buffer) });
      } else {
        throw new Error(`Non-regular release entry is prohibited: ${rel}`);
      }
    }
  }

  await visit(canonicalRoot);
  return evidence.sort((left, right) => left.path.localeCompare(right.path));
}

export async function verifyFileEvidence(root, expected) {
  const actual = await inspectPhysicalTree(root);
  if (actual.length !== expected.length) throw new Error(`Release inventory mismatch: expected ${expected.length}, found ${actual.length}`);
  for (let index = 0; index < expected.length; index += 1) {
    const wanted = expected[index];
    const found = actual[index];
    if (wanted.path !== found.path || wanted.bytes !== found.bytes || wanted.sha256 !== found.sha256) {
      throw new Error(`Release hash mismatch: ${wanted.path}`);
    }
  }
  return actual;
}

export async function verifyProhibitedContent(root, evidence) {
  for (const file of evidence) {
    if (!textExtensions.has(extension(file.path))) continue;
    const content = await readFile(resolve(root, file.path), "utf8");
    for (const prohibited of prohibitedContentPatterns) {
      if (prohibited.pattern.test(content)) throw new Error(`Prohibited content (${prohibited.name}) in ${file.path}`);
    }
  }
}
