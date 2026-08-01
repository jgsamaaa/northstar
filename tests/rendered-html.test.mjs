import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(html, /POS, inventory, and custom systems/);
  assert.match(html, /Product demonstration/i);
  assert.match(html, /Built for businesses where every customer handoff matters/);
  assert.match(html, /Real work, presented with honest context/);
  assert.match(html, /Aloha Beach Resort/);
  assert.match(html, /TOP ASIA/);
  assert.doesNotMatch(html, /Northstar FleetOps/);
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

test("renders the approved product ladder with honest scope boundaries", async () => {
  const response = await request("/packages");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const offer of [
    ["Starter Static Website", "US$200"],
    ["Business Website", "US$400"],
    ["Booking Website", "From US$800"],
    ["POS &amp; Inventory Implementation", "From US$800"],
    ["Hotel &amp; Resort Reservation Website", "From US$1,200"],
    ["Custom Inventory System", "From US$1,500"],
    ["Custom POS System", "From US$3,000"],
  ]) {
    assert.match(html, new RegExp(offer[0]));
    assert.match(html, new RegExp(offer[1].replaceAll("$", "\\$")));
  }

  assert.match(html, /No contact form or lead storage/);
  assert.match(html, /Form delivery tested with the client inbox/);
  assert.match(html, /Domain connection/);
  assert.match(html, /client purchases and owns the domain/i);
  assert.match(html, /Live availability is promised only when a supported inventory source is connected/);
  assert.match(html, /No BIR-accreditation claim without the required approval process/);
  assert.match(html, /Clear website, booking, POS and inventory implementation, and custom-system starting prices/);
  assert.doesNotMatch(html, /Complete Business System/);
  assert.doesNotMatch(html, /complete business system packages/i);
});

test("keeps inquiry and AI catalogue options aligned with published products", async () => {
  const contactResponse = await request("/contact");
  const contactHtml = await contactResponse.text();
  for (const option of ["Starter static website", "Business website with contact form", "Appointment booking website", "Hotel or resort reservation website", "POS and inventory implementation", "Custom inventory or POS system"]) {
    assert.match(contactHtml, new RegExp(option));
  }
  assert.doesNotMatch(contactHtml, /Complete business system/);

  const chatRoute = await readFile(new URL("../app/api/chat/route.ts", import.meta.url), "utf8");
  assert.match(chatRoute, /advancedSystems/);
  assert.match(chatRoute, /packageAddOns/);
  assert.match(chatRoute, /name, price, description/);
  assert.match(chatRoute, /published starting price exactly/);
});

test("renders an honest, data-driven project index", async () => {
  const response = await request("/projects");
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const project of [
    ["TOP ASIA", "https://topasia.vercel.app/"],
    ["Woodvelly", "https://nature1-sigma.vercel.app/"],
    ["DR. B. Dental Clinic", "https://dentistb.vercel.app/"],
    ["Sight Expert Eye Care Clinic", "https://eyesight-kappa.vercel.app/"],
    ["Amihan Ridge", "https://amihan-six.vercel.app/"],
    ["Aloha Beach Resort", "https://aloharesort.vercel.app/"],
  ]) {
    assert.match(html, new RegExp(project[0].replaceAll(".", "\\.")));
    assert.match(html, new RegExp(project[1].replaceAll(".", "\\.")));
  }
  assert.match(html, /Live concept/);
  assert.match(html, /No invented outcomes or client claims/);
  assert.doesNotMatch(html, /Northstar FleetOps|increased revenue|conversion rate|trusted by/i);
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

test("accepts bounded prior AI responses in multi-turn conversations", async () => {
  const response = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "assistant", content: "A".repeat(1200) },
        { role: "user", content: "What should I do next?" },
      ],
    }),
  });
  assert.notEqual(response.status, 400);
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
