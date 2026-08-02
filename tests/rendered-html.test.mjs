import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

async function request(path = "/", init = {}) {
  const { origin = process.env.TEST_BASE_URL, ...requestInit } = init;
  assert.ok(origin, "TEST_BASE_URL must point to the freshly built Next.js production server");
  return fetch(new URL(path, origin), {
    headers: { accept: "text/html", ...requestInit.headers },
    ...requestInit,
  });
}

const publicRoutes = ["/", "/services", "/services/websites", "/services/booking", "/services/pos-inventory", "/services/ai-automation", "/services/automation-integrations", "/services/support-maintenance", "/projects", "/industries", "/how-it-works", "/packages", "/about", "/contact", "/privacy", "/terms"];
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

function inspectConfiguredPublicUrl(value) {
  return spawnSync(process.execPath, [
    "--experimental-strip-types",
    "--input-type=module",
    "--eval",
    "const config = await import(`./app/site-config.ts?test=${Date.now()}`); console.log(config.publicSiteUrl);",
  ], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: value },
  });
}

function inspectConfiguredContactEmail(email, emailConfigured) {
  return spawnSync(process.execPath, [
    "--experimental-strip-types",
    "--input-type=module",
    "--eval",
    `const config = await import(\`./app/site-config.ts?test=${Date.now()}\`); console.log(JSON.stringify(config.resolveConfiguredContactEmail(${JSON.stringify({ email, emailConfigured })})));`,
  ], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
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
  for (const featuredProject of ["TOP ASIA", "Bukidnon", "Hidden Gardens Resort", "The Petite Creamery"]) {
    assert.match(html, new RegExp(featuredProject));
  }
  assert.doesNotMatch(html, /DR\. B\. Dental Clinic|Sight Expert Eye Care Clinic|Aloha Beach Resort|TeachReady Abroad|The Aureline|Redotest/);
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
  for (const route of publicRoutes.slice(1)) {
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
    ["Starter Static Website", "₱15,000"],
    ["Business Website", "₱25,000"],
    ["Booking Website", "From ₱50,000"],
    ["POS &amp; Inventory Implementation", "From ₱50,000"],
    ["Hotel &amp; Resort Reservation Website", "From ₱72,000"],
    ["Custom Inventory System", "From ₱90,000"],
    ["Custom POS System", "From ₱180,000"],
  ]) {
    assert.match(html, new RegExp(offer[0]));
    assert.match(html, new RegExp(offer[1].replaceAll("$", "\\$")));
  }

  assert.match(html, /No contact form or lead storage/);
  assert.match(html, /Form delivery tested with the client inbox/);
  assert.match(html, /Domain connection/);
  assert.match(html, /client purchases and owns the domain/i);
  assert.match(html, /Prices in Philippine pesos/);
  assert.doesNotMatch(html, /US\$/);
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
    ["Bukidnon", "https://bukidnon-five.vercel.app/"],
    ["Caffelio’s Origin", "https://coffee1-seven.vercel.app/"],
    ["Hidden Gardens Resort", "https://hiddenresort.vercel.app/"],
    ["TeachReady Abroad", "https://www.teachreadyabroad.com/"],
    ["The Aureline", "https://port1-sage.vercel.app/"],
    ["Amara Ridge", "https://dalisay-cove-resort.vercel.app/"],
    ["Lilee’s Farm Resort", "https://lilifarm.vercel.app/"],
    ["The Petite Creamery", "https://cream-sigma.vercel.app/"],
    ["Redotest", "https://redotest.com/"],
  ]) {
    assert.match(html, new RegExp(project[0].replaceAll(".", "\\.")));
    assert.match(html, new RegExp(project[1].replaceAll(".", "\\.")));
  }
  assert.match(html, /Live concept/);
  assert.match(html, /No invented outcomes or client claims/);
  assert.match(html, /service tags describe the disciplines demonstrated/i);
  assert.match(html, /do not, by themselves, claim a paid client engagement, endorsement, or production adoption/i);
  assert.match(html, /direct inquiry actions/i);
  assert.match(html, /Stay-inquiry journey/i);
  assert.match(html, /planned spa experience/i);
  assert.match(html, /legacy Dalisay Cove deployment hostname/i);
  assert.doesNotMatch(html, /direct booking actions|Booking journey|spa setting/i);
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
    assert.match(html, /aria-controls="northstar-ai-assistant"/, path);
    assert.match(html, /aria-expanded="false"/, path);
    assert.doesNotMatch(html, /aria-haspopup="dialog"/, path);
    assert.match(html, /AI assistant/, path);
  }
});

