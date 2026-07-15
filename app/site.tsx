"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarDays, Check, CheckCircle2, Headphones, Mail, MessageCircle, MonitorSmartphone, PackageSearch, Phone, ShieldCheck, Store, Workflow } from "lucide-react";
import { ContactForm } from "./contact-form";
import { IndustrySelector, ProductDemo } from "./interactive-sections";
import { Logo } from "./logo";
import { siteConfig } from "./site-config";
import { commerceDisclaimer, industries, packages, process, services } from "./site-data";

const serviceIcons = [MonitorSmartphone, CalendarDays, Store, Bot, Workflow, Headphones];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [open]);
  const links = [["Services", "/#services"], ["Industries", "/#industries"], ["How It Works", "/#process"], ["Packages", "/#packages"], ["About", "/about"], ["Contact", "/#contact"]];
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <Link href="/" className="logo-link" aria-label="Northstar Systems home"><Logo /></Link>
    <nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="nav-cta" href={siteConfig.systemsAuditLink} onClick={() => setOpen(false)}>Book a Free Systems Audit</Link></nav>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}><span/><span/></button>
  </header>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Logo/><p>Connected digital systems for Philippine businesses.</p></div><div><span>Explore</span><Link href="/#services">Services</Link><Link href="/#industries">Industries</Link><Link href="/#packages">Packages</Link></div><div><span>Start</span><Link href={siteConfig.systemsAuditLink}>Book a free systems audit</Link>{siteConfig.emailConfigured&&<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>}</div></div><p className="footer-disclaimer">Northstar Systems provides technology implementation, integration, and support. Third-party software, hardware, subscriptions, accreditation, and tax requirements depend on the selected provider and client circumstances.</p><div className="footer-bottom"><small>© 2026 {siteConfig.name} · Philippines</small><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>;
}

function Shell({ children }: { children: React.ReactNode }) { return <div className="site"><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></div>; }
function Eyebrow({ children }: { children: React.ReactNode }) { return <span className="eyebrow">{children}</span>; }
const trustLaunch = ["A complete working website or configured system", "Admin access", "Staff training", "Written documentation", "Mobile and desktop testing", "Tested customer workflows", "Defined support period", "Clear third-party costs", "Secure account handover", "Client ownership of agreed accounts and assets"];
const trustProtection = ["Written scope", "Defined milestones", "Clear payment schedule", "Client approval before launch", "No surprise third-party costs", "Secure credential handling", "Backups", "Documentation", "Post-launch support plan"];
const auditIncludes = ["A 20–30 minute discovery call", "A review of how the business currently handles customers, bookings, sales, inventory, or inquiries", "Identification of the highest-friction workflow", "A recommended starting system", "A summary of likely tools and integrations", "A clear explanation of the next project step"];
const conversationTrust = ["Free 20–30 minute discovery call", "Clear recommendation with no obligation", "Written proposal only if the project is a good fit"];

