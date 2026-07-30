import assert from "node:assert/strict";
import test from "node:test";

async function request(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...init.headers }, ...init }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders a focused, credible Northstar homepage", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Websites that help Philippine businesses earn trust and win more inquiries/);
  assert.match(html, /Website design and development/);
  assert.match(html, /Booking and business operations/);
  assert.match(html, /Automation and ongoing support/);
  assert.match(html, /Product demonstration/i);
  assert.match(html, /Built for businesses where every customer handoff matters/);
  assert.match(html, /Real work, presented with honest context/);
  assert.match(html, /Aloha Beach Resort/);
  assert.match(html, /Northstar FleetOps/);
  assert.match(html, /A clear process, without the usual agency fog/);
  assert.match(html, /Request a Free Systems Audit/);
  assert.match(html, /href="\/services\/websites"/);
  assert.match(html, /href="\/industries"/);
  assert.match(html, /href="\/projects"/);
  assert.match(html, /href="\/packages"/);
  assert.match(html, /href="\/contact"/);

  assert.doesNotMatch(html, /EARLY CLIENT FEEDBACK|Mara L\.|Paolo R\.|Denise C\.|temporary launch copy/);
  assert.doesNotMatch(html, /Everything your business needs to operate online/);
  assert.doesNotMatch(html, /Complete Business System/);
  assert.doesNotMatch(html, /FOUNDING CLIENT PROGRAM · 3 PHILIPPINE BUSINESSES/);
  assert.doesNotMatch(html, /What happens next/);
  assert.doesNotMatch(html, /Step 1 of 2|Estimated project investment|Preferred project timeline/);
  assert.doesNotMatch(html, /₱(?:25|40|45|75)k/i);
  assert.doesNotMatch(html, /future founder photograph|replace with James|portrait placeholder/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders every public route without broken internal pages", async () => {
  const routes = ["/services", "/services/websites", "/services/booking", "/services/pos-inventory", "/services/ai-automation", "/services/automation-integrations", "/services/support-maintenance", "/projects", "/industries", "/how-it-works", "/packages", "/about", "/contact", "/privacy", "/terms"];
  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /Northstar Systems/, route);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/, route);
  }
});

test("renders an honest, data-driven project index", async () => {
  const response = await request("/projects");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Aloha Beach Resort/);
  assert.match(html, /Presentation-ready concept/);
  assert.match(html, /Northstar FleetOps/);
  assert.match(html, /In development/);
  assert.match(html, /No invented outcomes or client claims/);
  assert.doesNotMatch(html, /increased revenue|conversion rate|trusted by/i);
});

test("keeps personal founder identity off public pages", async () => {
  for (const path of ["/", "/about"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.doesNotMatch(html, /James Gabriel|FROM THE FOUNDER|founder-james-gabriel\.jpeg/i, path);
  }

  const about = await request("/about");
  const html = await about.text();
  assert.match(html, /ABOUT NORTHSTAR SYSTEMS/);
  assert.match(html, /Practical digital systems built to help Philippine businesses move forward/);
  assert.match(html, /The goal is not to add more software for its own sake/);
});

test("renders an accessible AI assistant launcher on every public page", async () => {
  for (const path of ["/", "/projects", "/about", "/contact"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /Ask Northstar/, path);
    assert.match(html, /aria-haspopup="dialog"/, path);
    assert.match(html, /AI assistant/, path);
  }
});

test("rejects invalid AI chat submissions server-side", async () => {
  const response = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "" }] }),
  });
  assert.equal(response.status, 400);
  const result = await response.json();
  assert.equal(result.ok, false);
});

test("serves SEO discovery files", async () => {
  const [robots, sitemap] = await Promise.all([request("/robots.txt"), request("/sitemap.xml")]);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /sitemap/i);
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  assert.match(sitemapText, /services\/booking/);
  assert.match(sitemapText, /how-it-works/);
  assert.match(sitemapText, /packages/);
  assert.match(sitemapText, /projects/);
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
      name: "Juan Dela Cruz", business: "North Test", contact: "juan@example.com",
      currentWebsite: "", services: "Professional website",
      challenge: "We need a clearer website inquiry and inventory workflow.", consent: true, companyWebsite: "",
    }),
  });
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
});
