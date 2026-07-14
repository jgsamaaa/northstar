"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Headphones,
  Hotel,
  MessageSquareText,
  MonitorSmartphone,
  Scissors,
  ShoppingBag,
  Sparkles,
  Store,
  Stethoscope,
  UtensilsCrossed,
  Workflow,
} from "lucide-react";
import { ContactForm } from "./contact-form";
import { Logo } from "./logo";
import { siteConfig } from "./site-config";
import { commerceDisclaimer, industries, packages, process, services } from "./site-data";

const Arrow = () => <span aria-hidden="true">↗</span>;

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="logo-link" aria-label="Northstar Systems home"><Logo /></Link>
      <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
        <Link href="/services" onClick={() => setOpen(false)}>Solutions</Link>
        <Link href="/industries" onClick={() => setOpen(false)}>Industries</Link>
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/#process" onClick={() => setOpen(false)}>Resources</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <Link className="nav-cta" href="/contact" onClick={() => setOpen(false)}>Book a consultation <Arrow /></Link>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-head"><Logo /><p>Better business,<br />by design.</p></div>
      <div className="footer-grid">
        <div><span>Explore</span><Link href="/services">Systems</Link><Link href="/industries">Industries</Link><Link href="/about">Studio</Link></div>
        <div><span>Start</span><Link href="/contact">Book a free audit</Link><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
        <div><span>Follow</span><a href={siteConfig.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a><a href={siteConfig.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>
      </div>
      <p className="footer-disclaimer">Northstar Systems provides technology implementation, integration, and support. Third-party software, hardware, subscriptions, accreditation, and tax requirements depend on the selected provider and client circumstances.</p>
      <div className="footer-bottom"><small>© 2026 Northstar Systems · Philippines</small><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </footer>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="site"><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /></div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow"><i aria-hidden="true" />{children}</span>;
}

function SectionHead({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return <div className="section-head"><Eyebrow>{kicker}</Eyebrow><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function FinalCTA() {
  return <section className="final-cta"><div className="cta-kicker">A CLEARER WAY FORWARD</div><h2>Let’s build the right system for your business.</h2><p>Tell us what you need—website, booking, POS, AI, or a complete setup—and we’ll recommend the best place to start.</p><div><Link href="/contact" className="button light">Book a consultation <Arrow /></Link><a href={`mailto:${siteConfig.email}`} className="text-button">Send an inquiry</a></div></section>;
}

function HomeClosingCTA() {
  return <section className="home-close">
    <Reveal className="home-close-copy">
      <div className="home-close-status"><Sparkles size={16} strokeWidth={1.4} /><span>FOUNDING CLIENT PROGRAM</span><b>03 OPENINGS</b></div>
      <h2>Ready to make the business <em>easier to run?</em></h2>
    </Reveal>
    <Reveal className="home-close-action" delay={.1}>
      <p>Start with a focused systems audit. We’ll identify the highest-friction part of your customer journey and recommend the clearest place to begin.</p>
      <div className="home-close-actions"><Link href="/contact" className="button light">Book a free consultation <ArrowRight size={15} /></Link><a href={`mailto:${siteConfig.email}`} className="text-button">Email Northstar</a></div>
      <small>No obligation. Clear next steps, whether we work together or not.</small>
    </Reveal>
  </section>;
}

export function HomePage() {
  const serviceIcons = [MonitorSmartphone, CalendarDays, Store, Bot, Workflow, Headphones];
  const industryIcons = [Stethoscope, Scissors, Hotel, UtensilsCrossed, ShoppingBag, MessageSquareText];
  const journeySteps = [
    { stage: "Attract", system: "Website", detail: "Discovery & inquiry", Icon: MonitorSmartphone },
    { stage: "Schedule", system: "Booking", detail: "Availability & reminders", Icon: CalendarDays },
    { stage: "Complete", system: "Payment & POS", detail: "A simpler path to sale", Icon: ShoppingBag },
    { stage: "Operate", system: "Inventory", detail: "Clear stock visibility", Icon: Store },
    { stage: "Retain", system: "Support", detail: "Answers & follow-up", Icon: Headphones },
  ];
  const values = [
    ["Tailored to your workflow", "We shape the system around the way your business actually operates—not a generic template."],
    ["Premium implementation", "Strategy, design, configuration, testing, and training are handled as one complete engagement."],
    ["Smart, practical automation", "We automate repeatable work where it helps, while keeping people in control of important decisions."],
    ["Support after launch", "Your system stays useful through monitoring, updates, troubleshooting, and planned improvements."],
  ];

  return <Shell>
    <section className="cinematic-hero">
      <div className="cinematic-visual"><Image src="/northstar-horizon-v2.png" alt="A Philippine coastal city at night beneath a bright North Star" fill priority unoptimized sizes="100vw" /><span aria-hidden="true" /></div>
      <div className="cinematic-inner">
        <Reveal className="cinematic-copy">
          <div className="cinematic-label"><i /> DIGITAL SYSTEMS FOR GROWING BUSINESSES</div>
          <h1>One connected system.<br /><span>Every moving part</span><br /><em>working together.</em></h1>
          <p>We design your website, booking, commerce, automation, and support around one customer journey—so growth creates momentum, not more admin.</p>
          <div className="cinematic-actions"><Link href="/services" className="button blue">Explore solutions <ArrowRight size={15} /></Link><Link href="/contact" className="button outline">Book a free consultation</Link></div>
        </Reveal>
        <Reveal className="hero-system-index" delay={.12}>
          <div className="hero-index-head"><span>SYSTEM INDEX</span><small>NS / 01—05</small></div>
          {services.slice(0, 5).map((service, index) => <Link href={`/services/${service.slug}`} key={service.slug}><span>0{index + 1}</span><b>{service.name.replace("Northstar ", "")}</b><ArrowRight size={13} /></Link>)}
        </Reveal>
        <div className="hero-meta">
          <span>PHILIPPINES · NATIONWIDE</span>
          <span>WEB · BOOKING · COMMERCE · AI · SUPPORT</span>
          <a href="#systems">SCROLL TO EXPLORE <b>↓</b></a>
        </div>
      </div>
    </section>

    <section className="editorial-section services-overview" id="systems">
      <Reveal className="editorial-heading"><Eyebrow>What we do</Eyebrow><h2>End-to-end systems that <em>power your business.</em></h2><p>From the first customer click to the final sale and follow-up, every part is planned to work as one clear system.</p></Reveal>
      <div className="premium-service-grid">{services.slice(0, 6).map((service, index) => { const Icon = serviceIcons[index]; return <Reveal key={service.slug} delay={index * .05}><Link href={`/services/${service.slug}`} className="premium-service-card"><div><Icon size={22} strokeWidth={1.4} /><span>0{index + 1}</span></div><h3>{service.name.replace("Northstar ", "")}</h3><p>{service.description}</p><ArrowRight className="card-arrow" size={18} /></Link></Reveal>; })}</div>
    </section>

    <section className="connected-section" id="connected">
      <Reveal className="connected-copy"><div><Eyebrow>Connected by design</Eyebrow><h2>One customer journey. <em>Every system in step.</em></h2></div><div><p>Your customers do not see separate tools. They experience one journey—from discovery and booking to payment, fulfillment, and support.</p><Link href="/services" className="text-link">See how the systems connect <ArrowRight size={15} /></Link></div></Reveal>
      <Reveal className="journey-stage" delay={.12}>
        <div className="journey-watermark" aria-hidden="true">INQUIRY <span>TO</span> RETURN</div>
        <div className="journey-track" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: [.22, 1, .36, 1] }} /></div>
        <div className="journey-grid">{journeySteps.map(({ stage, system, detail, Icon }, index) => <article className="journey-step" key={system}><div className="journey-anchor"><span>{String(index + 1).padStart(2, "0")}</span><i /></div><div className="journey-card"><Icon size={21} strokeWidth={1.3} /><small>{stage}</small><h3>{system}</h3><p>{detail}</p></div></article>)}</div>
        <div className="journey-result"><span>ONE CONNECTED CUSTOMER RECORD</span><b>Less re-encoding. Fewer missed handoffs. A clearer view for your team.</b></div>
      </Reveal>
    </section>

    <section className="editorial-section industries-overview">
      <Reveal className="editorial-heading split"><div><Eyebrow>Solutions by business type</Eyebrow><h2>Built for how your business <em>operates.</em></h2></div><p>Different industries have different constraints. We design around the real workflow, resources, team, and customer expectations.</p></Reveal>
      <div className="industry-editorial-grid">{industries.map((industry, index) => { const Icon = industryIcons[index]; return <Reveal key={industry.name} delay={index * .05}><article><Icon size={24} strokeWidth={1.3} /><span>0{index + 1}</span><h3>{industry.name}</h3><p>{industry.note}</p><Link href="/industries" aria-label={`Explore solutions for ${industry.name}`}><ArrowRight size={17} /></Link></article></Reveal>; })}</div>
    </section>

    <section className="why-section">
      <Reveal className="why-intro"><Eyebrow>Why Northstar</Eyebrow><h2>Clear strategy.<br />Better systems.<br /><em>Stronger execution.</em></h2></Reveal>
      <div className="why-list">{values.map(([title, copy], index) => <Reveal key={title} delay={index * .06}><article><span>0{index + 1}</span><CheckCircle2 size={20} strokeWidth={1.4} /><div><h3>{title}</h3><p>{copy}</p></div></article></Reveal>)}</div>
    </section>

    <section className="packages-section" id="packages">
      <Reveal className="packages-heading"><div><Eyebrow>Ways to work together</Eyebrow><h2>Choose a clear starting point. <em>Build from there.</em></h2></div><p>Each engagement is scoped around the business, but these packages make the first decision easier. Start focused or connect the complete customer journey.</p></Reveal>
      <div className="packages-grid">{packages.map((item, index) => <Reveal key={item.name} delay={index * .06}><article className={index === packages.length - 1 ? "is-featured" : ""}>
        <div className="package-top"><span>0{index + 1}</span><b>{item.tag}</b></div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <ul>{item.includes.map(feature => <li key={feature}><CheckCircle2 size={14} strokeWidth={1.5} />{feature}</li>)}</ul>
        <Link href="/contact">{item.cta}<ArrowRight size={15} /></Link>
      </article></Reveal>)}</div>
      <p className="packages-note">Every proposal defines scope, timeline, third-party costs, and support options before work begins.</p>
    </section>

    <section className="process-section" id="process">
      <Reveal className="process-heading"><Eyebrow>How we work</Eyebrow><h2>A clear process from first conversation to ongoing support.</h2></Reveal>
      <div className="process-track">{process.map(([number, title, copy], index) => <Reveal key={number} delay={index * .06}><article><div><span>{number}</span>{index < process.length - 1 && <i />}</div><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div>
    </section>

    <section className="founder-section">
      <Reveal className="founder-copy">
        <Eyebrow>From the founder</Eyebrow>
        <h2>Good systems should feel <em>almost invisible.</em></h2>
        <p className="founder-lede">They should remove friction, give teams confidence, and let the business focus on the work that matters.</p>
        <p>That is the standard behind Northstar: understand the real workflow first, recommend only what fits, and stay accountable after launch. We are not here to add software for its own sake. We are here to make the business clearer and easier to run.</p>
        <div className="founder-signature"><span>FOUNDER</span><b>NORTHSTAR SYSTEMS</b></div>
      </Reveal>
      <Reveal className="founder-principles" delay={.1}>
        <span className="founder-index">FOUNDER NOTE · 01</span>
        <blockquote>“Technology earns its place when people can use it with confidence.”</blockquote>
        <div>{[["01", "Listen first", "The workflow comes before the tool."], ["02", "Keep it practical", "Every feature needs a clear purpose."], ["03", "Stay accountable", "Launch is the beginning, not the handoff."]].map(([number, title, copy]) => <article key={number}><span>{number}</span><div><b>{title}</b><p>{copy}</p></div></article>)}</div>
      </Reveal>
    </section>

    <HomeClosingCTA />
  </Shell>;
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="inner-hero"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div><div className="inner-star"><Logo compact /><span>NORTHSTAR<br />SYSTEMS</span></div></section>;
}

function ServiceStructuredData({ service }: { service: (typeof services)[number] }) {
  const data = { "@context":"https://schema.org", "@type":"Service", name:service.name, description:service.description, areaServed:{"@type":"Country",name:"Philippines"}, provider:{"@type":"Organization",name:siteConfig.name} };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g,"\\u003c") }} />;
}

