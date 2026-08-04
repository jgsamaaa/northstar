"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, Mail, MessageCircle, MonitorSmartphone, Phone, ShieldCheck, Workflow } from "lucide-react";
import { ContactForm } from "./contact-form";
import { ProductDemo } from "./interactive-sections";
import { Logo } from "./logo";
import { publicContactEmail, siteConfig } from "./site-config";
import { advancedSystems, commerceDisclaimer, industries, packageAddOns, packages, process, projects, services, type Project } from "./site-data";

const homeOffers = [
  {
    eyebrow: "THE CORE OFFER",
    title: "Website design and development",
    copy: "A fast, credible website that explains your value, builds trust, and gives every visitor a clear next step.",
    features: ["Custom responsive design", "Conversion-focused service pages", "Inquiry, call, map, and Messenger connections"],
    href: "/services/websites",
    cta: "Explore website services",
    Icon: MonitorSmartphone,
  },
  {
    eyebrow: "CONNECT THE WORKFLOW",
    title: "Booking and business operations",
    copy: "Connect customer inquiries with scheduling, deposits, sales, inventory, and the records your team uses every day.",
    features: ["Online booking and availability", "POS and inventory implementation", "Clear customer and staff handoffs"],
    href: "/services/booking",
    cta: "Explore booking systems",
    Icon: CalendarDays,
  },
  {
    eyebrow: "GROW WITH CONTROL",
    title: "POS, inventory, and custom systems",
    copy: "Implement an appropriate operational platform first, then scope custom software only when the business truly needs it.",
    features: ["POS and inventory implementation", "Provider integration when supported", "Custom systems with clear operational boundaries"],
    href: "/services/pos-inventory",
    cta: "Explore operational systems",
    Icon: Workflow,
  },
] as const;

const homeStandards = [
  ["01", "Clear scope", "Know what is being built, what it costs, and what happens next."],
  ["02", "Working handover", "Receive access, documentation, training, and tested customer flows."],
  ["03", "No hidden provider costs", "Third-party subscriptions and hardware are explained before approval."],
  ["04", "Support after launch", "Launch is a handover, not the end of the relationship."],
] as const;

const homeProcess = [
  ["01", "Understand the business", "We identify the customer journey, the staff workflow, and the one problem worth fixing first."],
  ["02", "Design and build the right system", "You review the structure and key decisions before implementation moves forward."],
  ["03", "Test, train, and launch", "We test the real workflow, prepare your team, and hand over a system you can operate."],
] as const;

const conversationTrust = ["Free 20–30 minute discovery call", "Clear recommendation with no obligation", "Written proposal only if the project is a good fit"];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => {
    if (!open) return;
    const toggle = menuButtonRef.current;
    const navigation = navigationRef.current;
    if (!toggle || !navigation) return;
    const links = [...navigation.querySelectorAll<HTMLElement>("a[href]")];
    const focusFrame = requestAnimationFrame(() => links[0]?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => toggle.focus());
    };
  }, [open]);
  const links = [["Services", "/services"], ["Projects", "/projects"], ["Industries", "/industries"], ["How It Works", "/how-it-works"], ["Packages", "/packages"], ["About", "/about"], ["Contact", "/contact"]];
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <Link href="/" className="logo-link" aria-label="Northstar Systems home"><Logo /></Link>
    <nav ref={navigationRef} id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link className="nav-cta" href={siteConfig.systemsAuditLink} onClick={() => setOpen(false)}>Book a Free Systems Audit</Link></nav>
    <button ref={menuButtonRef} type="button" className="menu-button" onClick={() => setOpen(!open)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}><span/><span/></button>
  </header>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Logo/><p>Websites and connected digital systems for Philippine businesses.</p></div><div><span>Explore</span><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/industries">Industries</Link><Link href="/how-it-works">How It Works</Link><Link href="/packages">Packages</Link></div><div><span>Start</span><Link href={siteConfig.systemsAuditLink}>Book a free systems audit</Link>{publicContactEmail&&<a href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>}</div></div><p className="footer-disclaimer">Northstar Systems provides technology implementation, integration, and support. Third-party software, hardware, subscriptions, accreditation, and tax requirements depend on the selected provider and client circumstances.</p><div className="footer-bottom"><small>© 2026 {siteConfig.name} · Philippines</small><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></footer>;
}

