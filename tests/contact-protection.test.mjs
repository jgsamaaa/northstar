import assert from "node:assert/strict";
import test from "node:test";

const { createInMemoryContactProtection, readBoundedUtf8Body, withDuplicateReservation } = await import("../app/api/contact/request-protection.ts");

test("contact protection blocks the sixth attempt and resets after the window", () => {
  const protection = createInMemoryContactProtection({ windowMs: 1_000, maxRequests: 5, maxEntries: 20 });
  for (let attempt = 0; attempt < 5; attempt += 1) assert.equal(protection.isRateLimited("client", 100), false);
  assert.equal(protection.isRateLimited("client", 100), true);
  assert.equal(protection.isRateLimited("client", 1_101), false);
});

test("contact protection bounds storage and removes expired entries", () => {
  const protection = createInMemoryContactProtection({ windowMs: 100, maxRequests: 5, maxEntries: 2 });
  protection.isRateLimited("one", 0);
  protection.isRateLimited("two", 0);
  protection.isRateLimited("three", 0);
  assert.ok(protection.entryCount() <= 2);
  protection.isRateLimited("four", 101);
  assert.ok(protection.entryCount() <= 2);
});

test("duplicate reservation is atomic within the active backend", async () => {
  const protection = createInMemoryContactProtection({ windowMs: 1_000, maxRequests: 5, maxEntries: 20 });
  let deliveries = 0;
  const operation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    deliveries += 1;
    return true;
  };
  const [first, second] = await Promise.all([
    withDuplicateReservation(protection, "same", operation, 100),
    withDuplicateReservation(protection, "same", operation, 100),
  ]);
  assert.deepEqual(new Set([first, second]), new Set(["success", "duplicate"]));
  assert.equal(deliveries, 1);
});

test("provider failure releases duplicate reservation and permits legitimate retry", async () => {
  const protection = createInMemoryContactProtection({ windowMs: 1_000, maxRequests: 5, maxEntries: 20 });
  const failure = await withDuplicateReservation(protection, "retry", async () => false, 100);
  assert.equal(failure, "failed");
  const retry = await withDuplicateReservation(protection, "retry", async () => true, 101);
  assert.equal(retry, "success");
});

test("successful duplicate submission is rejected until expiry", async () => {
  const protection = createInMemoryContactProtection({ windowMs: 1_000, maxRequests: 5, maxEntries: 20 });
  assert.equal(await withDuplicateReservation(protection, "repeat", async () => true, 100), "success");
  assert.equal(await withDuplicateReservation(protection, "repeat", async () => true, 101), "duplicate");
  assert.equal(await withDuplicateReservation(protection, "repeat", async () => true, 1_101), "success");
});

for (const declaredLength of [undefined, "1"]) {
  test(`contact body reader cancels an oversized stream with ${declaredLength ? "understated" : "omitted"} content-length`, async () => {
    let canceled = false;
    let pulls = 0;
    const body = new ReadableStream({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(pulls === 1 ? 32 * 1024 : 1));
      },
      cancel() {
        canceled = true;
      },
    });
    const headers = new Headers({ "content-type": "application/json", "x-forwarded-for": declaredLength ? "198.51.100.31" : "198.51.100.30" });
    if (declaredLength) headers.set("content-length", declaredLength);
    const request = new Request("https://northstar.invalid/api/contact", { method: "POST", headers, body, duplex: "half" });

    const result = await readBoundedUtf8Body(request, 32 * 1024);

    assert.equal(result, null);
    assert.equal(canceled, true);
    assert.equal(pulls, 2);
  });
}
