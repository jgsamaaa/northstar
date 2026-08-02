import assert from "node:assert/strict";
import test from "node:test";

const { createInMemoryChatRateLimiter, normalizeClientKey } = await import("../app/api/chat/request-protection.ts");

test("chat protection blocks the sixth request and reports retry timing", () => {
  const limiter = createInMemoryChatRateLimiter({ windowMs: 1_000, maxRequests: 5, maxEntries: 20 });
  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.deepEqual(limiter.consume("client", 100), { limited: false, retryAfterSeconds: 0 });
  }
  assert.deepEqual(limiter.consume("client", 100), { limited: true, retryAfterSeconds: 1 });
});

test("chat protection resets after expiry", () => {
  const limiter = createInMemoryChatRateLimiter({ windowMs: 1_000, maxRequests: 1, maxEntries: 20 });
  assert.equal(limiter.consume("client", 100).limited, false);
  assert.equal(limiter.consume("client", 100).limited, true);
  assert.equal(limiter.consume("client", 1_100).limited, false);
});

test("chat protection storage remains bounded while expired entries are removed", () => {
  const limiter = createInMemoryChatRateLimiter({ windowMs: 100, maxRequests: 5, maxEntries: 2 });
  limiter.consume("one", 0);
  limiter.consume("two", 0);
  limiter.consume("three", 0);
  assert.ok(limiter.entryCount() <= 2);
  limiter.consume("four", 101);
  assert.ok(limiter.entryCount() <= 2);
});

test("chat client keys are normalized and bounded", () => {
  assert.equal(normalizeClientKey(" 2001:DB8::1 "), "2001:db8::1");
  assert.equal(normalizeClientKey("198.51.100.7, 203.0.113.4"), "198.51.100.7");
  assert.equal(normalizeClientKey("   "), "unknown");
  assert.ok(normalizeClientKey("X".repeat(1_000)).length <= 128);
});
