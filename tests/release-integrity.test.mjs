import assert from "node:assert/strict";
import { mkdir, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const { assertSafeRelativePath, inspectPhysicalTree, verifyFileEvidence, verifyProhibitedContent } = await import("../scripts/release-integrity.mjs");

async function fixture(t) {
  const root = join(tmpdir(), `northstar-integrity-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  t.after(async () => { await import("node:fs/promises").then(({ rm }) => rm(root, { recursive: true, force: true })); });
  return root;
}

test("release paths reject absolute and escaping forms", () => {
  for (const path of ["../secret", "app/../../secret", "/absolute", "C:/absolute", "app\\escape.ts", "app//double.ts"]) {
    assert.throws(() => assertSafeRelativePath(path));
  }
  assert.equal(assertSafeRelativePath("app/api/chat/route.ts"), "app/api/chat/route.ts");
});

test("physical inventory rejects symbolic links", async (t) => {
  const root = await fixture(t);
  await writeFile(join(root, "real.txt"), "safe");
  try {
    await symlink(join(root, "real.txt"), join(root, "linked.txt"), "file");
  } catch (error) {
    if (error?.code === "EPERM") {
      t.skip("Windows symlink creation requires developer mode or elevated privileges");
      return;
    }
    throw error;
  }
  await assert.rejects(() => inspectPhysicalTree(root), /symbolic link/i);
});

test("physical inventory and hashes detect changes", async (t) => {
  const root = await fixture(t);
  await mkdir(join(root, "app"));
  await writeFile(join(root, "app", "safe.txt"), "first");
  const evidence = await inspectPhysicalTree(root);
  assert.deepEqual(evidence.map(({ path }) => path), ["app/safe.txt"]);
  await verifyFileEvidence(root, evidence);
  await writeFile(join(root, "app", "safe.txt"), "changed");
  await assert.rejects(() => verifyFileEvidence(root, evidence), /hash mismatch/i);
});

test("prohibited release content is rejected without scanning binary assets as text", async (t) => {
  const root = await fixture(t);
  const fakeToken = "gh" + "p_" + "abcdefghijklmnopqrstuvwxyz1234567890";
  await writeFile(join(root, "safe.ts"), `const token = '${fakeToken}';`);
  const evidence = await inspectPhysicalTree(root);
  await assert.rejects(() => verifyProhibitedContent(root, evidence), /prohibited content/i);
});

test("empty secret placeholders do not consume the following environment assignment", async (t) => {
  const root = await fixture(t);
  await writeFile(
    join(root, ".env.example"),
    ["RESEND_API_KEY=", "CONTACT_TO_EMAIL=", "CONTACT_FROM_EMAIL=Example <hello@example.test>", ""].join("\n"),
  );
  const evidence = await inspectPhysicalTree(root);
  await assert.doesNotReject(() => verifyProhibitedContent(root, evidence));
});

test("release allowlist includes the request-failure classifier and its canonical regression", async () => {
  const allowlist = JSON.parse(await readFile(new URL("../scripts/release-allowed-paths.json", import.meta.url), "utf8"));
  assert.ok(allowlist.allowedPaths.includes("tests/e2e/request-failure-classification.ts"));
  assert.ok(allowlist.allowedPaths.includes("tests/request-failure-classification.test.mjs"));
});
