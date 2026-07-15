import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  business: z.string().trim().min(2, "Enter your business name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phone: z.string().trim().min(7, "Enter a phone or Messenger contact.").max(80),
  city: z.string().trim().min(2, "Enter your city or province.").max(100),
  industry: z.string({ error: "Select an industry." }).trim().min(2, "Select an industry.").max(120),
  currentWebsite: z.string().trim().max(300).refine(
    (value) => value === "" || URL.canParse(value),
    "Enter a complete website or Facebook page URL.",
  ).optional().default(""),
  services: z.string().trim().min(2, "Select the service you need.").max(120),
  budget: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  challenge: z.string().trim().min(20, "Share at least 20 characters about the current workflow.").max(3000),
  consent: z.literal(true, { error: "Consent is required so we can respond." }),
  companyWebsite: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