export function SiteShell({ children }: { children: React.ReactNode }) { return <div className="site"><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></div>; }
function Eyebrow({ children }: { children: React.ReactNode }) { return <span className="eyebrow">{children}</span>; }

function ContactIntro() {
  const messengerLink = siteConfig.messengerLink || siteConfig.socialLinks.facebook;
  const hasDirectContact = Boolean(publicContactEmail || messengerLink || siteConfig.phone);
  return <Reveal className="contact-intro">
    <Eyebrow>START A CONVERSATION</Eyebrow>
    <h2>Let’s find the clearest place to start.</h2>
    <p>Tell us what feels disconnected in your business today—customer inquiries, bookings, sales, inventory, follow-up, or support. We’ll review your situation and recommend the most practical next step.</p>
    <ul className="contact-trust">{conversationTrust.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
    {hasDirectContact && <div className="direct-contact">
      <p>Prefer to message us directly?</p>
      <div>
        {publicContactEmail && <a href={`mailto:${publicContactEmail}`}><Mail size={20} aria-hidden="true" /><span><small>Email</small><strong>{publicContactEmail}</strong></span></a>}
        {messengerLink && <a href={messengerLink} target="_blank" rel="noreferrer"><MessageCircle size={20} aria-hidden="true" /><span><small>Messenger / Facebook</small><strong>Message Northstar</strong></span></a>}
        {siteConfig.phone && <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone size={20} aria-hidden="true" /><span><small>Phone</small><strong>{siteConfig.phone}</strong></span></a>}
      </div>
    </div>}
  </Reveal>;
}

function PackagesContent() {
  return <>
    <div className="packages-grid">{packages.map((item, index) => <Reveal key={item.name}><article className={index === 1 ? "featured" : ""}><div className="package-label"><span>{item.tag}</span><b>0{index + 1}</b></div><h2>{item.name}</h2><p className="package-price">{item.price}</p><div className="package-audience"><span>WHO IT IS FOR</span><p>{item.description}</p></div><p className="package-outcome">{item.outcome}</p><ul className="package-primary">{item.primary.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><details className="package-disclosure"><summary>View full scope <ChevronDown size={18} aria-hidden="true" /></summary><ul>{item.expanded.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul></details><Link href="/contact">{item.cta}<ArrowRight/></Link></article></Reveal>)}</div>
    <div className="pricing-notes"><p><b>Prices in Philippine pesos:</b> The listed amount covers the stated base scope. Additional pages, integrations, data entry, provider setup, and operational requirements are quoted before work begins.</p><p><b>Client-owned costs:</b> Clients purchase and own their domain and third-party accounts. Domain connection, subscriptions, hardware, messaging, payment processing, accreditation work, and other provider fees are separate.</p></div>
    <section className="advanced-systems" aria-labelledby="advanced-systems-title"><div className="package-section-heading"><Eyebrow>ADVANCED SYSTEMS</Eyebrow><h2 id="advanced-systems-title">Custom work starts with a validated operational scope.</h2><p>These are separate products—not small website add-ons. Final pricing depends on workflows, users, locations, integrations, compliance, data migration, and support requirements.</p></div><div className="advanced-system-grid">{advancedSystems.map(item => <article key={item.name}><span>{item.price}</span><h3>{item.name}</h3><p>{item.description}</p><ul>{item.features.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><Link href="/contact">Request a scoped proposal <ArrowRight size={17} aria-hidden="true" /></Link></article>)}</div></section>
    <section className="package-addons" aria-labelledby="package-addons-title"><div className="package-section-heading"><Eyebrow>ADD-ONS & CLIENT-OWNED COSTS</Eyebrow><h2 id="package-addons-title">Add only what the project actually needs.</h2></div><div className="package-addon-list">{packageAddOns.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></section>
  </>;
}

function ProcessList() {
  return <div className="process-list">{process.map(([number, title, copy]) => <Reveal key={number}><article><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article></Reveal>)}</div>;
}

function ProjectVisual({ project }: { project: Project }) {
  const projectHost = new URL(project.href).hostname;
  return <a className="project-visual" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.name} live project`}>
    <span className="project-preview-shell">
      <span className="project-preview-bar" aria-hidden="true"><span><i/><i/><i/></span><b>{projectHost}</b><em>↗</em></span>
      <span className="project-preview-image"><Image src={project.image} alt={`Homepage preview of ${project.name}`} fill sizes="(max-width: 760px) calc(100vw - 72px), 52vw"/></span>
    </span>
    <span className="project-preview-label" aria-hidden="true">LIVE WEBSITE PREVIEW</span>
  </a>;
}

function ProjectCards({ compact = false }: { compact?: boolean }) {
  const featuredSlugs = ["top-asia", "bukidnon", "hidden-gardens-resort", "the-petite-creamery"];
  const visibleProjects = compact ? projects.filter((project) => featuredSlugs.includes(project.slug)) : projects;
  return <div className={`project-grid ${compact ? "project-grid-compact" : ""}`}>
    {visibleProjects.map((project, index) => <Reveal key={project.slug}>
      <article id={project.slug} style={{ "--project-accent": project.accent } as CSSProperties}>
        <ProjectVisual project={project}/>
        <div className="project-card-copy">
          <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <ul>{project.services.map(service => <li key={service}>{service}</li>)}</ul>
          {!compact&&<div className="project-outcome"><small>WHAT WAS DESIGNED</small><p>{project.outcome}</p></div>}
          {compact ? <>
            <span className="project-status"><i/>{project.status}</span>
            <a className="project-live-link" href={project.href} target="_blank" rel="noreferrer">View live project <ArrowRight size={17} aria-hidden="true"/></a>
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
          </> : <div className="project-card-footer">
            <div className="project-card-actions">
              <span className="project-status"><i/>{project.status}</span>
              <a className="project-live-link" href={project.href} target="_blank" rel="noreferrer">View live project <ArrowRight size={17} aria-hidden="true"/></a>
            </div>
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
          </div>}
        </div>
      </article>
    </Reveal>)}
  </div>;
}

export function HomePage() {
  return <SiteShell>
    <section className="hero">
      <div className="hero-image"><Image src="/northstar-horizon-v2.webp" alt="A Philippine coastal city beneath the North Star" fill priority sizes="100vw"/></div>
      <div className="hero-content"><Reveal><Eyebrow>WEB DEVELOPMENT & CONNECTED SYSTEMS FOR PHILIPPINE BUSINESSES</Eyebrow><h1>Websites that help Philippine businesses earn trust and win more inquiries.</h1><p>Northstar designs and builds professional websites first, then connects booking, sales, inventory, customer support, and automation when the business needs more.</p><div className="hero-actions"><Link className="button primary" href={siteConfig.systemsAuditLink}>Book a Free Systems Audit <ArrowRight size={19}/></Link><Link className="button secondary" href="/services/websites">Explore Website Services</Link></div><div className="service-line">Web Design & Development <i/> Online Booking <i/> Business Systems <i/> Automation <i/> Support</div></Reveal></div>
    </section>

    <section className="home-offers" id="services">
      <Reveal className="section-title split-title"><div><Eyebrow>START WITH WHAT MATTERS MOST</Eyebrow><h2>A professional website first. Connected systems when they make sense.</h2></div><p>You do not need every tool at once. Start with the clearest customer or operational problem, then expand from a solid foundation.</p></Reveal>
      <div className="home-offer-grid">{homeOffers.map(({ eyebrow, title, copy, features, href, cta, Icon }, index) => <Reveal key={title}><article className={index === 0 ? "featured" : ""}><div className="home-offer-head"><span>0{index + 1}</span><Icon aria-hidden="true"/></div><small>{eyebrow}</small><h3>{title}</h3><p>{copy}</p><ul>{features.map(feature => <li key={feature}><Check size={16} aria-hidden="true"/>{feature}</li>)}</ul><Link href={href}>{cta}<ArrowRight size={17} aria-hidden="true"/></Link></article></Reveal>)}</div>
    </section>

    <ProductDemo/>

    <section className="projects-section home-projects">
      <Reveal className="section-title split-title"><div><Eyebrow>SELECTED PROJECTS</Eyebrow><h2>Real work, presented with honest context.</h2></div><p>Explore current Northstar projects across customer-facing websites and operational product systems.</p></Reveal>
      <ProjectCards compact/>
      <Link className="text-link" href="/projects">View all project details <ArrowRight size={17} aria-hidden="true"/></Link>
    </section>

    <section className="home-industries">
      <Reveal className="home-industries-copy"><Eyebrow>BUILT AROUND THE REAL WORKFLOW</Eyebrow><h2>Built for businesses where every customer handoff matters.</h2><p>Northstar adapts the system to the way your customers inquire, book, buy, and return. The tools follow the workflow, not the other way around.</p><div className="industry-chips">{industries.map(industry => <span key={industry.short}>{industry.short}</span>)}</div></Reveal>
      <Reveal className="home-industries-actions"><Link className="button primary" href="/industries">Explore industry solutions <ArrowRight size={18}/></Link><Link className="text-link" href="/packages">Compare solution packages <ArrowRight size={17}/></Link></Reveal>
    </section>

    <section className="home-standards">
      <Reveal className="section-title split-title"><div><Eyebrow>CONFIDENCE BEFORE GO-LIVE</Eyebrow><h2>Professional delivery is part of the product.</h2></div><p>A polished launch means little if the team cannot use the system or does not know what it owns.</p></Reveal>
      <div className="home-standard-grid">{homeStandards.map(([number, title, copy]) => <Reveal key={number}><article><span>{number}</span><ShieldCheck aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div>
    </section>

    <section className="home-process">
      <Reveal className="section-title split-title"><div><Eyebrow>HOW NORTHSTAR WORKS</Eyebrow><h2>A clear process, without the usual agency fog.</h2></div><p>You see the important decisions before they become expensive changes.</p></Reveal>
      <div className="home-process-grid">{homeProcess.map(([number, title, copy]) => <Reveal key={number}><article><span>{number}</span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div>
      <Link className="text-link light" href="/how-it-works">See the full project process <ArrowRight size={17}/></Link>
    </section>

    <section className="founding-section compact-founding"><Reveal className="founding-head"><div><Eyebrow>FOUNDING CLIENT PROGRAM</Eyebrow><h2>Build the first version with the founder at the table.</h2></div><p>Selected early clients receive direct founder involvement, preferred launch terms, hands-on implementation, and priority support.</p></Reveal><div className="founding-grid"><ul>{["Direct founder involvement", "Preferred launch terms", "Staff training and launch support", "Clear scope and provider costs"].map(item => <li key={item}><CheckCircle2 aria-hidden="true"/>{item}</li>)}</ul><div><span>FOR BUSINESSES READY TO PARTICIPATE</span><h3>A close working relationship, with clear boundaries on both sides.</h3><p>Northstar reviews each application for project fit, business readiness, available content, and a realistic path to a successful launch.</p><Link className="button primary" href={siteConfig.systemsAuditLink}>Ask about the founding client program <ArrowRight/></Link></div></div></section>

    <section className="home-contact" id="contact"><ContactIntro/><ContactForm/></section>
  </SiteShell>;
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <section className="inner-hero"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div></section>; }
function FinalCTA() { return <section className="final-cta"><Eyebrow>A CLEARER WAY FORWARD</Eyebrow><h2>Let’s build the right system for your business.</h2><p>Start with a free systems audit and a focused recommendation.</p><Link className="button primary" href={siteConfig.systemsAuditLink}>Book a Free Systems Audit <ArrowRight/></Link></section>; }
function ServiceStructuredData({ service, nonce }: { service: (typeof services)[number]; nonce?: string }) { const data = { "@context": "https://schema.org", "@type": "Service", "@id": `${siteConfig.domain}/services/${service.slug}#service`, url: `${siteConfig.domain}/services/${service.slug}`, name: service.name, description: service.description, areaServed: { "@type": "Country", name: "Philippines" }, provider: { "@id": `${siteConfig.domain}/#organization`, "@type": "Organization", name: siteConfig.name } }; return <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}/>; }

export function ContentPage({ path, nonce }: { path: string; nonce?: string }) {
  if (path === "services") return <SiteShell><PageHero eyebrow="CONNECTED CAPABILITIES" title="Systems that move your business forward." copy="Start with the system you need now, with a clear path to connect more when the business is ready."/><section className="page-services section-pad">{services.map(service => <article key={service.slug} style={{ "--accent": service.accent } as CSSProperties}><div><Eyebrow>{service.code} · {service.name}</Eyebrow><h2>{service.headline}</h2><p>{service.description}</p><Link href={`/services/${service.slug}`}>Explore the system <ArrowRight/></Link></div><ul>{service.features.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul></article>)}</section><FinalCTA/></SiteShell>;
  if (path.startsWith("services/")) { const service = services.find(item => path.endsWith(item.slug)); if (!service) return <SiteShell><PageHero eyebrow="NOT FOUND" title="That system page is not here." copy="Explore our connected systems or book a free audit."/><FinalCTA/></SiteShell>; return <SiteShell><ServiceStructuredData service={service} nonce={nonce}/><PageHero eyebrow={service.name} title={service.headline} copy={service.description}/><section className="service-detail section-pad"><div><Eyebrow>WHAT’S INCLUDED</Eyebrow><h2>Built around your real customer and staff workflow.</h2><p>{service.slug === "pos-inventory" ? "We help select and implement an appropriate third-party platform, then connect it to the wider customer journey where supported integrations allow." : service.slug === "ai-automation" ? "Northstar Assist works within approved information and escalates to your team when human judgment is needed." : "The system is scoped, configured, tested, and explained to your team—not handed over as another tool to figure out."}</p></div><div className="detail-list">{service.features.map((feature, index) => <div key={feature}><span>{String(index + 1).padStart(2, "0")}</span><b>{feature}</b></div>)}</div>{service.slug === "pos-inventory" && <aside className="legal-note"><b>Important implementation note</b><p>{commerceDisclaimer}</p></aside>}</section><FinalCTA/></SiteShell>; }
  if (path === "projects") return <SiteShell><PageHero eyebrow="SELECTED PROJECTS" title="Digital work designed around the real job." copy="A growing record of Northstar website concepts and product systems, with each project clearly labeled by its current stage."/><section className="projects-section projects-page"><Reveal className="section-title split-title"><div><Eyebrow>PROJECT INDEX</Eyebrow><h2>Different industries. The same standard of clarity.</h2></div><p className="projects-intro-summary">This collection will grow as new Northstar projects are approved for publication. No invented outcomes or client claims.</p></Reveal><div className="projects-intro-support"><p className="portfolio-context"><strong>Portfolio context:</strong> Service tags describe the disciplines demonstrated in each project. They do not, by themselves, claim a paid client engagement, endorsement, or production adoption.</p><nav className="hub-growth-links" aria-label="Related industry services"><Link href="/industries/resorts-hotels">Explore resort and hotel website design</Link><Link href="/industries/dental-clinics">Explore dental clinic website design</Link></nav></div><ProjectCards/></section><FinalCTA/></SiteShell>;
  if (path === "industries") return <SiteShell><PageHero eyebrow="INDUSTRY SOLUTIONS" title="Built for how your business operates." copy="Northstar adapts to your staff, resources, customers, and operating rules."/><section className="industry-cards section-pad"><nav className="hub-growth-links" aria-label="Featured industry guides"><Link href="/industries/resorts-hotels">Resorts and hotels</Link><Link href="/industries/dental-clinics">Dental clinics</Link></nav>{industries.map((item, index) => <article key={item.name}><span>0{index + 1}</span><h2>{item.name}</h2><p>{item.problem}</p><div className="industry-recommendation"><span className="industry-recommendation-label">RECOMMENDED SYSTEM</span><p className="industry-recommendation-text">{item.system}</p></div><ul>{item.features.map(feature => <li key={feature}><Check/>{feature}</li>)}</ul></article>)}</section><FinalCTA/></SiteShell>;
  if (path === "how-it-works") return <SiteShell><PageHero eyebrow="HOW IT WORKS" title="A clear path from business problem to working system." copy="Every project moves through focused discovery, practical design, careful implementation, and a supported handover."/><section className="process-section process-page"><Reveal className="section-title split-title"><div><Eyebrow>THE NORTHSTAR PROCESS</Eyebrow><h2>Clarity at every step.</h2></div><p>You will know what is being built, why it matters, what it costs, and what your team needs before anything goes live.</p></Reveal><ProcessList/></section><FinalCTA/></SiteShell>;
  if (path === "packages") return <SiteShell><PageHero eyebrow="SOLUTION PACKAGES" title="Start with a clear product and a clear price." copy="Choose a focused website package or begin with a scoped booking, POS, inventory, or custom system. Client-owned services and additional work are always identified separately."/><section className="packages-section standalone-packages"><PackagesContent/><nav className="hub-growth-links" aria-label="Website pricing guide"><Link href="/guides/business-website-cost-philippines">Read the 2026 business website cost guide</Link></nav></section><FinalCTA/></SiteShell>;
  if (path === "about") return <SiteShell><PageHero eyebrow="ABOUT NORTHSTAR" title="Practical technology, focused on Philippine businesses." copy="Northstar combines disciplined execution and practical web development to help businesses build a stronger presence online."/><section className="about-story section-pad"><div><Eyebrow>ABOUT NORTHSTAR SYSTEMS</Eyebrow><h2>Practical digital systems built to help Philippine businesses move forward.</h2></div><div><p>Northstar Systems helps Philippine businesses create a stronger online presence and connect the tools behind inquiries, bookings, sales, inventory, customer support, and follow-up.</p><p>The goal is not to add more software for its own sake. It is to build one clear, practical system that customers can trust and teams can confidently operate.</p></div></section><FinalCTA/></SiteShell>;
  if (path === "contact") return <SiteShell><PageHero eyebrow="FREE SYSTEMS AUDIT" title="Show us where the business feels disconnected." copy="We’ll review the workflow, identify the highest-friction areas, and outline a practical direction."/><section className="home-contact contact-page"><ContactIntro/><ContactForm/></section></SiteShell>;
  const privacy = path === "privacy";
  return <SiteShell><PageHero eyebrow="LEGAL" title={privacy ? "Privacy policy" : "Terms of service"} copy={privacy ? "How Northstar Systems handles information shared through this website." : "The basic terms governing this website and future client engagements."}/><section className="legal-page section-pad"><p>Last updated: July 14, 2026</p>{((privacy ? [["Information we collect", "We may collect information you voluntarily provide through inquiry forms, including your name, business details, contact information, and operational needs."], ["How information is used", "Information is used to respond to inquiries, assess service fit, prepare recommendations, improve the website, maintain security, and meet legal obligations."], ["Third-party services", "The website or client systems may rely on hosting, analytics, scheduling, payment, POS, communications, and other third-party providers. Their own privacy terms apply."], ["Data choices", "You may request access, correction, or deletion of information you submitted, subject to applicable requirements."], ["Contact", siteConfig.emailConfigured ? <>Questions about privacy may be sent to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</> : "Privacy questions can be submitted through the Northstar Systems inquiry form."]] : [["Website information", "Website content is general information and does not constitute tax, legal, accounting, medical, or other regulated professional advice."], ["Service engagements", "Specific services, deliverables, timelines, fees, dependencies, and third-party costs are governed by a separate written agreement."], ["Third-party platforms", "Northstar may recommend or implement third-party services. Availability, accreditation, pricing, subscriptions, hardware, and provider terms remain subject to those providers."], ["No guarantees", "We do not guarantee revenue, uninterrupted third-party services, tax compliance, or outcomes beyond commitments in a signed agreement."], ["Contact", siteConfig.emailConfigured ? <>Questions about these terms may be sent to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</> : "Questions about these terms can be submitted through the Northstar Systems inquiry form."]]) as Array<[string, React.ReactNode]>).map(([heading, copy]) => <article key={heading}><h2>{heading}</h2><p>{copy}</p></article>)}</section></SiteShell>;
}
