import { z } from "zod";

const optionalText = (value: unknown) => typeof value === "string" ? value : "";

export const contactSchema = z.object({
  name: z.preprocess(optionalText, z.string().trim().min(2, "Enter your full name.").max(100)),
  business: z.preprocess(optionalText, z.string().trim().min(2, "Enter your business name.").max(120)),
  contact: z.preprocess(optionalText, z.string().trim().min(3, "Enter your email address or Messenger name/link.").max(200)),
  currentWebsite: z.preprocess(optionalText, z.string().trim().max(300).refine(
    (value) => value === "" || URL.canParse(value),
    "Enter a complete website or Facebook page URL.",
  ).default("")),
  services: z.preprocess(optionalText, z.string().trim().min(2, "Please select a service.").max(120)),
  challenge: z.preprocess(optionalText, z.string().trim().min(20, "Share at least 20 characters about the current workflow.").max(3000)),
  consent: z.literal(true, { error: "Consent is required so we can respond." }),
  companyWebsite: z.preprocess(optionalText, z.string().max(0).default("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
