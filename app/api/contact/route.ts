import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "../../contact-schema";
import { createInMemoryContactProtection, readBoundedUtf8Body, withDuplicateReservation } from "./request-protection";

export const runtime = "edge";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 32 * 1024;
// This bounded map is process-local defense in depth, not a globally durable serverless rate limit.
const protection = createInMemoryContactProtection({ windowMs: WINDOW_MS, maxRequests: MAX_REQUESTS, maxEntries: 10_000 });

function clientKey(request: NextRequest) {
  // These headers are overwritten by the supported hosting platforms. Values
  // are constrained to an IP-shaped token before they become storage keys.
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim();
  return address && /^[0-9a-f:.]{3,64}$/i.test(address) ? address : "unknown";
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  if (protection.isRateLimited(key)) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }

  let rawBody: string | null;
  try {
    rawBody = await readBoundedUtf8Body(request, MAX_BODY_BYTES);
  } catch {
    return NextResponse.json({ ok: false, message: "The request could not be read." }, { status: 400 });
  }
  if (rawBody === null) {
    return NextResponse.json({ ok: false, message: "The inquiry is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "The request could not be read." }, { status: 400 });
  }

  // Reject bot submissions without revealing which anti-spam field was triggered.
  if (typeof body === "object" && body !== null && "companyWebsite" in body && body.companyWebsite) {
    return NextResponse.json({ ok: false, message: "The inquiry could not be submitted." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please review the highlighted fields.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !toEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Northstar contact delivery is disabled. Set RESEND_API_KEY and CONTACT_TO_EMAIL.");
    }
    return NextResponse.json(
      { ok: false, message: "Inquiry delivery is not available right now. Please try again later." },
      { status: 503 },
    );
  }

  const input = parsed.data;
  const fingerprint = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${key}\n${JSON.stringify(input)}`));
  const fingerprintKey = Array.from(new Uint8Array(fingerprint), (byte) => byte.toString(16).padStart(2, "0")).join("");

  const text = [
    "New Northstar Systems audit request",
    "",
    `Name: ${input.name}`,
    `Business: ${input.business}`,
    `Email / Messenger: ${input.contact}`,
    `Service needed: ${input.services}`,
    `Current site / page: ${input.currentWebsite || "Not provided"}`,
    "",
    "What they need help with:",
    input.challenge,
  ].join("\n");

  const replyTo = /^\S+@\S+\.\S+$/.test(input.contact) ? input.contact : undefined;

  const delivery = await withDuplicateReservation(protection, fingerprintKey, async () => {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Northstar Systems <onboarding@resend.dev>",
      to: [toEmail],
      ...(replyTo ? { replyTo } : {}),
      subject: `Systems audit request — ${input.business}`,
      text,
    });
    return !result.error;
  });

  if (delivery === "success") return NextResponse.json({ ok: true });
  if (delivery === "duplicate") {
    return NextResponse.json(
      { ok: false, message: "This inquiry was already received. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }
  console.error("Northstar contact delivery failed.");
  return NextResponse.json(
    { ok: false, message: "We could not send your request right now. Please try again later." },
    { status: 502 },
  );
}
