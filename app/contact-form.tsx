"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { contactSchema } from "./contact-schema";

type FieldErrors = Record<string, string[] | undefined>;

const services = [
  "Professional website",
  "Online booking system",
  "POS and inventory setup",
  "AI customer assistant",
  "Automation",
  "Complete business system",
  "Not sure yet",
];

const fieldOrder = ["name", "business", "contact", "services", "challenge", "currentWebsite", "consent"];
const failureMessage = "We could not send your inquiry. Please try again or contact us directly through email or Messenger.";

function ErrorText({ name, errors }: { name: string; errors: FieldErrors }) {
  const message = errors[name]?.[0];
  return message ? <span id={`${name}-error`} className="field-error" role="alert">{message}</span> : null;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const errorProps = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  function focusFirstError(nextErrors: FieldErrors) {
    const first = fieldOrder.find((name) => nextErrors[name]);
    if (!first) return;
    window.requestAnimationFrame(() => {
      (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setErrors({});

    const form = event.currentTarget;
    const entries = Object.fromEntries(new FormData(form).entries());
    const data = { ...entries, consent: entries.consent === "on" };
    const validation = contactSchema.safeParse(data);

    if (!validation.success) {
      const nextErrors = validation.error.flatten().fieldErrors;
      setErrors(nextErrors);
      focusFirstError(nextErrors);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = await response.json() as { ok?: boolean; fieldErrors?: FieldErrors };

      if (!response.ok || !result.ok) {
        const nextErrors = result.fieldErrors || {};
        setErrors(nextErrors);
        setStatus("error");
        if (Object.keys(nextErrors).length) focusFirstError(nextErrors);
        else window.requestAnimationFrame(() => messageRef.current?.focus());
        return;
      }

      form.reset();
      setStatus("done");
    } catch {
      setStatus("error");
      window.requestAnimationFrame(() => messageRef.current?.focus());
    }
  }

  if (status === "done") {
    return <div className="form-success" role="status">
      <i aria-hidden="true"><Check /></i>
      <h3>Inquiry received.</h3>
      <p>Thank you for contacting Northstar Systems. We will review your request and contact you within one business day if the project appears to be a good fit.</p>
      <button type="button" onClick={() => setStatus("idle")}>Send another inquiry</button>
    </div>;
  }

  return <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
    <div className="form-heading">
      <span>FREE SYSTEMS AUDIT</span>
      <h3>Tell us where you need clarity.</h3>
    </div>

    <div className="honeypot" aria-hidden="true">
      <label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
    </div>

    <div className="field-row">
      <label>Full name
        <input name="name" required autoComplete="name" placeholder="Your full name" {...errorProps("name")} />
        <ErrorText name="name" errors={errors} />
      </label>
      <label>Business name
        <input name="business" required autoComplete="organization" placeholder="Your business" {...errorProps("business")} />
        <ErrorText name="business" errors={errors} />
      </label>
    </div>

    <div className="field-row">
      <label>Email or Messenger
        <input name="contact" required autoComplete="email" placeholder="Email, Messenger name, or link" {...errorProps("contact")} />
        <ErrorText name="contact" errors={errors} />
      </label>
      <label>Service needed
        <select name="services" required defaultValue="" {...errorProps("services")}>
          <option value="" disabled>Select a service</option>
          {services.map((service) => <option key={service}>{service}</option>)}
        </select>
        <ErrorText name="services" errors={errors} />
      </label>
    </div>

    <label>What do you need help with?
      <textarea name="challenge" required rows={5} placeholder="Briefly tell us how customers currently inquire, book, order, or pay—and what you would like to improve." {...errorProps("challenge")} />
      <ErrorText name="challenge" errors={errors} />
    </label>

    <label>Current website or Facebook page <small>Optional</small>
      <input name="currentWebsite" type="url" inputMode="url" placeholder="https://" {...errorProps("currentWebsite")} />
      <ErrorText name="currentWebsite" errors={errors} />
    </label>

    <label className="consent">
      <input name="consent" type="checkbox" required {...errorProps("consent")} />
      <span>I agree that Northstar Systems may use these details to respond to my inquiry.<ErrorText name="consent" errors={errors} /></span>
    </label>

    {status === "error" && <p ref={messageRef} className="form-message error" role="alert" tabIndex={-1}>{failureMessage}</p>}

    <button className="button primary form-submit" type="submit" disabled={status === "sending"}>
      {status === "sending" ? "Sending inquiry…" : "Request a Free Systems Audit"}
      <ArrowUpRight size={19} aria-hidden="true" />
    </button>
    <small className="form-response-note">We normally review qualified inquiries within one business day.</small>
    <small className="form-security">Spam protection is active. Your information is used only to review and respond to this inquiry.</small>
  </form>;
}
