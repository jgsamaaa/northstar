import { z } from "zod";

const optionalText = (value: unknown) => typeof value === "string" ? value : "";
const normalizeSingleLine = (value: unknown) => optionalText(value).trim().replace(/\s+/g, " ");
const normalizeMultiline = (value: unknown) => optionalText(value).trim().replace(/\r\n?/g, "\n");

export const contactServices = [
  "Starter static website",
  "Business website with contact form",
  "Appointment booking website",
  "Hotel or resort reservation website",
  "POS and inventory implementation",
  "Custom inventory or POS system",
  "Optional AI or automation",
  "Not sure yet",
] as const;

export const contactLimits = {
  name: 100,
  business: 150,
  contact: 200,
  challenge: 2000,
  currentWebsite: 500,
} as const;

export const contactSchema = z.object({
  name: z.preprocess(normalizeSingleLine, z.string().min(2, "Enter your full name.").max(contactLimits.name, "Full name must be 100 characters or fewer.")),
  business: z.preprocess(normalizeSingleLine, z.string().min(2, "Enter your business name.").max(contactLimits.business, "Business name must be 150 characters or fewer.")),
  contact: z.preprocess(normalizeSingleLine, z.string().min(3, "Enter your email address or Messenger name/link.").max(contactLimits.contact, "Contact details must be 200 characters or fewer.")),
  currentWebsite: z.preprocess(normalizeSingleLine, z.string().max(contactLimits.currentWebsite, "URL must be 500 characters or fewer.").refine(
    (value) => value === "" || (/^https?:\/\//i.test(value) && URL.canParse(value)),
    "Enter a complete website or Facebook page URL.",
  ).default("")),
  services: z.preprocess(normalizeSingleLine, z.enum(contactServices, { error: "Please select an approved service." })),
  challenge: z.preprocess(normalizeMultiline, z.string().min(20, "Share at least 20 characters about the current workflow.").max(contactLimits.challenge, "Description must be 2,000 characters or fewer.")),
  consent: z.literal(true, { error: "Consent is required so we can respond." }),
  companyWebsite: z.preprocess(optionalText, z.string().max(0).default("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
