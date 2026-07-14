import type { MetadataRoute } from "next";
import { publicSiteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/services/websites", "/services/booking", "/services/pos-inventory", "/services/ai-automation", "/services/automation-integrations", "/services/support-maintenance", "/industries", "/about", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${publicSiteUrl}${route}`,
    lastModified: new Date("2026-07-14"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.8 : 0.6,
  }));
}
