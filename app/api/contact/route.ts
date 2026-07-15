import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "../../contact-schema";

export const runtime = "edge";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] as string);
}

function clientKey(request: NextRequest) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "The request could not be read." }, { status: 400 });
  }

  // Silently accept bot submissions caught by the honeypot.
  if (typeof body === "object" && body !== null && "companyWebsite" in body && body.companyWebsite) {
    return NextResponse.json({ ok: true });
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
  const rows = [
    ["Name", input.name], ["Business", input.business], ["Email", input.email], ["Phone / Messenger", input.phone],
    ["City", input.city], ["Industry", input.industry], ["Current site / page", input.currentWebsite || "Not provided"],
    ["Services", input.services], ["Estimated investment", input.budget || "Not provided"], ["Preferred timeline", input.timeline || "Not provided"], ["Business challenge", input.challenge],
  ];

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Northstar Systems <onboarding@resend.dev>",
    to: [toEmail],
    replyTo: input.email,
    subject: `Systems audit request — ${input.business}`,
    html: `<h1>New Northstar Systems audit request</h1><table>${rows.map(([label, value]) => `<tr><th align="left" valign="top" style="padding:6px 18px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join("")}</table>`,
  });

  if (result.error) {
    console.error("Resend contact delivery failed:", result.error.name);
    return NextResponse.json(
      { ok: false, message: "We could not send your request right now. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
