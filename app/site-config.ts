export const siteConfig = {
  name: "Northstar Systems",
  founderName: "James Dumaug",
  tagline: "Modern systems for growing businesses.",
  description:
    "Connected websites, booking, POS and inventory implementation, AI assistance, and automation for Philippine businesses.",
  email: "hello@northstarsystems.ph",
  emailConfigured: false,
  phone: "",
  messengerLink: "",
  location: "Serving businesses across the Philippines",
  domain: "https://northstar-three-liard.vercel.app",
  systemsAuditLink: "/#contact",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || siteConfig.domain;
