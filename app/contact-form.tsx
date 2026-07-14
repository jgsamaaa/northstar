"use client";

import { FormEvent, useState } from "react";
import { industries } from "./site-data";

type FieldErrors = Record<string, string[] | undefined>;

const services = ["Website", "Booking system", "POS and inventory", "AI assistant", "Automation", "Support and maintenance", "Complete business system"];
const budgets = ["Below ₱30,000", "₱30,000–₱60,000", "₱60,000–₱100,000", "₱100,000–₱250,000", "₱250,000+", "Not sure yet"];
const timelines = ["As soon as possible", "Within 1–2 months", "Within 3–6 months", "Later this year", "Just exploring"];

function ErrorText({ name, errors }: { name: string; errors: FieldErrors }) {
  const message = errors[name]?.[0];
  return message ? <span className="field-error" role="alert">{message}</span> : null;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    setErrors({});

    const form = event.currentTarget;
    const entries = Object.fromEntries(new FormData(form).entries());
    const data = { ...entries, consent: entries.consent === "on" };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json() as { ok?: boolean; message?: string; fieldErrors?: FieldErrors };
      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors || {});
        setMessage(result.message || "The request could not be sent.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("done");
    } catch {
      setMessage("The request could not be sent. Please check your connection or email us directly.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return <div className="form-success" role="status"><i aria-hidden="true">✓</i><h3>Your audit request was sent.</h3><p>Thanks for sharing the context. A Northstar specialist will review it and follow up using the contact details provided.</p><button onClick={() => setStatus("idle")}>Send another request</button></div>;
  }

  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="honeypot" aria-hidden="true"><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="field-row">
      <label>Full name<input name="name" required autoComplete="name" placeholder="Juan dela Cruz" aria-invalid={Boolean(errors.name)} /><ErrorText name="name" errors={errors} /></label>
      <label>Business name<input name="business" required autoComplete="organization" placeholder="Your business" aria-invalid={Boolean(errors.business)} /><ErrorText name="business" errors={errors} /></label>
    </div>
    <div className="field-row">
      <label>Email address<input name="email" type="email" required autoComplete="email" placeholder="you@business.com" aria-invalid={Boolean(errors.email)} /><ErrorText name="email" errors={errors} /></label>
      <label>Phone or Messenger<input name="phone" required autoComplete="tel" placeholder="+63" aria-invalid={Boolean(errors.phone)} /><ErrorText name="phone" errors={errors} /></label>
    </div>
    <div className="field-row">
      <label>City or province<input name="city" required autoComplete="address-level2" placeholder="Cebu City" aria-invalid={Boolean(errors.city)} /><ErrorText name="city" errors={errors} /></label>
      <label>Industry<select name="industry" required defaultValue="" aria-invalid={Boolean(errors.industry)}><option value="" disabled>Select an industry</option>{industries.map((industry) => <option key={industry.name}>{industry.name}</option>)}<option>Other business</option></select><ErrorText name="industry" errors={errors} /></label>
    </div>
    <label>Current website or Facebook page<input name="currentWebsite" type="url" inputMode="url" placeholder="https://" aria-invalid={Boolean(errors.currentWebsite)} /><ErrorText name="currentWebsite" errors={errors} /></label>
    <div className="field-row">
      <label>Services needed<select name="services" required defaultValue="" aria-invalid={Boolean(errors.services)}><option value="" disabled>Select a service</option>{services.map((service) => <option key={service}>{service}</option>)}</select><ErrorText name="services" errors={errors} /></label>
      <label>Approximate budget<select name="budget" required defaultValue="" aria-invalid={Boolean(errors.budget)}><option value="" disabled>Select a range</option>{budgets.map((budget) => <option key={budget}>{budget}</option>)}</select><ErrorText name="budget" errors={errors} /></label>
    </div>
    <label>Project timeline<select name="timeline" required defaultValue="" aria-invalid={Boolean(errors.timeline)}><option value="" disabled>Select a timeline</option>{timelines.map((timeline) => <option key={timeline}>{timeline}</option>)}</select><ErrorText name="timeline" errors={errors} /></label>
    <label>Business challenge<textarea name="challenge" required rows={6} placeholder="What happens today when a customer inquires, books, orders, or needs support?" aria-invalid={Boolean(errors.challenge)} /><ErrorText name="challenge" errors={errors} /></label>
    <label className="consent"><input name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} /><span>I agree that Northstar Systems may use these details to respond to my inquiry.<ErrorText name="consent" errors={errors} /></span></label>
    {status === "error" && <p className="form-message error" role="alert">{message}</p>}
    <button className="button dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request my free systems audit"} <span aria-hidden="true">↗</span></button>
    <small>Your information is sent securely and used only to respond to this inquiry.</small>
  </form>;
}
