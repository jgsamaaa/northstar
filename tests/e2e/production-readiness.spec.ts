import { expect, test, type APIResponse, type ConsoleMessage, type Page } from "@playwright/test";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { isExpectedCanceledRscPrefetch, type RequestFailure } from "./request-failure-classification";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const evidenceDir = ".diagnostics/sentinel-readiness";
const portfolioEvidenceDir = ".diagnostics/portfolio-update";
const publicRoutes = [
  "/",
  "/services",
  "/services/websites",
  "/services/booking",
  "/services/pos-inventory",
  "/services/ai-automation",
  "/services/automation-integrations",
  "/services/support-maintenance",
  "/projects",
  "/industries",
  "/how-it-works",
  "/packages",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;
const sentinelViewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 700 },
] as const;

async function openHome(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
}

function collectUndersizedTargets() {
  const controls = document.querySelectorAll("a[href],button:not([disabled]),summary,input:not([disabled]):not([type='hidden']),select:not([disabled]),textarea:not([disabled])");
  return [...controls].flatMap((control) => {
    const element = control as HTMLElement;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (rect.width === 0 || rect.height === 0 || element.closest(".honeypot") || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return [];
    const label = element.matches("input[type='checkbox'],input[type='radio']") ? element.closest("label") : null;
    const targetRect = label?.getBoundingClientRect() ?? rect;
    const inlineTextException = element.tagName === "A" && style.display === "inline" && Boolean(element.closest("p,li,dd"));
    return !inlineTextException && (targetRect.width < 44 || targetRect.height < 44)
      ? [{ tag: element.tagName, text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 90), width: Math.round(targetRect.width * 10) / 10, height: Math.round(targetRect.height * 10) / 10 }]
      : [];
  });
}

function responseNonce(response: APIResponse) {
  return response.headers()["content-security-policy"]?.match(/script-src[^;]*'nonce-([^']+)'/)?.[1];
}

async function expectInlineScriptsToUseResponseNonce(response: APIResponse) {
  const nonce = responseNonce(response);
  expect(nonce).toBeTruthy();
  const html = await response.text();
  const inlineScriptAttributes = [...html.matchAll(/<script\b([^>]*)>/g)]
    .map((match) => match[1])
    .filter((attributes) => !/\bsrc=/i.test(attributes));
  expect(inlineScriptAttributes.length).toBeGreaterThan(0);
  for (const attributes of inlineScriptAttributes) {
    expect(attributes).toMatch(new RegExp(`\\bnonce="${nonce}"`));
  }
}

test.beforeAll(async () => {
  await mkdir(evidenceDir, { recursive: true });
  await mkdir(portfolioEvidenceDir, { recursive: true });
});

