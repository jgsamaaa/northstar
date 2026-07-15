import assert from "node:assert/strict";
import test from "node:test";

async function request(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...init.headers }, ...init }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the Northstar homepage", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /One connected system/);
  assert.match(html, /Product demonstration/i);
  assert.match(html, /Complete Business System/);
  assert.match(html, /Northstar Systems/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders every public route without broken internal pages", async () => {
  const routes = ["/services", "/services/websites", "/services/booking", "/services/pos-inventory", "/services/ai-automation", "/services/automation-integrations", "/services/support-maintenance", "/industries", "/about", "/contact", "/privacy", "/terms"];
  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /Northstar Systems/, route);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/, route);
  }
});

test("serves SEO discovery files", async () => {
  const [robots, sitemap] = await Promise.all([request("/robots.txt"), request("/sitemap.xml")]);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /sitemap/i);
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /services\/booking/);
});

test("rejects invalid contact submissions server-side", async () => {
  const response = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "A" }),
  });
  assert.equal(response.status, 400);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.ok(result.fieldErrors);
});

test("does not fake contact success when email delivery is unconfigured", async () => {
  const response = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Juan Dela Cruz", business: "North Test", email: "juan@example.com", phone: "+639171234567",
      city: "Cebu City", industry: "Retail businesses", currentWebsite: "", services: "Website",
      budget: "₱30,000–₱60,000", timeline: "Within 1–2 months",
      challenge: "We need a clearer website inquiry and inventory workflow.", consent: true, companyWebsite: "",
    }),
  });
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
});
