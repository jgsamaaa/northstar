import type { Metadata } from "next";
import { CustomSoftwarePage } from "./custom-software";
import { DentalClinicsPage } from "./dental-clinics";
import { ResortsHotelsPage } from "./resorts-hotels";
import { WebsiteCostGuidePage } from "./website-cost-guide";

export const growthPageMetadata: Record<string, { title: string; description: string }> = {
  "services/custom-software-development": {
    title: "Custom Software Development Philippines | Northstar Systems",
    description: "Northstar scopes and builds custom business software for validated Philippine workflows, including internal tools, dashboards, inventory, and approvals.",
  },
  "industries/resorts-hotels": {
    title: "Resort Website Design Philippines | Northstar Systems",
    description: "Northstar designs resort and hotel websites with clear room, package, inquiry, and reservation journeys for properties across the Philippines.",
  },
  "industries/dental-clinics": {
    title: "Dental Clinic Website Philippines | Northstar Systems",
    description: "Northstar designs dental clinic websites and appointment journeys that explain services clearly and support practical patient inquiries across the Philippines.",
  },
  "guides/business-website-cost-philippines": {
    title: "Business Website Cost Philippines: 2026 Pricing Guide",
    description: "See Northstar’s current website starting prices, what each package includes, separate provider costs, and the factors that affect a Philippine website quote.",
  },
};

export const growthPaths = new Set(Object.keys(growthPageMetadata));

export function metadataForGrowthPage(path: string): Metadata | undefined {
  const details = growthPageMetadata[path];
  if (!details) return undefined;
  return {
    title: { absolute: details.title },
    description: details.description,
    alternates: { canonical: `/${path}` },
    openGraph: { title: details.title, description: details.description, url: `/${path}`, images: ["/northstar-social.jpg"] },
    twitter: { card: "summary_large_image", title: details.title, description: details.description, images: ["/northstar-social.jpg"] },
  };
}

export function GrowthContentPage({ path, nonce }: { path: string; nonce?: string }) {
  if (path === "services/custom-software-development") return <CustomSoftwarePage nonce={nonce} />;
  if (path === "industries/resorts-hotels") return <ResortsHotelsPage nonce={nonce} />;
  if (path === "industries/dental-clinics") return <DentalClinicsPage nonce={nonce} />;
  if (path === "guides/business-website-cost-philippines") return <WebsiteCostGuidePage nonce={nonce} />;
  return null;
}
