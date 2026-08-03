import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const renderedTestPath = new URL("../tests/rendered-html.test.mjs", import.meta.url);
const renderedSource = await readFile(renderedTestPath, "utf8");
const renderedTestCount = renderedSource.match(/^test\(/gm)?.length ?? 0;
assert.equal(renderedTestCount, 18, "The release contract requires exactly 18 rendered runtime tests");
await readFile(new URL("../.next/BUILD_ID", import.meta.url), "utf8");

const port = Number(process.env.RENDERED_TEST_PORT || 4300 + (process.pid % 500));
assert.ok(Number.isInteger(port) && port >= 1024 && port <= 65535, "Invalid rendered-test port");
const baseURL = `http://127.0.0.1:${port}`;
const nextBin = await import.meta.resolve("next/dist/bin/next");
const server = spawn(process.execPath, [fileURLToPath(nextBin), "start", "-H", "127.0.0.1", "-p", String(port)], {
  cwd: root,
  env: {
    ...process.env,
    AI_GATEWAY_API_KEY: "",
    VERCEL_OIDC_TOKEN: "",
    NEXT_TELEMETRY_DISABLED: "1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk; process.stdout.write(chunk); });
server.stderr.on("data", (chunk) => { serverOutput += chunk; process.stderr.write(chunk); });

async function waitUntilReady() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Next.js exited before readiness (${server.exitCode})\n${serverOutput}`);
    try {
      const response = await fetch(baseURL, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Next.js did not become ready at ${baseURL}\n${serverOutput}`);
}

try {
  await waitUntilReady();
  const tests = spawn(process.execPath, ["--test", "tests/rendered-html.test.mjs"], {
    cwd: root,
    env: { ...process.env, TEST_BASE_URL: baseURL },
    stdio: "inherit",
  });
  const exitCode = await new Promise((resolve, reject) => {
    tests.once("error", reject);
    tests.once("exit", (code) => resolve(code ?? 1));
  });
  if (exitCode !== 0) process.exitCode = exitCode;
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}
