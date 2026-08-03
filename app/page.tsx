import type { Metadata } from "next";
import { headers } from "next/headers";
import { publicSiteUrl, siteConfig } from "./site-config";
import { HomePage } from "./site";

export const metadata: Metadata = {
  title: { absolute: "Web Development Company Philippines | Northstar Systems" },
  description: "Northstar builds professional websites and connected booking, sales, inventory, and automation systems for businesses across the Philippines.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Web Development Company Philippines | Northstar Systems",
    description: "Northstar builds professional websites and connected booking, sales, inventory, and automation systems for businesses across the Philippines.",
    url: "/",
    images: ["/northstar-social.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Company Philippines | Northstar Systems",
    description: "Northstar builds professional websites and connected booking, sales, inventory, and automation systems for businesses across the Philippines.",
    images: ["/northstar-social.jpg"],
  },
};

export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${publicSiteUrl}/#website`,
    url: publicSiteUrl,
    name: siteConfig.name,
    publisher: { "@id": `${publicSiteUrl}/#organization` },
    inLanguage: "en-PH",
  };

  return <>
    <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} />
    <HomePage />
  </>;
}
