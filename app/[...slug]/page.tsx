import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "../site";
import { services } from "../site-data";

const valid = new Set(["services", "services/websites", "services/booking", "services/pos-inventory", "services/ai-automation", "services/automation-integrations", "services/support-maintenance", "projects", "industries", "how-it-works", "packages", "about", "contact", "privacy", "terms"]);

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const path = (await params).slug.join("/");
  const service = path.startsWith("services/") ? services.find((item) => path.endsWith(item.slug)) : undefined;
  const pageDetails: Record<string, { title: string; description: string }> = {
    services: { title: "Business Systems and Services", description: "Websites, online booking, POS and inventory implementation, AI assistance, and automation for Philippine businesses." },
    projects: { title: "Selected Projects", description: "Northstar Systems website concepts and product platforms, presented with clear project-stage context." },
    industries: { title: "Industry Solutions", description: "Connected digital systems for clinics, salons, resorts, restaurants, retail businesses, and rental companies in the Philippines." },
    "how-it-works": { title: "How Northstar Projects Work", description: "A clear process for discovery, design, implementation, testing, training, launch, and ongoing support." },
    packages: { title: "Northstar Solution Packages", description: "Practical website, booking, POS and inventory, AI assistance, and complete business system packages for Philippine businesses." },
    about: { title: "About Northstar Systems", description: "Northstar Systems builds practical digital systems that help Philippine businesses strengthen their online presence and operate with more clarity." },
    contact: { title: "Book a Free Systems Audit", description: "Tell Northstar Systems how your business handles customers, bookings, sales, and inventory, and get a practical place to start." },
    privacy: { title: "Privacy Policy", description: "How Northstar Systems handles information shared through this website." },
    terms: { title: "Terms of Service", description: "The terms governing use of the Northstar Systems website and future client engagements." },
  };
  const details = service
    ? { title: service.headline, description: `${service.description} Available for Philippine businesses through Northstar Systems.` }
    : pageDetails[path];
  if (!details) return {};
  return {
    title: details.title,
    description: details.description,
    alternates: { canonical: `/${path}` },
    openGraph: { title: details.title, description: details.description, url: `/${path}`, images: ["/northstar-horizon-v2.png"] },
    twitter: { card: "summary_large_image", title: details.title, description: details.description, images: ["/northstar-horizon-v2.png"] },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const path = (await params).slug.join("/");
  if (!valid.has(path)) notFound();
  return <ContentPage path={path} />;
}
