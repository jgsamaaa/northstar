export const siteConfig = {
  name: "Northstar Systems",
  founderName: "James Gabriel",
  tagline: "Modern systems for growing businesses.",
  description:
    "Connected websites, booking, POS and inventory implementation, AI assistance, and automation for Philippine businesses.",
  email: "hello@northstarsystems.ph",
  emailConfigured: false,
  phone: "" as string,
  messengerLink: "" as string,
  location: "Serving businesses across the Philippines",
  domain: "https://northstar-three-liard.vercel.app",
  systemsAuditLink: "/#contact",
  socialLinks: {
    facebook: "" as string,
    instagram: "" as string,
    linkedin: "" as string,
  },
} as const;

export const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || siteConfig.domain;
