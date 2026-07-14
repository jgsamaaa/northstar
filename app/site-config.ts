export const siteConfig = {
  name: "Northstar Systems",
  tagline: "Modern systems for growing businesses.",
  description:
    "Connected websites, booking, POS and inventory implementation, AI assistance, and automation for Philippine businesses.",
  email: "hello@northstarsystems.ph",
  location: "Serving businesses across the Philippines",
  socialLinks: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
} as const;

export const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://northstar.systems";