test("rejects malformed, oversized, invalid, and rate-limited AI chat requests before provider access", async () => {
  const malformed = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.41" },
    body: "{not-json",
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { ok: false, error: "The request could not be read." });

  const oversizedText = JSON.stringify({ messages: [{ role: "user", content: "界".repeat(12_000) }] });
  assert.ok(new TextEncoder().encode(oversizedText).byteLength > 32 * 1024);
  const declaredOversized = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": String(new TextEncoder().encode(oversizedText).byteLength), "x-forwarded-for": "198.51.100.42" },
    body: oversizedText,
  });
  assert.equal(declaredOversized.status, 413);

  const actualOversized = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.43" },
    body: oversizedText,
  });
  assert.equal(actualOversized.status, 413);

  const invalid = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.44" },
    body: JSON.stringify({ messages: [{ role: "user", content: "" }] }),
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).ok, false);

  let limited;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    limited = await request("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.45" },
      body: "{bad-json",
    });
  }
  assert.equal(limited.status, 429);
  assert.match(limited.headers.get("retry-after") ?? "", /^\d+$/);
  assert.deepEqual(await limited.json(), { ok: false, error: "Too many requests. Please try again later." });
});

test("accepts bounded prior AI responses and fails generically when provider config is missing", async () => {
  const response = await request("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.46" },
    body: JSON.stringify({
      messages: [
        { role: "assistant", content: "A".repeat(1200) },
        { role: "user", content: "What should I do next?" },
      ],
    }),
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "The assistant is unavailable. Please use the contact form." });
});

test("serves branded SEO discovery files and canonicals for all public routes", async () => {
  const [robots, sitemap] = await Promise.all([request("/robots.txt"), request("/sitemap.xml")]);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap:\s*https:\/\/northstarsystems\.ph\/sitemap\.xml/i);
  assert.equal(sitemap.status, 200);
  const sitemapText = await sitemap.text();
  const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(sitemapUrls.length, 16);
  assert.ok(sitemapUrls.every((url) => url.startsWith("https://northstarsystems.ph")));
  assert.deepEqual(sitemapUrls.map((url) => new URL(url).pathname), publicRoutes);
  const sitemapDates = [...sitemapText.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
  assert.ok(new Set(sitemapDates).size > 1, "sitemap should use maintainable route-level modification dates");

  for (const route of publicRoutes) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const expected = `https://northstarsystems.ph${route === "/" ? "" : route}`;
    assert.match(html, new RegExp(`rel="canonical" href="${expected.replaceAll("/", "\\/")}"`), route);
    assert.match(html, new RegExp(`property="og:url" content="${expected.replaceAll("/", "\\/")}"`), route);
    assert.doesNotMatch(html, /northstar-three-liard\.vercel\.app/i, route);
  }

  const homepage = await (await request("/")).text();
  assert.match(homepage, /https:\/\/northstarsystems\.ph\/#organization/);
  assert.match(homepage, /https:\/\/northstarsystems\.ph\/#business/);
});

test("validates the single public production origin from the environment", async () => {
  const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  assert.match(envExample, /^NEXT_PUBLIC_SITE_URL=https:\/\/northstarsystems\.ph$/m);

  for (const accepted of ["https://northstarsystems.ph", "https://northstarsystems.ph/"]) {
    const result = inspectConfiguredPublicUrl(accepted);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), "https://northstarsystems.ph");
  }

  for (const rejected of [
    "https://northstar-three-liard.vercel.app",
    "http://northstarsystems.ph",
    "https://northstarsystems.ph/projects",
    "not-a-url",
  ]) {
    const result = inspectConfiguredPublicUrl(rejected);
    assert.notEqual(result.status, 0, rejected);
  }

  const disabled = inspectConfiguredContactEmail("hello@northstarsystems.ph", false);
  assert.equal(disabled.status, 0, disabled.stderr);
  assert.equal(disabled.stdout.trim(), "null");

  const enabled = inspectConfiguredContactEmail("hello@northstarsystems.ph", true);
  assert.equal(enabled.status, 0, enabled.stderr);
  assert.equal(enabled.stdout.trim(), '"hello@northstarsystems.ph"');

  const empty = inspectConfiguredContactEmail("   ", true);
  assert.equal(empty.status, 0, empty.stderr);
  assert.equal(empty.stdout.trim(), "null");

  for (const route of ["/", "/contact", "/privacy", "/terms"]) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.doesNotMatch(html, /mailto:/i, route);
    assert.doesNotMatch(html, /hello@northstarsystems\.ph/i, route);
  }

  const contactHtml = await (await request("/contact")).text();
  assert.doesNotMatch(contactHtml, /Prefer to message us directly\?/i);
  assert.match(contactHtml, /Request a Free Systems Audit/);
  const privacyHtml = await (await request("/privacy")).text();
  assert.match(privacyHtml, /Privacy questions can be submitted through the Northstar Systems inquiry form/);
  const termsHtml = await (await request("/terms")).text();
  assert.match(termsHtml, /Questions about these terms can be submitted through the Northstar Systems inquiry form/);
});

