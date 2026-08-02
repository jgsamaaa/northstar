import assert from "node:assert/strict";
import test from "node:test";

const { isExpectedCanceledRscPrefetch } = await import("./e2e/request-failure-classification.ts");

test("only canceled non-navigation RSC fetches are expected speculative failures", () => {
  const expected = { url: "https://northstar.invalid/projects?_rsc=abc", resourceType: "fetch", errorText: "net::ERR_ABORTED", navigation: false };
  assert.equal(isExpectedCanceledRscPrefetch(expected), true);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, navigation: true }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, resourceType: "document" }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, resourceType: "script" }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, url: "https://northstar.invalid/projects" }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, errorText: "net::ERR_FAILED" }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, errorText: "net::ERR_ABORTED_BY_CLIENT" }), false);
  assert.equal(isExpectedCanceledRscPrefetch({ ...expected, errorText: "prefix ERR_ABORTED suffix" }), false);
});