test("sitemap routes, navigation, icons, and branded 404 are production-correct", async ({ page, request }) => {
  const firstHome = await request.get("/");
  const secondHome = await request.get("/");
  const csp = firstHome.headers()["content-security-policy"];
  const nextCsp = secondHome.headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
  const nonce = csp.match(/script-src[^;]*'nonce-([^']+)'/)?.[1];
  const nextNonce = nextCsp.match(/script-src[^;]*'nonce-([^']+)'/)?.[1];
  expect(nonce).toBeTruthy();
  expect(nextNonce).toBeTruthy();
  expect(nextNonce).not.toBe(nonce);
  expect(csp.match(/script-src[^;]*/)?.[0]).not.toContain("'unsafe-inline'");
  expect(csp).not.toContain("'unsafe-eval'");
  expect(csp).toContain("style-src 'self' 'unsafe-inline'");
  expect(firstHome.headers()["x-content-type-options"]).toBe("nosniff");
  expect(firstHome.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(firstHome.headers()["permissions-policy"]).toBeTruthy();
  expect(firstHome.headers()["x-powered-by"]).toBeUndefined();
  const scriptNonces = [...(await firstHome.text()).matchAll(/<script[^>]*nonce="([^"]+)"/g)].map((match) => match[1]);
  expect(scriptNonces.length).toBeGreaterThan(1);
  expect(scriptNonces.every((value) => value === nonce)).toBe(true);

  for (const path of [
    "/",
    "/services",
    "/services/websites",
    "/services/booking",
    "/services/pos-inventory",
    "/services/ai-automation",
    "/services/automation-integrations",
    "/services/support-maintenance",
    "/definitely-not-a-real-route",
  ]) {
    await expectInlineScriptsToUseResponseNonce(await request.get(path));
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(sitemapUrls).toHaveLength(20);
  expect(sitemapUrls.every((url) => url.startsWith("https://northstarsystems.ph"))).toBe(true);
  for (const url of sitemapUrls) expect((await request.get(new URL(url).pathname)).status(), url).toBe(200);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap: https://northstarsystems.ph/sitemap.xml");

  const legacy = await request.get("/projects?campaign=legacy&source=vercel", {
    headers: { "x-forwarded-host": "northstar-three-liard.vercel.app", "x-forwarded-proto": "https" },
    maxRedirects: 0,
  });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("https://northstarsystems.ph/projects?campaign=legacy&source=vercel");
  const preview = await request.get("/projects", {
    headers: { "x-forwarded-host": "northstar-preview-example.vercel.app", "x-forwarded-proto": "https" },
    maxRedirects: 0,
  });
  expect(preview.status()).toBe(308);
  expect(preview.headers().location).toBe("https://northstarsystems.ph/projects");
  const hostile = await request.get("/projects?next=https://attacker.example", {
    headers: { "x-forwarded-host": "northstarsystems.ph.attacker.example", "x-forwarded-proto": "https" },
    maxRedirects: 0,
  });
  expect(hostile.status()).toBe(200);
  expect(hostile.headers().location).toBeUndefined();
  expect(await hostile.text()).toContain('rel="canonical" href="https://northstarsystems.ph/projects"');

  const icon = await request.get("/favicon.svg");
  expect(icon.status()).toBe(200);
  const appleIcon = await request.get("/apple-touch-icon.png");
  expect(appleIcon.status()).toBe(200);
  expect((await request.get("/icon-192.png")).status()).toBe(200);
  expect((await request.get("/icon-512.png")).status()).toBe(200);

  await openHome(page);
  const servicesLink = page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services", exact: true });
  await expect(servicesLink).toBeVisible();
  await servicesLink.click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Systems that move your business forward");
  const footer = page.locator(".site-footer");
  await expect(footer.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  await expect(footer.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  expect((await request.get("/privacy")).status()).toBe(200);
  expect((await request.get("/terms")).status()).toBe(200);

  const missing = await page.goto("/definitely-not-a-real-route", { waitUntil: "networkidle" });
  expect(missing?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found | Northstar Systems");
  await expect(page.locator('meta[name="robots"][content="noindex, nofollow"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "That page is off the map." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Return home/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore services" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Page recovery" }).getByRole("link", { name: /Free Systems Audit/ })).toBeVisible();
});

test("project grid aligns paired cards, previews, sections, and actions without overflow", async ({ page }) => {
  test.setTimeout(240_000);
  const desktopViewports = [
    { width: 1600, height: 1000 },
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
  ] as const;
  const stackedViewports = [
    { width: 900, height: 900 },
    { width: 768, height: 900 },
    { width: 430, height: 900 },
    { width: 390, height: 844 },
    { width: 375, height: 812 },
    { width: 320, height: 700 },
  ] as const;
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  for (const viewport of [...desktopViewports, ...stackedViewports]) {
    await page.setViewportSize(viewport);
    await page.goto("/projects", { waitUntil: "networkidle" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const grid = page.locator(".projects-page .project-grid");
    const cards = grid.locator("article");
    await expect(cards).toHaveCount(15);

    if (viewport.width === 1440) {
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        await expect.poll(() => card.locator(".project-preview-image img").evaluate((image) => {
          const preview = image as HTMLImageElement;
          return preview.complete && preview.naturalWidth > 0;
        })).toBe(true);
      }
    }

    const columnCount = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length);
    expect(columnCount, `${viewport.width}px project columns`).toBe(viewport.width >= 1024 ? 2 : 1);
    const metrics = await cards.evaluateAll((elements) => elements.map((card) => {
      const article = card as HTMLElement;
      const cardRect = article.getBoundingClientRect();
      const box = (selector: string) => article.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
      const visual = box(".project-visual");
      const preview = box(".project-preview-image");
      const badge = box(".project-preview-label");
      const meta = box(".project-meta");
      const title = box("h3");
      const summary = box(".project-card-copy > p");
      const services = box(".project-card-copy > ul");
      const outcome = box(".project-outcome");
      const footer = box(".project-card-footer");
      const liveLink = box(".project-live-link");
      const index = box(".project-index");
      const image = article.querySelector<HTMLImageElement>(".project-preview-image img")!;
      const meaningfulRight = Math.max(...[title, summary, services, outcome, footer, index].map(({ right }) => right));
      return {
        id: article.id,
        cardHeight: cardRect.height,
        cardWidth: cardRect.width,
        mediaHeight: visual.height,
        previewWidth: preview.width,
        previewHeight: preview.height,
        badgeLeftInset: badge.left - visual.left,
        badgeBottomInset: visual.bottom - badge.bottom,
        metaTop: meta.top - cardRect.top,
        titleTop: title.top - cardRect.top,
        titleBottom: title.bottom - cardRect.top,
        summaryTop: summary.top - cardRect.top,
        summaryBottom: summary.bottom - cardRect.top,
        servicesTop: services.top - cardRect.top,
        servicesBottom: services.bottom - cardRect.top,
        outcomeTop: outcome.top - cardRect.top,
        outcomeBottom: outcome.bottom - cardRect.top,
        footerTop: footer.top - cardRect.top,
        numberBaseline: index.bottom - cardRect.top,
        footerFits: liveLink.right <= index.left,
        contentContained: article.scrollWidth <= article.clientWidth && article.scrollHeight <= article.clientHeight + 1,
        headingFits: title.width <= cardRect.width && article.querySelector<HTMLElement>("h3")!.scrollWidth <= article.querySelector<HTMLElement>("h3")!.clientWidth,
        imageFit: getComputedStyle(image).objectFit,
        imagePosition: getComputedStyle(image).objectPosition,
        meaningfulRight,
      };
    }));

    const spread = (values: number[]) => Math.max(...values) - Math.min(...values);
    expect(spread(metrics.map(({ mediaHeight }) => mediaHeight)), `${viewport.width}px media heights`).toBeLessThanOrEqual(1);
    expect(spread(metrics.map(({ previewWidth }) => previewWidth)), `${viewport.width}px preview widths`).toBeLessThanOrEqual(1);
    expect(spread(metrics.map(({ previewHeight }) => previewHeight)), `${viewport.width}px preview heights`).toBeLessThanOrEqual(1);
    expect(metrics.every(({ previewWidth, previewHeight }) => Math.abs(previewWidth / previewHeight - 1.6) < 0.02), `${viewport.width}px preview ratios`).toBe(true);
    expect(spread(metrics.map(({ badgeLeftInset }) => badgeLeftInset)), `${viewport.width}px badge left insets`).toBeLessThanOrEqual(1);
    expect(spread(metrics.map(({ badgeBottomInset }) => badgeBottomInset)), `${viewport.width}px badge bottom insets`).toBeLessThanOrEqual(1);
    expect(metrics.every(({ footerFits, contentContained, headingFits, imageFit }) => footerFits && contentContained && headingFits && imageFit === "cover"), `${viewport.width}px card containment`).toBe(true);
    expect(new Set(metrics.map(({ imagePosition }) => imagePosition)).size, `${viewport.width}px image positions`).toBe(1);
    const sectionSpacingFailures = metrics.map(({ id, titleBottom, summaryTop, summaryBottom, servicesTop, servicesBottom, outcomeTop, outcomeBottom, footerTop }) => ({
      id,
      gaps: [summaryTop - titleBottom, servicesTop - summaryBottom, outcomeTop - servicesBottom, footerTop - outcomeBottom],
    })).filter(({ gaps }) => gaps.slice(0, 3).some((gap) => gap < 15.5 || gap > 32) || gaps[3] < 15.5);
    expect(sectionSpacingFailures, `${viewport.width}px section spacing`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${viewport.width}px document overflow`).toBe(true);
    const launcherBox = await page.locator(".ai-chat-launcher").boundingBox();
    expect(launcherBox, `${viewport.width}px assistant launcher`).not.toBeNull();
    const assistantExclusionFailures = metrics
      .filter(({ meaningfulRight }) => meaningfulRight > launcherBox!.x + .5)
      .map(({ id, meaningfulRight }) => ({ id, meaningfulRight, launcherLeft: launcherBox!.x }));
    expect(assistantExclusionFailures, `${viewport.width}px assistant horizontal exclusion`).toEqual([]);

    if (viewport.width >= 1024) {
      const alignedFields = ["cardHeight", "mediaHeight", "metaTop", "titleTop", "footerTop", "numberBaseline"] as const;
      for (let index = 0; index + 1 < metrics.length; index += 2) {
        for (const field of alignedFields) {
          expect(Math.abs(metrics[index][field] - metrics[index + 1][field]), `${viewport.width}px row ${index / 2 + 1} ${field}`).toBeLessThanOrEqual(1);
        }
      }
    } else {
      expect(metrics.every(({ cardWidth }) => cardWidth <= viewport.width), `${viewport.width}px card widths`).toBe(true);
      expect(await page.locator(".projects-page .project-live-link").evaluateAll((links) => links.every((link) => link.getBoundingClientRect().height >= 44)), `${viewport.width}px action targets`).toBe(true);
      for (const target of await page.locator(".project-card-footer").all()) {
        await target.evaluate((element) => element.scrollIntoView({ block: "center" }));
        const overlap = await page.evaluate(() => {
          const launcher = document.querySelector<HTMLElement>(".ai-chat-launcher")!.getBoundingClientRect();
          return [...document.querySelectorAll<HTMLElement>(".project-card-footer a,.project-status,.project-index")].some((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= innerHeight) return false;
            return launcher.left < rect.right && launcher.right > rect.left && launcher.top < rect.bottom && launcher.bottom > rect.top;
          });
        });
        expect(overlap, `${viewport.width}px assistant overlap`).toBe(false);
      }
    }

    for (const target of await page.locator(".final-cta .button,footer").all()) {
      await target.evaluate((element) => element.scrollIntoView({ block: "center" }));
      const overlap = await page.evaluate(() => {
        const launcher = document.querySelector<HTMLElement>(".ai-chat-launcher")!.getBoundingClientRect();
        return [...document.querySelectorAll<HTMLElement>(".final-cta .button,footer a")].some((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top >= innerHeight) return false;
          return launcher.left < rect.right && launcher.right > rect.left && launcher.top < rect.bottom && launcher.bottom > rect.top;
        });
      });
      expect(overlap, `${viewport.width}px assistant final-content overlap`).toBe(false);
    }
  }

  const liveLinks = page.locator(".project-live-link");
  await expect(liveLinks).toHaveCount(15);
  expect(await liveLinks.evaluateAll((links) => links.every((link) => {
    const anchor = link as HTMLAnchorElement;
    return anchor.href.startsWith("https://") && anchor.target === "_blank" && anchor.rel.includes("noreferrer");
  }))).toBe(true);
  expect(consoleErrors).toEqual([]);
});

test("Industries cards and Projects intro stay structured across desktop and mobile", async ({ page }) => {
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 768, height: 900 },
    { width: 390, height: 844 },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/industries", { waitUntil: "networkidle" });
    const industryGrid = page.locator(".industry-cards");
    const cards = industryGrid.locator(":scope > article");
    const recommendations = cards.locator(".industry-recommendation");
    await expect(cards).toHaveCount(6);
    await expect(recommendations).toHaveCount(6);
    const industryGeometry = await industryGrid.evaluate((element) => {
      const grid = element.getBoundingClientRect();
      const nav = element.querySelector<HTMLElement>(":scope > .hub-growth-links")!.getBoundingClientRect();
      const articles = [...element.querySelectorAll<HTMLElement>(":scope > article")].map((article) => article.getBoundingClientRect());
      const recommendationBlocks = [...element.querySelectorAll<HTMLElement>(".industry-recommendation")].map((block) => {
        const labelBox = block.querySelector<HTMLElement>(".industry-recommendation-label")!.getBoundingClientRect();
        const textBox = block.querySelector<HTMLElement>(".industry-recommendation-text")!.getBoundingClientRect();
        return {
          labelTag: block.querySelector<HTMLElement>(".industry-recommendation-label")!.tagName,
          textTag: block.querySelector<HTMLElement>(".industry-recommendation-text")!.tagName,
          gap: textBox.top - labelBox.bottom,
          contained: block.scrollWidth <= block.clientWidth && block.scrollHeight <= block.clientHeight,
        };
      });
      return { grid, nav, articles, recommendationBlocks };
    });
    expect(Math.abs(industryGeometry.nav.left - industryGeometry.articles[0].left), `${viewport.width}px guide-nav left`).toBeLessThanOrEqual(1);
    expect(Math.abs(industryGeometry.articles[viewport.width >= 1024 ? 1 : 0].right - industryGeometry.nav.right), `${viewport.width}px guide-nav right`).toBeLessThanOrEqual(1);
    expect(industryGeometry.nav.bottom, `${viewport.width}px guide-nav order`).toBeLessThan(industryGeometry.articles[0].top);
    expect(industryGeometry.recommendationBlocks.every(({ labelTag, textTag, gap, contained }) => labelTag === "SPAN" && textTag === "P" && gap >= 6 && contained), `${viewport.width}px recommendation structure`).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${viewport.width}px Industries overflow`).toBe(true);
    if (viewport.width >= 1024) {
      for (let index = 0; index < industryGeometry.articles.length; index += 2) {
        expect(Math.abs(industryGeometry.articles[index].top - industryGeometry.articles[index + 1].top), `${viewport.width}px Industries row ${index / 2 + 1} top`).toBeLessThanOrEqual(1);
        expect(Math.abs(industryGeometry.articles[index].height - industryGeometry.articles[index + 1].height), `${viewport.width}px Industries row ${index / 2 + 1} height`).toBeLessThanOrEqual(1);
      }
    }

    await page.goto("/projects", { waitUntil: "networkidle" });
    const projectsSection = page.locator(".projects-page");
    const introSupport = projectsSection.locator(".projects-intro-support");
    await expect(introSupport).toHaveCount(1);
    const projectsGeometry = await projectsSection.evaluate((element) => {
      const title = element.querySelector<HTMLElement>("h2")!.getBoundingClientRect();
      const intro = element.querySelector<HTMLElement>(".section-title")!.getBoundingClientRect();
      const summary = element.querySelector<HTMLElement>(".projects-intro-summary")!.getBoundingClientRect();
      const support = element.querySelector<HTMLElement>(".projects-intro-support")!.getBoundingClientRect();
      const context = element.querySelector<HTMLElement>(".portfolio-context")!.getBoundingClientRect();
      const nav = element.querySelector<HTMLElement>(".projects-intro-support .hub-growth-links")!.getBoundingClientRect();
      const grid = element.querySelector<HTMLElement>(".project-grid")!.getBoundingClientRect();
      const launcher = document.querySelector<HTMLElement>(".ai-chat-launcher")!.getBoundingClientRect();
      const titleRange = document.createRange();
      titleRange.selectNodeContents(element.querySelector<HTMLElement>("h2")!);
      const launcherOverlapsTitle = [...titleRange.getClientRects()].some((line) => launcher.left < line.right && launcher.right > line.left && launcher.top < line.bottom && launcher.bottom > line.top);
      return { title, intro, summary, support, context, nav, grid, launcherOverlapsTitle };
    });
    expect(projectsGeometry.support.top - projectsGeometry.intro.bottom, `${viewport.width}px Projects support gap`).toBeGreaterThanOrEqual(24);
    expect(projectsGeometry.grid.top - projectsGeometry.support.bottom, `${viewport.width}px Projects grid gap`).toBeGreaterThanOrEqual(40);
    expect(projectsGeometry.context.left, `${viewport.width}px Projects context left`).toBeGreaterThanOrEqual(projectsGeometry.support.left - 1);
    expect(projectsGeometry.nav.right, `${viewport.width}px Projects guide right`).toBeLessThanOrEqual(projectsGeometry.support.right + 1);
    expect(projectsGeometry.launcherOverlapsTitle, `${viewport.width}px Projects launcher/title overlap`).toBe(false);
    if (viewport.width >= 1024) {
      expect(projectsGeometry.summary.left, `${viewport.width}px Projects intro columns`).toBeGreaterThan(projectsGeometry.title.right);
      expect(projectsGeometry.nav.left, `${viewport.width}px Projects support columns`).toBeGreaterThan(projectsGeometry.context.right);
    } else {
      expect(projectsGeometry.summary.top, `${viewport.width}px Projects intro stack`).toBeGreaterThan(projectsGeometry.title.bottom);
      expect(projectsGeometry.nav.top - projectsGeometry.context.bottom, `${viewport.width}px Projects support stack`).toBeGreaterThanOrEqual(16);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${viewport.width}px Projects intro overflow`).toBe(true);
  }
});

test("assistant remains reachable without obscuring primary controls on any public route", async ({ page }) => {
  test.setTimeout(180_000);
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  const meaningfulSelector = "a,button,input,select,textarea,label";
  for (const viewport of sentinelViewports) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of publicRoutes) {
      await page.goto(path, { waitUntil: "networkidle" });
      const launcher = page.getByRole("button", { name: "Open Northstar AI assistant" });
      await expect(launcher).toBeVisible();
      expect(await launcher.evaluate((element) => getComputedStyle(element).position), `${path} at ${viewport.width}px position`).toBe("fixed");
      const launcherBox = await launcher.boundingBox();
      expect(launcherBox, `${path} at ${viewport.width}px launcher`).not.toBeNull();
      expect(launcherBox!.width).toBeGreaterThanOrEqual(44);
      expect(launcherBox!.height).toBeGreaterThanOrEqual(44);
      expect(launcherBox!.x).toBeGreaterThanOrEqual(0);
      expect(launcherBox!.y).toBeGreaterThanOrEqual(0);
      expect(launcherBox!.x + launcherBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(launcherBox!.y + launcherBox!.height).toBeLessThanOrEqual(viewport.height);
      if (path !== "/") continue;
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const maxScroll = Math.max(0, pageHeight - viewport.height);
      const stops = [...new Set([0, maxScroll])];
      for (const y of stops) {
        await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
        const intersections = await page.evaluate((selector) => {
          const launcher = document.querySelector<HTMLElement>(".ai-chat-launcher")!;
          const launcherRect = launcher.getBoundingClientRect();
          return [...document.querySelectorAll<HTMLElement>(selector)].flatMap((element) => {
            if (element === launcher || element.closest(".ai-chat") || element.contains(launcher)) return [];
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
            const overlaps = launcherRect.left < rect.right && launcherRect.right > rect.left && launcherRect.top < rect.bottom && launcherRect.bottom > rect.top;
            return visible && overlaps ? [{ tag: element.tagName, text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 100) }] : [];
          });
        }, meaningfulSelector);
        expect(intersections, `${path} at ${viewport.width}px scroll ${y}`).toEqual([]);
      }
    }

    await page.goto("/", { waitUntil: "networkidle" });
    const launcher = page.getByRole("button", { name: "Open Northstar AI assistant" });
    await launcher.click();
    await expect(page.locator("#northstar-ai-assistant")).toBeVisible();
    await expect(page.locator("#ai-chat-input")).toBeFocused();
    const panelBox = await page.locator("#northstar-ai-assistant").boundingBox();
    expect(panelBox).not.toBeNull();
    expect(panelBox!.x).toBeGreaterThanOrEqual(0);
    expect(panelBox!.y).toBeGreaterThanOrEqual(0);
    expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(viewport.width);
    expect(panelBox!.y + panelBox!.height).toBeLessThanOrEqual(viewport.height);
    await page.keyboard.press("Escape");
    await expect(page.locator("#northstar-ai-assistant")).toHaveCount(0);
    await expect(launcher).toBeFocused();
  }
  expect(consoleErrors).toEqual([]);
});

test("booking, POS, and controlled AI demonstrations complete", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);
  await page.locator(".home-projects").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".project-preview-image img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(await page.locator(".project-live-link").evaluateAll((links) => links.every((link) => (link as HTMLAnchorElement).href.startsWith("http")))).toBe(true);
  await page.evaluate(() => window.scrollBy(0, -90));
  await page.screenshot({ path: `${evidenceDir}/project-thumbnails.png` });
  await page.getByRole("tab", { name: "Booking" }).scrollIntoViewIfNeeded();
  const bookingPanel = page.getByRole("tabpanel");
  const bookingSelects = bookingPanel.locator(".booking-select select");
  await bookingSelects.nth(0).selectOption("Business assessment");
  await bookingSelects.nth(1).selectOption("Consultation Room 2");
  await page.getByRole("button", { name: /Saturday, June 22/ }).click();
  await expect(page.getByRole("button", { name: /9:00 AM, unavailable/ })).toBeDisabled();
  await page.getByRole("button", { name: /1:00 PM, available/ }).click();
  await page.getByRole("button", { name: /Confirm demonstration booking/ }).click();
  await expect(page.getByRole("heading", { name: "Booking confirmed" })).toBeVisible();
  await expect(page.getByText("Business assessment", { exact: true })).toBeVisible();
  await expect(page.getByText("Consultation Room 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Saturday, June 22", { exact: true })).toBeVisible();
  await expect(page.getByText("1:00 PM", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Restart demonstration" }).click();
  await expect(page.getByRole("heading", { name: "Choose an available appointment." })).toBeVisible();
  await expect(bookingSelects.nth(0)).toHaveValue("Signature consultation");
  await expect(bookingSelects.nth(1)).toHaveValue("Maria Santos");

  await page.getByRole("tab", { name: "POS & Inventory" }).click();
  await page.getByRole("button", { name: /Trigger sample website order/ }).click();
  await expect(page.getByText("7 of 7 steps complete")).toBeVisible();
  await expect(page.getByText("₱28,450")).toBeVisible();
  await expect(page.getByText("3 units", { exact: true })).toBeVisible();
  await expect(page.getByText("Low stock: 3 units")).toBeVisible();
  await expect(page.getByText(/Order #DEMO-1048 · ₱1,500/)).toBeVisible();
  await page.getByRole("button", { name: "Reset Demo" }).click();
  await expect(page.getByText("Ready to begin")).toBeVisible();

  await page.getByRole("tab", { name: "AI Assistant" }).click();
  await page.getByRole("button", { name: "Do you have availability Saturday?" }).click();
  await expect(page.getByText(/connected demonstration calendar shows openings/)).toBeVisible();
  await expect(page.getByLabel("Sample available times")).toContainText("10:30 AM");
  expect(consoleErrors).toEqual([]);
});

test("floating assistant manages focus and inquiry validation remains local", async ({ page, request }) => {
  await openHome(page);
  const launcher = page.getByRole("button", { name: "Open Northstar AI assistant" });
  await launcher.click();
  await expect(page.getByRole("region", { name: "Ask Northstar" })).toBeVisible();
  await expect(page.getByLabel("Your question")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("region", { name: "Ask Northstar" })).toHaveCount(0);
  await expect(launcher).toBeFocused();

  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(2);
  await expect(page.locator('a[href="mailto:rcsnyyy@gmail.com"]')).toHaveCount(2);
  await expect(page.getByText("hello@northstarsystems.ph", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Prefer to message us directly?", { exact: true })).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Request a Free Systems Audit/ })).toBeVisible();
  await page.getByRole("button", { name: /Request a Free Systems Audit/ }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  await expect(page.locator('input[name="name"]')).toHaveAttribute("maxlength", "100");
  await expect(page.locator('textarea[name="challenge"]')).toHaveAttribute("maxlength", "2000");
  await expect(page.locator('input[name="currentWebsite"]')).toHaveAttribute("maxlength", "500");
  const consent = page.locator('input[name="consent"]');
  const consentError = page.locator(".consent-copy + #consent-error");
  await expect(consent).toHaveAttribute("aria-invalid", "true");
  await expect(consent).toHaveAttribute("aria-describedby", "consent-error");
  await expect(consentError).toBeVisible();
  await expect(consentError).toHaveCSS("display", "block");
  const consentLayout = await page.locator("label.consent").evaluate((label) => {
    const copy = label.querySelector(".consent-copy")!.getBoundingClientRect();
    const error = label.querySelector("#consent-error")!.getBoundingClientRect();
    return { copyBottom: copy.bottom, errorTop: error.top };
  });
  expect(consentLayout.errorTop).toBeGreaterThanOrEqual(consentLayout.copyBottom);
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.locator(".contact-form").evaluate((form) => window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY - 90));
  await page.screenshot({ path: `${evidenceDir}/form-validation.png` });
  await page.locator("label.consent").screenshot({ path: `${evidenceDir}/consent-validation.png` });
  await page.locator('input[name="name"]').screenshot({ path: `${evidenceDir}/keyboard-focus.png` });
  await page.addScriptTag({ path: axePath });
  const formAccessibility = await page.evaluate(async () => {
    const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
    return axe.run(document.querySelector(".contact-form")!);
  });
  expect(formAccessibility.violations, JSON.stringify(formAccessibility.violations, null, 2)).toEqual([]);
  await page.setViewportSize({ width: 390, height: 1600 });
  await page.locator(".contact-form").evaluate((form) => window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY - 72));
  await page.screenshot({ path: `${evidenceDir}/form-validation-mobile.png` });
  await page.locator("label.consent").click();
  await expect(consent).toBeChecked();

  const invalidBase = {
    name: "Juan Dela Cruz", business: "North Test", contact: "juan@example.com",
    currentWebsite: "https://example.com", services: "Business website with contact form",
    challenge: "We need a clearer website inquiry and inventory workflow.", consent: true, companyWebsite: "",
  };
  const oversized = await request.post("/api/contact", {
    headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.210" },
    data: JSON.stringify({ challenge: "界".repeat(11_000) }),
  });
  expect(oversized.status()).toBe(413);
  expect(await oversized.json()).toEqual({ ok: false, message: "The inquiry is too large." });
  for (const [address, override] of [
    ["198.51.100.211", { services: "Unknown service" }],
    ["198.51.100.212", { currentWebsite: "not a URL" }],
    ["198.51.100.213", { companyWebsite: "bot-filled" }],
  ] as const) {
    const response = await request.post("/api/contact", {
      headers: { "content-type": "application/json", "x-forwarded-for": address },
      data: { ...invalidBase, ...override },
    });
    expect(response.status()).toBe(400);
    expect(JSON.stringify(await response.json())).not.toMatch(/stack|resend|api.?key/i);
  }
  let limitedResponse: APIResponse | undefined;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    limitedResponse = await request.post("/api/contact", {
      headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.214" },
      data: { name: "A" },
    });
  }
  expect(limitedResponse?.status()).toBe(429);
  expect(limitedResponse?.headers()["retry-after"]).toMatch(/^\d+$/);

  await page.locator('input[name="name"]').fill(invalidBase.name);
  await page.locator('input[name="business"]').fill(invalidBase.business);
  await page.locator('input[name="contact"]').fill(invalidBase.contact);
  await page.locator('select[name="services"]').selectOption(invalidBase.services);
  await page.locator('textarea[name="challenge"]').fill(invalidBase.challenge);
  await page.locator('input[name="currentWebsite"]').fill(invalidBase.currentWebsite);
  let interceptedSubmissions = 0;
  await page.route("**/api/contact", async (route) => {
    interceptedSubmissions += 1;
    await new Promise((resolve) => setTimeout(resolve, 120));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.locator(".contact-form").evaluate((form: HTMLFormElement) => {
    form.requestSubmit();
    form.requestSubmit();
  });
  await expect(page.getByRole("heading", { name: "Inquiry received." })).toBeVisible();
  expect(interceptedSubmissions).toBe(1);
});

test("assistant is a coherent non-modal region at every release viewport", async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of sentinelViewports) {
    await page.setViewportSize(viewport);
    const consoleErrors: string[] = [];
    const onConsole = (message: ConsoleMessage) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    page.on("console", onConsole);
    await openHome(page);
    await page.addScriptTag({ path: axePath });
    const launcher = page.locator(".ai-chat-launcher");
    await expect(launcher).toHaveAccessibleName("Open Northstar AI assistant");
    await expect(launcher).toHaveAttribute("aria-expanded", "false");
    await launcher.focus();
    await page.keyboard.press("Enter");
    const assistant = page.locator("#northstar-ai-assistant");
    await expect(assistant).toBeVisible();
    await expect(assistant).toHaveAttribute("role", "region");
    await expect(assistant).toHaveAccessibleName("Ask Northstar");
    await expect(assistant).not.toHaveAttribute("aria-modal", "true");
    await expect(launcher).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByLabel("Your question")).toBeFocused();
    await expect(page.locator(".site")).not.toHaveAttribute("inert", "");
    await expect(page.locator("#main-content")).not.toHaveAttribute("inert", "");
    await expect(page.getByRole("button", { name: "Close AI assistant" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with the contact form" })).toBeVisible();
    await expect(page.getByLabel("Suggested questions").getByRole("button")).toHaveCount(3);
    const accessibility = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
      return axe.run(document);
    });
    expect(accessibility.violations, `${viewport.width}px assistant\n${JSON.stringify(accessibility.violations, null, 2)}`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Tell me about your projects" })).toBeFocused();
    await page.getByRole("button", { name: "Close AI assistant" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await assistant.evaluate((element) => element.contains(document.activeElement))).toBe(false);
    if (viewport.width === 1440) {
      const backgroundLink = page.locator(".footer-top a[href='/services']");
      await expect(backgroundLink).toBeVisible();
      await backgroundLink.click({ trial: true });
    }
    await page.screenshot({ path: `${evidenceDir}/assistant-open-${viewport.width}.png` });
    await page.keyboard.press("Escape");
    await expect(assistant).toHaveCount(0);
    await expect(launcher).toHaveAttribute("aria-expanded", "false");
    await expect(launcher).toBeFocused();
    expect(consoleErrors).toEqual([]);
    page.off("console", onConsole);
  }
});

test("mobile navigation is a coherent non-modal disclosure", async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of sentinelViewports.filter(({ width }) => width < 600)) {
    await page.setViewportSize(viewport);
    const consoleErrors: string[] = [];
    const onConsole = (message: ConsoleMessage) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    };
    page.on("console", onConsole);
    await openHome(page);
    await page.addScriptTag({ path: axePath });
    const toggle = page.locator(".menu-button");
    await expect(toggle).toHaveAccessibleName("Open navigation");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const navigation = page.getByRole("navigation", { name: "Main navigation" });
    const firstLink = navigation.getByRole("link", { name: "Services", exact: true });
    await expect(firstLink).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#main-content")).not.toHaveAttribute("inert", "");
    await expect(page.locator(".site-footer")).not.toHaveAttribute("inert", "");
    await expect(page.locator("body > .ai-chat")).not.toHaveAttribute("inert", "");
    const accessibility = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
      return axe.run(document);
    });
    expect(accessibility.violations, `${viewport.width}px menu\n${JSON.stringify(accessibility.violations, null, 2)}`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

    for (let index = 0; index < 8; index += 1) await page.keyboard.press("Tab");
    await expect(toggle).toHaveAccessibleName("Close navigation");
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(false);
    await firstLink.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("link", { name: "Northstar Systems home" })).toBeFocused();
    await page.getByRole("link", { name: "Northstar Systems home" }).click({ trial: true });
    await page.screenshot({ path: `${evidenceDir}/mobile-menu-open-${viewport.width}.png` });
    await page.keyboard.press("Escape");
    await expect(navigation).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
    expect(consoleErrors).toEqual([]);
    page.off("console", onConsole);
  }
});

for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
  test(`homepage axe contrast, overflow, and touch targets pass at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const cspMessages: string[] = [];
    page.on("console", (message) => {
      if (/content security policy|refused to/i.test(message.text())) cspMessages.push(message.text());
    });
    await openHome(page);
    await page.addScriptTag({ path: axePath });
    const contrast = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
      return axe.run(document, { runOnly: { type: "rule", values: ["color-contrast"] } });
    });
    expect(contrast.violations, JSON.stringify(contrast.violations, null, 2)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(cspMessages).toEqual([]);

    const undersizedControls = await page.locator("button:not([disabled]),select:not([disabled]),textarea:not([disabled]),input:not([disabled]):not([type='hidden'])").evaluateAll((controls) => controls.flatMap((control) => {
      const element = control as HTMLInputElement;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none" || element.tabIndex < 0 || rect.width === 0 || rect.height === 0) return [];
      const label = element.matches("input[type='checkbox'],input[type='radio']") ? element.closest("label") : null;
      const targetRect = label?.getBoundingClientRect() ?? rect;
      return targetRect.width < 44 || targetRect.height < 44
        ? [{ tag: element.tagName, type: element.type, width: targetRect.width, height: targetRect.height }]
        : [];
    }));
    expect(undersizedControls).toEqual([]);

    if (viewport.name === "mobile") {
      const tooSmall = await page.locator(".home-offer-grid a,.text-link,.project-live-link,.footer-top a,.footer-bottom a").evaluateAll((links) => links.filter((link) => {
        const rect = link.getBoundingClientRect();
        const style = getComputedStyle(link);
        return style.visibility !== "hidden" && style.display !== "none" && (rect.width < 24 || rect.height < 24);
      }).map((link) => ({ text: link.textContent?.trim(), rect: link.getBoundingClientRect().toJSON() })));
      expect(tooSmall).toEqual([]);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${evidenceDir}/homepage-${viewport.name}.png` });
    if (viewport.name === "mobile") {
      await page.locator(".site-header").scrollIntoViewIfNeeded();
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Services", exact: true })).toBeFocused();
      await expect(page.locator("#main-content")).not.toHaveAttribute("inert", "");
      await expect(page.getByRole("link", { name: "Northstar Systems home" })).not.toHaveAttribute("inert", "");
      await expect(page.locator(".skip-link")).not.toHaveAttribute("inert", "");
      await page.screenshot({ path: `${evidenceDir}/mobile-menu.png` });
      await page.getByRole("button", { name: "Close navigation" }).click();
      await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
      await expect(page.locator("#main-content")).not.toHaveAttribute("inert", "");
    }
    await page.goto("/definitely-not-a-real-route", { waitUntil: "networkidle" });
    await page.screenshot({ path: `${evidenceDir}/404-${viewport.name}.png`, fullPage: true });
  });
}

test("axe reports no accessibility violations on required release surfaces", async ({ page }) => {
  test.setTimeout(60_000);
  for (const path of ["/", "/projects", "/contact", "/services/websites", "/definitely-not-a-real-route"]) {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addScriptTag({ path: axePath });
    const accessibility = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
      return axe.run(document);
    });
    expect(accessibility.violations, `${path}\n${JSON.stringify(accessibility.violations, null, 2)}`).toEqual([]);
  }
});

test("touch-target audit catches undersized offscreen controls and excludes only the honeypot", async ({ page }) => {
  await openHome(page);
  await page.evaluate(() => {
    const offscreen = document.createElement("a");
    offscreen.href = "#main-content";
    offscreen.textContent = "Adversarial offscreen target";
    offscreen.style.cssText = "position:fixed;left:-1000px;top:10px;width:20px;height:20px;display:inline-flex";
    document.body.append(offscreen);

    const honeypot = document.createElement("label");
    honeypot.className = "honeypot";
    const input = document.createElement("input");
    input.setAttribute("aria-label", "Adversarial honeypot");
    input.style.cssText = "width:20px;height:20px";
    honeypot.append(input);
    document.body.append(honeypot);
  });
  const findings = await page.evaluate(collectUndersizedTargets);
  expect(findings.map((finding) => finding.text)).toContain("Adversarial offscreen target");
  expect(findings.map((finding) => finding.text)).not.toContain("Adversarial honeypot");
});

for (const viewport of sentinelViewports) {
  test(`all 16 public routes have zero axe violations at ${viewport.width}px`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const requestFailures: RequestFailure[] = [];
    const badResponses: Array<{ url: string; status: number; resourceType: string }> = [];
    page.on("requestfailed", (request) => requestFailures.push({
      url: request.url(),
      resourceType: request.resourceType(),
      errorText: request.failure()?.errorText ?? "",
      navigation: request.isNavigationRequest(),
    }));
    page.on("response", (response) => {
      const resourceType = response.request().resourceType();
      if (response.status() >= 400 && resourceType !== "document") badResponses.push({ url: response.url(), status: response.status(), resourceType });
    });
    for (const path of publicRoutes) {
      const failureStart = requestFailures.length;
      const responseStart = badResponses.length;
      const response = await page.goto(path, { waitUntil: "networkidle" });
      expect(response?.status(), path).toBe(200);
      const unexpectedFailures = requestFailures.slice(failureStart).filter((failure) => !isExpectedCanceledRscPrefetch(failure));
      expect(unexpectedFailures, `${path} at ${viewport.width}px failed requests`).toEqual([]);
      expect(badResponses.slice(responseStart), `${path} at ${viewport.width}px error responses`).toEqual([]);
      await page.addScriptTag({ path: axePath });
      const accessibility = await page.evaluate(async () => {
        const axe = (window as typeof window & { axe: typeof import("axe-core") }).axe;
        return axe.run(document);
      });
      expect(accessibility.violations, `${path} at ${viewport.width}px\n${JSON.stringify(accessibility.violations, null, 2)}`).toEqual([]);
      const undersizedTargets = await page.evaluate(collectUndersizedTargets);
      expect(undersizedTargets, `${path} at ${viewport.width}px touch targets`).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${path} at ${viewport.width}px overflow`).toBe(true);
    }
  });
}