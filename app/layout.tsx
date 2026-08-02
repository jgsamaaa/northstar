import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AiChat } from "./ai-chat";
import { publicSiteUrl, siteConfig } from "./site-config";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(publicSiteUrl),
    title: { default: "Northstar Systems — Better business, by design", template: "%s | Northstar Systems" },
    description: siteConfig.description,
    keywords: ["business website Philippines", "online booking system Philippines", "POS system setup Philippines", "inventory system Philippines", "AI chatbot for business Philippines", "business automation Philippines"],
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.svg",
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName: siteConfig.name,
      title: "Northstar Systems — Better business, by design",
      description: siteConfig.tagline,
      url: "/",
      images: [{ url: "/northstar-social.jpg", width: 1200, height: 675, alt: "Northstar Systems — modern systems for growing Philippine businesses" }],
    },
    twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.tagline, images: ["/northstar-social.jpg"] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${publicSiteUrl}/#organization`,
        url: publicSiteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        ...(siteConfig.emailConfigured ? { email: siteConfig.email } : {}),
        areaServed: { "@type": "Country", name: "Philippines" },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${publicSiteUrl}/#business`,
        url: publicSiteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        ...(siteConfig.emailConfigured ? { email: siteConfig.email } : {}),
        areaServed: { "@type": "Country", name: "Philippines" },
        serviceType: ["Business websites", "Online booking systems", "POS and inventory implementation", "AI customer assistance", "Business automation"],
      },
    ],
  };

  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{children}<AiChat/></body></html>;
}
