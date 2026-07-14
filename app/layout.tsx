import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "./site-config";
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

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "northstar.systems";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: { default: "Northstar Systems — Better business, by design", template: "%s | Northstar Systems" },
    description: siteConfig.description,
    keywords: ["business website Philippines", "online booking system Philippines", "POS system setup Philippines", "inventory system Philippines", "AI chatbot for business Philippines", "business automation Philippines"],
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName: siteConfig.name,
      title: "Northstar Systems — Better business, by design",
      description: siteConfig.tagline,
      url: "/",
      images: [{ url: "/northstar-horizon-v2.png", width: 1672, height: 938, alt: "Northstar Systems — modern systems for growing Philippine businesses" }],
    },
    twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.tagline, images: ["/northstar-horizon-v2.png"] },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "/#organization",
        name: siteConfig.name,
        description: siteConfig.description,
        email: siteConfig.email,
        areaServed: { "@type": "Country", name: "Philippines" },
      },
      {
        "@type": "ProfessionalService",
        "@id": "/#business",
        name: siteConfig.name,
        description: siteConfig.description,
        email: siteConfig.email,
        areaServed: { "@type": "Country", name: "Philippines" },
        serviceType: ["Business websites", "Online booking systems", "POS and inventory implementation", "AI customer assistance", "Business automation"],
      },
    ],
  };

  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
