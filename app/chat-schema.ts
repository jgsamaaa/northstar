import { z } from "zod";

export const chatMessageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(600),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z.string().trim().min(1).max(2400),
  }),
]);

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(10),
}).refine((value) => value.messages[value.messages.length - 1]?.role === "user", {
  message: "The final message must come from the visitor.",
  path: ["messages"],
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