test("redirects Vercel, www, and HTTP hosts to the matching branded path and query", async () => {
  const legacy = await request("/projects?campaign=legacy&source=vercel", {
    headers: { "x-forwarded-host": "northstar-three-liard.vercel.app", "x-forwarded-proto": "https" },
    redirect: "manual",
  });
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get("location"), "https://northstarsystems.ph/projects?campaign=legacy&source=vercel");

  const preview = await request("/projects?campaign=preview&source=sentinel", {
    headers: { "x-forwarded-host": "northstar-preview-example.vercel.app", "x-forwarded-proto": "https" },
    redirect: "manual",
  });
  assert.equal(preview.status, 308);
  assert.equal(preview.headers.get("location"), "https://northstarsystems.ph/projects?campaign=preview&source=sentinel");

  const www = await request("/services?source=www", {
    headers: { "x-forwarded-host": "www.northstarsystems.ph", "x-forwarded-proto": "https" },
    redirect: "manual",
  });
  assert.equal(www.status, 308);
  assert.equal(www.headers.get("location"), "https://northstarsystems.ph/services?source=www");

  const insecureApex = await request("/contact?source=http", {
    headers: { "x-forwarded-host": "northstarsystems.ph", "x-forwarded-proto": "http" },
    redirect: "manual",
  });
  assert.equal(insecureApex.status, 308);
  assert.equal(insecureApex.headers.get("location"), "https://northstarsystems.ph/contact?source=http");

  const localhost = await request("/projects?source=local", { redirect: "manual" });
  assert.equal(localhost.status, 200);

  for (const hostileHost of ["attacker.example", "northstarsystems.ph.attacker.example"]) {
    const hostile = await request("/projects?next=https://attacker.example", {
      headers: { "x-forwarded-host": hostileHost, "x-forwarded-proto": "https" },
      redirect: "manual",
    });
    assert.equal(hostile.status, 200, hostileHost);
    assert.equal(hostile.headers.get("location"), null, hostileHost);
    const html = await hostile.text();
    assert.match(html, /rel="canonical" href="https:\/\/northstarsystems\.ph\/projects"/, hostileHost);
    assert.doesNotMatch(html, /rel="canonical" href="[^"]*attacker/i, hostileHost);
  }
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
      currentWebsite: "", services: "Business website with contact form",
      challenge: "We need a clearer website inquiry and inventory workflow.", consent: true, companyWebsite: "",
    }),
  });
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
});

