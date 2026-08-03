const canonicalProductionUrl = "https://northstarsystems.ph";

function resolvePublicSiteUrl(value: string | undefined) {
  const configuredValue = value?.trim() || canonicalProductionUrl;
  let configuredUrl: URL;

  try {
    configuredUrl = new URL(configuredValue);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be the canonical HTTPS production origin.");
  }

  const isOriginOnly = configuredUrl.pathname === "/"
    && !configuredUrl.search
    && !configuredUrl.hash
    && !configuredUrl.username
    && !configuredUrl.password;
  if (configuredUrl.origin !== canonicalProductionUrl || !isOriginOnly) {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be ${canonicalProductionUrl}.`);
  }

  return canonicalProductionUrl;
}

export const publicSiteUrl = resolvePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function resolveConfiguredContactEmail(config: { email: string; emailConfigured: boolean }) {
  const email = config.email.trim();
  return config.emailConfigured && email ? email : null;
}

export const siteConfig = {
  name: "Northstar Systems",
  tagline: "Modern systems for growing businesses.",
  description:
    "Connected websites, booking, POS and inventory implementation, AI assistance, and automation for Philippine businesses.",
  email: "rcsnyyy@gmail.com",
  emailConfigured: true,
  phone: "" as string,
  messengerLink: "" as string,
  location: "Serving businesses across the Philippines",
  domain: publicSiteUrl,
  systemsAuditLink: "/contact",
  socialLinks: {
    facebook: "" as string,
    instagram: "" as string,
    linkedin: "" as string,
  },
} as const;

export const publicContactEmail = resolveConfiguredContactEmail(siteConfig);
