"use client";

import { FormEvent, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { industries } from "./site-data";

type FieldErrors = Record<string, string[] | undefined>;
const services = ["Northstar Web", "Northstar Booking", "Northstar POS & Inventory", "Northstar Assist", "Northstar Automation", "Northstar Support", "Complete Business System"];
const budgets = ["Below ₱30,000", "₱30,000–₱60,000", "₱60,000–₱100,000", "₱100,000–₱250,000", "₱250,000+", "Not sure yet"];
const timelines = ["As soon as possible", "Within 30 days", "Within 1–3 months", "More than 3 months", "Still planning"];
const stepOneNames = ["name", "business", "email", "phone", "city", "services"];

function ErrorText({ name, errors }: { name:string; errors:FieldErrors }) { const message=errors[name]?.[0]; return message?<span id={`${name}-error`} className="field-error" role="alert">{message}</span>:null; }

export function ContactForm() {
  const formRef=useRef<HTMLFormElement>(null);
  const [step,setStep]=useState(1);
  const [status,setStatus]=useState<"idle"|"sending"|"done"|"error">("idle");
  const [message,setMessage]=useState("");
  const [errors,setErrors]=useState<FieldErrors>({});
  const [review,setReview]=useState<Record<string,string>>({});
  const errorProps=(name:string)=>({"aria-invalid":Boolean(errors[name]),"aria-describedby":errors[name]?`${name}-error`:undefined});

  function continueToDetails() {
    const form=formRef.current;
    if(!form)return;
    const values=Object.fromEntries(new FormData(form).entries()) as Record<string,string>;
    const nextErrors:FieldErrors={};
    if(values.name.trim().length<2)nextErrors.name=["Enter your full name."];
    if(values.business.trim().length<2)nextErrors.business=["Enter your business name."];
    if(!/^\S+@\S+\.\S+$/.test(values.email))nextErrors.email=["Enter a valid email address."];
    if(values.phone.trim().length<7)nextErrors.phone=["Enter a phone or Messenger contact."];
    if(values.city.trim().length<2)nextErrors.city=["Enter your city or province."];
    if(!values.services)nextErrors.services=["Select the service you need."];
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length){ const first=stepOneNames.find(name=>nextErrors[name]); (form.elements.namedItem(first||"name") as HTMLElement|null)?.focus(); return; }
    setReview(values); setStep(2); setMessage("");
    form.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    window.requestAnimationFrame(() => (form.elements.namedItem("industry") as HTMLElement|null)?.focus());
  }

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage(""); setErrors({});
    const form=event.currentTarget; const entries=Object.fromEntries(new FormData(form).entries()); const data={...entries,consent:entries.consent==="on"};
    try {
      const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
      const result=await response.json() as {ok?:boolean;message?:string;fieldErrors?:FieldErrors};
      if(!response.ok||!result.ok){ const fieldErrors=result.fieldErrors||{}; setErrors(fieldErrors); if(stepOneNames.some(name=>fieldErrors[name]))setStep(1); setMessage(result.message||"The request could not be sent."); setStatus("error"); return; }
      form.reset(); setStatus("done");
    } catch { setMessage("The request could not be sent. Please check your connection and try again later."); setStatus("error"); }
  }

  if(status==="done")return <div className="form-success" role="status"><i aria-hidden="true"><Check/></i><h3>Thank you.</h3><p>Northstar Systems has received your inquiry. We normally review qualified project requests within one business day. If the project appears to be a good fit, we will contact you to schedule the free systems audit.</p><button onClick={()=>{setStatus("idle");setStep(1);}}>Send another inquiry</button></div>;

  return <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
    <div className="form-progress" aria-label={`Step ${step} of 2`}><div><span>0{step}</span><b>{step===1?"Contact and business":"Project details"}</b></div><small>Step {step} of 2</small><i><span style={{width:step===1?"50%":"100%"}}/></i></div>
    <div className="honeypot" hidden><label>Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off"/></label></div>
    <fieldset className="form-step" hidden={step!==1}><legend>Contact and business</legend>
      <div className="field-row"><label>Full name<input name="name" required autoComplete="name" placeholder="Juan dela Cruz" {...errorProps("name")}/><ErrorText name="name" errors={errors}/></label><label>Business name<input name="business" required autoComplete="organization" placeholder="Your business" {...errorProps("business")}/><ErrorText name="business" errors={errors}/></label></div>
      <div className="field-row"><label>Email address<input name="email" type="email" required autoComplete="email" placeholder="you@business.com" {...errorProps("email")}/><ErrorText name="email" errors={errors}/></label><label>Phone or Messenger<input name="phone" required autoComplete="tel" placeholder="+63" {...errorProps("phone")}/><ErrorText name="phone" errors={errors}/></label></div>
      <div className="field-row"><label>City or province<input name="city" required autoComplete="address-level2" placeholder="Cebu City" {...errorProps("city")}/><ErrorText name="city" errors={errors}/></label><label>Service needed<select name="services" required defaultValue="" {...errorProps("services")}><option value="" disabled>Select a service</option>{services.map(service=><option key={service}>{service}</option>)}</select><ErrorText name="services" errors={errors}/></label></div>
      <button className="button primary form-continue" type="button" onClick={continueToDetails}>Continue to project details <ChevronRight size={18}/></button>
    </fieldset>
    <fieldset className="form-step" hidden={step!==2}><legend>Project details</legend>
      <label>Industry<select name="industry" required defaultValue="" {...errorProps("industry")}><option value="" disabled>Select an industry</option>{industries.map(industry=><option key={industry.name}>{industry.name}</option>)}<option>Other business</option></select><ErrorText name="industry" errors={errors}/></label>
      <label>Main business problem<textarea name="challenge" required rows={5} placeholder="What happens today when a customer inquires, books, orders, or needs support?" {...errorProps("challenge")}/><ErrorText name="challenge" errors={errors}/></label>
      <label>Current website or Facebook page <small>Optional</small><input name="currentWebsite" type="url" inputMode="url" placeholder="https://" {...errorProps("currentWebsite")}/><ErrorText name="currentWebsite" errors={errors}/></label>
      <div className="field-row"><label>Estimated project investment, if known<select name="budget" defaultValue=""><option value="">Select an option</option>{budgets.map(budget=><option key={budget}>{budget}</option>)}</select></label><label>Preferred project timeline, if known<select name="timeline" defaultValue=""><option value="">Select an option</option>{timelines.map(timeline=><option key={timeline}>{timeline}</option>)}</select></label></div>
      <div className="form-review"><span>REVIEW BEFORE SENDING</span><p><b>{review.name}</b> · {review.business}</p><p>{review.email} · {review.services}</p></div>
      <label className="consent"><input name="consent" type="checkbox" required {...errorProps("consent")}/><span>I agree that Northstar Systems may use these details to respond to my inquiry.<ErrorText name="consent" errors={errors}/></span></label>
      {status==="error"&&<p className="form-message error" role="alert">{message}</p>}
      <div className="form-actions"><button className="form-back" type="button" onClick={()=>{setStep(1);setMessage("");}}><ChevronLeft size={18}/> Back</button><button className="button primary" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending inquiry…":"Send project inquiry"}<span aria-hidden="true">↗</span></button></div>
    </fieldset>
    <small className="form-security">Spam protection is active. Your information is used only to review and respond to this inquiry.</small>
  </form>;
}