test("enforces matching client and server inquiry limits", async () => {
  const page = await request("/contact");
  const html = await page.text();
  for (const [name, maxLength] of [["name", 100], ["business", 150], ["contact", 200], ["challenge", 2000], ["currentWebsite", 500]]) {
    const control = html.match(new RegExp(`<(?:input|textarea)[^>]*name="${name}"[^>]*>`, "i"))?.[0];
    assert.ok(control, `${name} control`);
    assert.match(control, new RegExp(`maxlength="${maxLength}"`, "i"), name);
  }

  const valid = {
    name: "Juan Dela Cruz", business: "North Test", contact: "juan@example.com",
    currentWebsite: "https://example.com", services: "Business website with contact form",
    challenge: "We need a clearer website inquiry and inventory workflow.", consent: true, companyWebsite: "",
  };
  for (const [field, value] of [
    ["name", "N".repeat(101)], ["business", "B".repeat(151)], ["contact", "C".repeat(201)],
    ["challenge", "X".repeat(2001)], ["currentWebsite", `https://example.com/${"x".repeat(500)}`],
  ]) {
    const response = await request("/api/contact", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${field.length}` }, body: JSON.stringify({ ...valid, [field]: value }) });
    assert.equal(response.status, 400, field);
  }
  for (const override of [{ services: "Unknown service" }, { currentWebsite: "not a URL" }, { companyWebsite: "bot-filled" }]) {
    const response = await request("/api/contact", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": `203.0.113.${JSON.stringify(override).length}` }, body: JSON.stringify({ ...valid, ...override }) });
    assert.equal(response.status, 400, JSON.stringify(override));
  }
});

test("rejects oversized contact bodies before parsing and preserves 400 validation responses", async () => {
  const declaredPayload = "x".repeat(32 * 1024 + 1);
  const oversizedLength = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": String(new TextEncoder().encode(declaredPayload).byteLength), "x-forwarded-for": "198.51.100.201" },
    body: declaredPayload,
  });
  assert.equal(oversizedLength.status, 413);
  assert.deepEqual(await oversizedLength.json(), { ok: false, message: "The inquiry is too large." });

  const oversizedText = JSON.stringify({ challenge: "界".repeat(11_000) });
  assert.ok(new TextEncoder().encode(oversizedText).byteLength > 32 * 1024);
  const oversizedBody = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.202" },
    body: oversizedText,
  });
  assert.equal(oversizedBody.status, 413);

  const malformed = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.203" },
    body: "{not-json",
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { ok: false, message: "The request could not be read." });

  const schemaInvalid = await request("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.204" },
    body: JSON.stringify({ name: "A" }),
  });
  assert.equal(schemaInvalid.status, 400);
  assert.ok((await schemaInvalid.json()).fieldErrors);
});

test("serves a branded non-indexable 404 without a homepage canonical", async () => {
  const response = await request("/definitely-not-a-real-route");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /That page is off the map\./);
  assert.match(html, /name="robots" content="noindex"|content="noindex" name="robots"/);
  assert.doesNotMatch(html, /rel="canonical" href="http:\/\/localhost\/"/);
  assert.match(html, /Return home/);
  assert.match(html, /Explore services/);
  assert.match(html, /Free Systems Audit/);
});

test("configures restrictive production security headers", async () => {
  const [configSource, proxySource, layoutSource] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../proxy.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(proxySource, /frame-ancestors 'none'/);
  assert.match(proxySource, /default-src 'self'/);
  assert.match(proxySource, /script-src 'self' 'nonce-\$\{nonce\}' 'strict-dynamic'/);
  assert.doesNotMatch(proxySource, /script-src[^\n]*unsafe-inline|unsafe-eval|["']\*["']/);
  assert.match(proxySource, /style-src 'self' 'unsafe-inline'/);
  assert.match(proxySource, /crypto\.randomUUID\(\)/);
  assert.match(layoutSource, /nonce=\{nonce\}/);
  assert.match(configSource, /X-Content-Type-Options["'], value: ["']nosniff/);
  assert.match(configSource, /Referrer-Policy["'], value: ["']strict-origin-when-cross-origin/);
  assert.match(configSource, /Permissions-Policy/);
  assert.match(configSource, /poweredByHeader:\s*false/);

  const source = await readFile(new URL("../app/api/chat/route.ts", import.meta.url), "utf8");
  assert.match(source, /correlationId/);
  assert.match(source, /details\?\.error\?\.type/);
  assert.doesNotMatch(source, /details\?\.error\?\.message|No upstream message/);
});