export function ContentPage({ path }: { path: string }) {
  if (path === "services") return <Shell><PageHero eyebrow="Connected capabilities" title="Systems that move your business forward." copy="From a high-performing website to booking, commerce, and customer assistance—every solution is planned as part of one operating picture."/><section className="page-services section-pad">{services.map(s=><article key={s.slug} style={{"--accent":s.accent} as CSSProperties}><div><span>{s.code} · {s.label}</span><h2>{s.name}</h2><h3>{s.headline}</h3><p>{s.description}</p><Link className="button dark" href={`/services/${s.slug}`}>Explore the system <Arrow /></Link></div><ul>{s.features.map(f=><li key={f}>✓ {f}</li>)}</ul></article>)}</section><FinalCTA/></Shell>;
  if (path.startsWith("services/")) { const service = services.find(s=>path.endsWith(s.slug)); if (!service) return <Shell><PageHero eyebrow="Not found" title="That system page isn’t here." copy="Explore our connected systems or book a free audit."/><FinalCTA/></Shell>; return <Shell><ServiceStructuredData service={service}/><PageHero eyebrow={service.label} title={service.headline} copy={service.description}/><section className="service-detail section-pad"><div className="detail-copy"><span>{service.name.toUpperCase()}</span><h2>Built around your real customer and staff workflow.</h2><p>{service.slug==="ai-automation"?"Northstar Assist combines customer-facing AI assistance with ongoing technical support. It works within approved information and escalates when human judgment is needed.":service.slug==="pos-inventory"?"We help select and implement an appropriate third-party platform, then connect it to the wider customer journey where integrations allow.":"The system is scoped, configured, tested, and explained to your team—not handed over as another tool to figure out."}</p></div><div className="detail-list">{service.features.map((f,i)=><div key={f}><span>{String(i+1).padStart(2,"0")}</span><b>{f}</b></div>)}</div>{service.slug==="pos-inventory"&&<aside className="legal-note"><b>Important implementation note</b><p>{commerceDisclaimer}</p></aside>}{service.slug==="ai-automation"&&<aside className="legal-note"><b>Controlled by design</b><p>AI assistance is not positioned as replacing employees or providing medical, legal, accounting, or tax advice.</p></aside>}</section><FinalCTA/></Shell>; }
  if (path === "industries") return <Shell><PageHero eyebrow="Industry solutions" title="Built for the realities of busy teams." copy="Northstar adapts to your business model, staff, resources, customers, and operating rules."/><section className="industries-page section-pad"><div className="industry-cards">{industries.map((x,i)=><article key={x.name}><span>0{i+1}</span><h3>{x.name}</h3><p>{x.note}</p><ul>{x.features.map(f=><li key={f}>{f}</li>)}</ul></article>)}</div></section><FinalCTA/></Shell>;
  if (path === "about") return <Shell><PageHero eyebrow="About Northstar" title="A systems partner for businesses ready for more clarity." copy="We help Philippine businesses modernize the path from customer discovery to service, sale, and support."/><section className="about-story section-pad"><div><span>OUR POINT OF VIEW</span><h2>A website should never be an isolated brochure.</h2></div><div><p>It should be the front door to a thoughtfully connected business: clear information, useful availability, straightforward action, reliable records, and support when people need it.</p><p>We bring product design, technical implementation, workflow planning, and practical training into one engagement. The result is technology shaped around how your business actually works.</p></div></section><section className="principles section-pad"><SectionHead kicker="Working principles" title="Ambitious about outcomes. Precise about claims."/><div>{[["01","Clarity first","We define scope, dependencies, costs, and responsibilities before implementation."],["02","People stay in control","Automation handles repeatable work; staff retain judgment and customer care."],["03","Fit over feature count","We recommend what the business can genuinely use and support."],["04","Built for continuity","Documentation, training, and ongoing support make launches sustainable."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section><FinalCTA/></Shell>;
  if (path === "contact") return <Shell><PageHero eyebrow="Free systems audit" title="Show us where the business feels disconnected." copy="We’ll review the workflow, identify the highest-friction areas, and outline a practical direction—without pushing unnecessary software."/><section className="contact-section section-pad"><div className="contact-aside"><span>WHAT TO EXPECT</span><h2>A focused first conversation.</h2>{["A review of your customer journey","Questions about bookings, sales, staff, and inventory","A look at the tools you already use","Clear next steps if there is a good fit"].map((x,i)=><div key={x}><b>0{i+1}</b><p>{x}</p></div>)}<aside><strong>Prefer email?</strong><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></aside></div><ContactForm/></section></Shell>;
  const privacy = path === "privacy";
  return <Shell><PageHero eyebrow="Legal" title={privacy?"Privacy policy":"Terms of service"} copy={privacy?"How Northstar Systems handles information shared through this website.":"The basic terms governing use of this website and future client engagements."}/><section className="legal-page section-pad"><p className="updated">Last updated: July 14, 2026</p>{(privacy?[["Information we collect","We may collect information you voluntarily provide through inquiry forms, including your name, business details, contact information, and operational needs."],["How information is used","Information is used to respond to inquiries, assess service fit, prepare recommendations, improve the website, maintain security, and meet legal obligations."],["Third-party services","The website or client systems may rely on hosting, analytics, scheduling, payment, POS, communications, and other third-party providers. Their own privacy terms apply."],["Data choices","You may request access, correction, or deletion of information you submitted, subject to applicable requirements."],["Contact",`Questions about privacy may be sent to ${siteConfig.email}.`]]:[["Website information","Website content is general information and does not constitute tax, legal, accounting, medical, or other regulated professional advice."],["Service engagements","Specific services, deliverables, timelines, fees, dependencies, and third-party costs are governed by a separate written agreement."],["Third-party platforms","Northstar may recommend or implement third-party services. Availability, accreditation, pricing, subscriptions, hardware, and provider terms remain subject to those providers."],["No guarantees","We do not guarantee revenue, uninterrupted third-party services, tax compliance, or outcomes beyond commitments in a signed agreement."],["Intellectual property","Unless otherwise agreed in writing, Northstar’s original materials, branding, and system methods remain protected by applicable laws."],["Contact",`Questions about these terms may be sent to ${siteConfig.email}.`]]).map(([h,c])=><article key={h}><h2>{h}</h2><p>{c}</p></article>)}</section></Shell>;
}
