import type { MetadataRoute } from "next";
import { publicSiteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routeDates = new Map<string, string>([
    ["", "2026-08-02"],
    ["/projects", "2026-08-01"],
    ["/services/custom-software-development", "2026-08-02"],
    ["/industries/resorts-hotels", "2026-08-02"],
    ["/industries/dental-clinics", "2026-08-02"],
    ["/guides/business-website-cost-philippines", "2026-08-02"],
  ]);
  const routes = ["", "/services", "/services/websites", "/services/booking", "/services/pos-inventory", "/services/custom-software-development", "/services/ai-automation", "/services/automation-integrations", "/services/support-maintenance", "/projects", "/industries", "/industries/resorts-hotels", "/industries/dental-clinics", "/guides/business-website-cost-philippines", "/how-it-works", "/packages", "/about", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${publicSiteUrl}${route}`,
    lastModified: routeDates.get(route) ?? "2026-07-27",
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/services") ? 0.8 : 0.6,
  }));
}