function AuditDetails({ compact=false }: { compact?:boolean }) { return <div className={compact?"audit-details compact":"audit-details"}><h3>What the free systems audit includes</h3><ul>{auditIncludes.map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul><p>The free audit does not include custom website designs, full technical specifications, software configuration, detailed automation mapping, or implementation work.</p></div>; }
function ContactIntro() {
  const messengerLink = siteConfig.messengerLink || siteConfig.socialLinks.facebook;
  return <Reveal className="contact-intro">
    <Eyebrow>START A CONVERSATION</Eyebrow>
    <h2>Let’s find the clearest place to start.</h2>
    <p>Tell us what feels disconnected in your business today—customer inquiries, bookings, sales, inventory, follow-up, or support. We’ll review your situation and recommend the most practical next step.</p>
    <ul className="contact-trust">{conversationTrust.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
    <div className="direct-contact">
      <p>Prefer to message us directly?</p>
      <div>
        <a href={`mailto:${siteConfig.email}`}><Mail size={20} aria-hidden="true" /><span><small>Email</small><strong>{siteConfig.email}</strong></span></a>
        {messengerLink && <a href={messengerLink} target="_blank" rel="noreferrer"><MessageCircle size={20} aria-hidden="true" /><span><small>Messenger / Facebook</small><strong>Message Northstar</strong></span></a>}
        {siteConfig.phone && <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone size={20} aria-hidden="true" /><span><small>Phone</small><strong>{siteConfig.phone}</strong></span></a>}
      </div>
    </div>
  </Reveal>;
}

function ServicePreview({ index }: { index: number }) {
  if (index === 0) return <div className="service-preview browser-preview"><div><i/><i/><i/></div><span>Northstar Studio</span><h4>Make your next move clear.</h4><button>Start a project</button></div>;
  if (index === 1) return <div className="service-preview calendar-preview"><div className="mini-calendar"><span>MON</span><span>TUE</span><b>WED<br/>19</b><span>THU</span><span>FRI</span></div><div className="time-pills"><i>09:00</i><i className="active">10:30</i><i>13:00</i></div></div>;
  if (index === 2) return <div className="service-preview inventory-preview"><div><PackageSearch/><span>Stock overview</span></div><strong>1,249</strong><small>items tracked</small><p><i/> Low stock · 3 items</p></div>;
  if (index === 3) return <div className="service-preview message-preview"><span>How can I help today?</span><p>Check availability</p><p>Explore services</p><small>Human support available</small></div>;
  if (index === 4) return <div className="service-preview workflow-preview"><b>New inquiry</b><ArrowRight/><b>Staff alert</b><ArrowRight/><b>Follow-up</b></div>;
  return <div className="service-preview support-preview"><Headphones/><strong>Priority support</strong><span>Monitoring · Updates · Guidance</span></div>;
}

export function HomePage() {
  return <Shell>
    <section className="hero">
      <div className="hero-image"><Image src="/northstar-horizon-v2.png" alt="A Philippine coastal city beneath the North Star" fill priority unoptimized sizes="100vw"/></div>
      <div className="hero-content"><Reveal><Eyebrow>DIGITAL SYSTEMS FOR PHILIPPINE BUSINESSES</Eyebrow><h1>One connected system for your entire business.</h1><p>Northstar Systems builds your website, online booking, POS and inventory setup, AI customer assistant, and automation—then connects everything into one clear workflow.</p><div className="hero-actions"><Link className="button primary" href={siteConfig.systemsAuditLink}>Book a Free Systems Audit <ArrowRight size={19}/></Link><Link className="button secondary" href="#services">Explore Our Systems</Link></div><div className="service-line">Websites <i/> Online Booking <i/> POS & Inventory <i/> AI Assistance <i/> Automation <i/> Support</div></Reveal></div>
    </section>

    <section className="audit-scope-section"><Reveal><Eyebrow>FOCUSED FIRST STEP</Eyebrow><AuditDetails/></Reveal></section>

    <section className="services-section" id="services"><Reveal className="section-title split-title"><div><Eyebrow>SIX CONNECTED CAPABILITIES</Eyebrow><h2>Everything your business needs to operate online.</h2></div><p>Start with one system or connect your website, bookings, sales, inventory, customer assistance, and support into one practical workflow.</p></Reveal>
      <div className="service-list">{services.map((service, index) => { const Icon = serviceIcons[index]; return <Reveal key={service.slug}><article className={`service-row row-${index + 1}`}><div className="service-number">{service.code}</div><div className="service-copy"><div><Icon size={26}/><Eyebrow>{service.name}</Eyebrow></div><h3>{service.headline}</h3><p>{service.description}</p><ul>{service.features.slice(0, 4).map(item => <li key={item}><Check size={16}/>{item}</li>)}</ul><Link href={`/services/${service.slug}`}>Explore {service.name} <ArrowRight size={17}/></Link></div><ServicePreview index={index}/></article></Reveal>; })}</div>
    </section>

    <ProductDemo/>
    <IndustrySelector/>

    <section className="trust-section"><Reveal className="section-title"><Eyebrow>CONFIDENCE BEFORE GO-LIVE</Eyebrow><h2>What you receive before launch</h2></Reveal><div className="trust-columns"><Reveal><article><div className="trust-index"><ShieldCheck/><span>DELIVERY STANDARD</span></div><ul>{trustLaunch.map((item,index) => <li key={item}><span>{String(index + 1).padStart(2,"0")}</span>{item}</li>)}</ul></article></Reveal><Reveal><article><div className="trust-index"><CheckCircle2/><span>HOW YOUR PROJECT IS PROTECTED</span></div><h3>Clear agreements before important decisions.</h3><ul>{trustProtection.map((item,index) => <li key={item}><span>{String(index + 1).padStart(2,"0")}</span>{item}</li>)}</ul></article></Reveal></div></section>

    <section className="packages-section" id="packages"><Reveal className="section-title split-title"><div><Eyebrow>SOLUTION PACKAGES</Eyebrow><h2>A clear place to begin.</h2></div><p>Choose the closest starting point. Every system is then scoped around your actual workflow, team, locations, tools, and support needs.</p></Reveal><div className="packages-grid">{packages.map((item, index) => <Reveal key={item.name}><article className={index === 3 ? "featured" : ""}><div className="package-label"><span>{item.tag}</span><b>0{index + 1}</b></div><h3>{item.name}</h3><p>{item.description}</p><div className="package-solves"><span>PROBLEM IT SOLVES</span><p>{item.solves}</p></div><ul>{item.includes.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul><div className="scope-note"><span>WHAT MAY AFFECT THE FINAL SCOPE</span><p>{item.scope}</p></div><Link href="#contact">{item.cta}<ArrowRight/></Link></article></Reveal>)}</div><div className="pricing-notes"><p><b>Why pricing is customized:</b> Every Northstar system is scoped around the business’s workflow, number of locations, staff, products, booking resources, required integrations, and support needs. After a free systems audit, we provide a clear proposal with the project scope, timeline, and third-party costs.</p><p><b>Provider-cost note:</b> Third-party software, POS subscriptions, accreditation requirements, hardware, messaging, payment processing, AI usage, and other provider fees are quoted separately when applicable.</p></div></section>

    <section className="process-section" id="process"><Reveal className="section-title"><Eyebrow>HOW IT WORKS</Eyebrow><h2>From disconnected tools to one working system.</h2></Reveal><div className="process-list">{process.map(([number, title, copy]) => <Reveal key={number}><article><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article></Reveal>)}</div></section>

    <section className="founder-section"><div className="founder-portrait" aria-hidden="true"><div className="founder-monogram"><Logo compact/><i/><span>NORTHSTAR</span></div></div><Reveal className="founder-copy"><Eyebrow>FROM THE FOUNDER</Eyebrow><blockquote>“Technology earns its place when people can use it with confidence.”</blockquote><p>Northstar Systems focuses on practical technology that business owners and employees can understand, manage, and confidently use after launch.</p><div className="founder-name"><b>{siteConfig.founderName}</b><span>Founder, {siteConfig.name}</span></div><div className="founder-principles"><span>Practical before complicated</span><span>Connected before fragmented</span><span>Supported after launch</span></div></Reveal></section>

    <section className="founding-section"><Reveal className="founding-head"><div><Eyebrow>FOUNDING CLIENT PROGRAM · 3 PHILIPPINE BUSINESSES</Eyebrow><h2>Become a Northstar founding client.</h2></div><p>We are accepting three founding clients so each project receives direct founder involvement, preferred launch terms, hands-on implementation, and priority support.</p></Reveal><div className="founding-grid"><ul>{["Limited to three Philippine businesses", "Direct founder involvement", "Priority implementation", "Preferred launch terms", "Staff training", "Launch support", "Portfolio and case-study permission required", "Testimonial requested only after successful delivery", "Defined project scope", "Limited revision rounds", "Third-party provider fees remain separate"].map(item => <li key={item}><CheckCircle2/>{item}</li>)}</ul><div><span>BUILT FOR A SERIOUS FIRST ENGAGEMENT</span><h3>Close collaboration, clear boundaries, and a system your team can operate.</h3><p>Applications are reviewed based on project fit, business readiness, communication, available content, and whether the requested system can be delivered successfully within the founding-client period.</p><Link className="button primary" href={siteConfig.systemsAuditLink}>Apply for the Founding Client Program <ArrowRight/></Link></div></div></section>

    <section className="home-contact" id="contact"><ContactIntro/><ContactForm/></section>
  </Shell>;
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <section className="inner-hero"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div></section>; }
function FinalCTA() { return <section className="final-cta"><Eyebrow>A CLEARER WAY FORWARD</Eyebrow><h2>Let’s build the right system for your business.</h2><p>Start with a free systems audit and a focused recommendation.</p><Link className="button primary" href="/#contact">Book a Free Systems Audit <ArrowRight/></Link></section>; }
function ServiceStructuredData({ service }: { service: (typeof services)[number] }) { const data = { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.description, areaServed: { "@type": "Country", name: "Philippines" }, provider: { "@type": "Organization", name: siteConfig.name } }; return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}/>; }

export function ContentPage({ path }: { path: string }) {
  if (path === "services") return <Shell><PageHero eyebrow="CONNECTED CAPABILITIES" title="Systems that move your business forward." copy="Start with the system you need now, with a clear path to connect more when the business is ready."/><section className="page-services section-pad">{services.map(service => <article key={service.slug} style={{ "--accent": service.accent } as CSSProperties}><div><Eyebrow>{service.code} · {service.name}</Eyebrow><h2>{service.headline}</h2><p>{service.description}</p><Link href={`/services/${service.slug}`}>Explore the system <ArrowRight/></Link></div><ul>{service.features.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul></article>)}</section><FinalCTA/></Shell>;
  if (path.startsWith("services/")) { const service = services.find(item => path.endsWith(item.slug)); if (!service) return <Shell><PageHero eyebrow="NOT FOUND" title="That system page is not here." copy="Explore our connected systems or book a free audit."/><FinalCTA/></Shell>; return <Shell><ServiceStructuredData service={service}/><PageHero eyebrow={service.name} title={service.headline} copy={service.description}/><section className="service-detail section-pad"><div><Eyebrow>WHAT’S INCLUDED</Eyebrow><h2>Built around your real customer and staff workflow.</h2><p>{service.slug === "pos-inventory" ? "We help select and implement an appropriate third-party platform, then connect it to the wider customer journey where supported integrations allow." : service.slug === "ai-automation" ? "Northstar Assist works within approved information and escalates to your team when human judgment is needed." : "The system is scoped, configured, tested, and explained to your team—not handed over as another tool to figure out."}</p></div><div className="detail-list">{service.features.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><b>{feature}</b></div>)}</div>{service.slug === "pos-inventory" && <aside className="legal-note"><b>Important implementation note</b><p>{commerceDisclaimer}</p></aside>}</section><FinalCTA/></Shell>; }
  if (path === "industries") return <Shell><PageHero eyebrow="INDUSTRY SOLUTIONS" title="Built for how your business operates." copy="Northstar adapts to your staff, resources, customers, and operating rules."/><section className="industry-cards section-pad">{industries.map((item, index) => <article key={item.name}><span>0{index + 1}</span><h2>{item.name}</h2><p>{item.problem}</p><div className="recommended-system"><small>RECOMMENDED SYSTEM</small><b>{item.system}</b></div><ul>{item.features.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul></article>)}</section><FinalCTA/></Shell>;
  if (path === "about") return <Shell><PageHero eyebrow="ABOUT NORTHSTAR" title="Practical technology, built with the business." copy="Northstar Systems helps Philippine businesses modernize the path from discovery to service, sale, and support."/><section className="about-story section-pad"><div><Eyebrow>OUR POINT OF VIEW</Eyebrow><h2>A website should be the front door to a working business system.</h2></div><div><p>It should connect clear information with useful availability, straightforward action, reliable records, and support when people need it.</p><p>{siteConfig.founderName} founded Northstar to bring product design, technical implementation, workflow planning, and practical training into one accountable engagement.</p></div></section><section className="founder-section about-founder"><div className="founder-portrait" aria-hidden="true"><div className="founder-monogram"><Logo compact/><i/><span>NORTHSTAR</span></div></div><div className="founder-copy"><Eyebrow>{siteConfig.founderName.toUpperCase()} · FOUNDER</Eyebrow><blockquote>“Technology earns its place when people can use it with confidence.”</blockquote><p>Northstar Systems focuses on practical technology that business owners and employees can understand, manage, and confidently use after launch.</p></div></section><FinalCTA/></Shell>;
  if (path === "contact") return <Shell><PageHero eyebrow="FREE SYSTEMS AUDIT" title="Show us where the business feels disconnected." copy="We’ll review the workflow, identify the highest-friction areas, and outline a practical direction."/><section className="home-contact contact-page"><ContactIntro/><ContactForm/></section></Shell>;
  const privacy = path === "privacy";
  return <Shell><PageHero eyebrow="LEGAL" title={privacy ? "Privacy policy" : "Terms of service"} copy={privacy ? "How Northstar Systems handles information shared through this website." : "The basic terms governing this website and future client engagements."}/><section className="legal-page section-pad"><p>Last updated: July 14, 2026</p>{(privacy ? [["Information we collect", "We may collect information you voluntarily provide through inquiry forms, including your name, business details, contact information, and operational needs."], ["How information is used", "Information is used to respond to inquiries, assess service fit, prepare recommendations, improve the website, maintain security, and meet legal obligations."], ["Third-party services", "The website or client systems may rely on hosting, analytics, scheduling, payment, POS, communications, and other third-party providers. Their own privacy terms apply."], ["Data choices", "You may request access, correction, or deletion of information you submitted, subject to applicable requirements."], ["Contact", siteConfig.emailConfigured ? `Questions about privacy may be sent to ${siteConfig.email}.` : "Privacy questions can be submitted through the Northstar Systems inquiry form."]] : [["Website information", "Website content is general information and does not constitute tax, legal, accounting, medical, or other regulated professional advice."], ["Service engagements", "Specific services, deliverables, timelines, fees, dependencies, and third-party costs are governed by a separate written agreement."], ["Third-party platforms", "Northstar may recommend or implement third-party services. Availability, accreditation, pricing, subscriptions, hardware, and provider terms remain subject to those providers."], ["No guarantees", "We do not guarantee revenue, uninterrupted third-party services, tax compliance, or outcomes beyond commitments in a signed agreement."], ["Contact", siteConfig.emailConfigured ? `Questions about these terms may be sent to ${siteConfig.email}.` : "Questions about these terms can be submitted through the Northstar Systems inquiry form."]]).map(([heading, copy]) => <article key={heading}><h2>{heading}</h2><p>{copy}</p></article>)}</section></Shell>;
}
