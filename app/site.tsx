"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { ContactForm } from "./contact-form";
import { Logo } from "./logo";
import { siteConfig } from "./site-config";
import { commerceDisclaimer, faqs, industries, packages, process, services } from "./site-data";

const Arrow = () => <span aria-hidden="true">↗</span>;

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
        <Link href="/services" onClick={() => setOpen(false)}>Systems</Link>
        <Link href="/industries" onClick={() => setOpen(false)}>Who it’s for</Link>
        <Link href="/#process" onClick={() => setOpen(false)}>Process</Link>
        <Link href="/about" onClick={() => setOpen(false)}>Studio</Link>
        <Link className="nav-cta" href="/contact" onClick={() => setOpen(false)}>Free systems audit <Arrow /></Link>
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

function SystemMap() {
  const items = ["CUSTOMERS", "WEBSITE", "BOOKING", "SALES", "INVENTORY", "SUPPORT"];
  return (
    <div className="system-map" aria-label="A connected customer and operations system">
      <div className="map-label">YOUR OPERATING SYSTEM</div>
      <div className="map-core"><Logo compact /><b>NORTHSTAR</b><span>everything, in sync</span></div>
      {items.map((item, index) => <div className={`map-node node-${index + 1}`} key={item}><span>0{index + 1}</span><b>{item}</b></div>)}
      <div className="map-status"><i /> ALL SYSTEMS TALKING</div>
    </div>
  );
}

function ProductDemo() {
  const [tab, setTab] = useState<"booking" | "commerce" | "assist">("booking");
  const [slot, setSlot] = useState("10:30");
  const [sent, setSent] = useState(false);
  return (
    <section className="demo-section section-pad">
      <div className="demo-intro"><SectionHead kicker="See it, don’t imagine it" title="A working preview—not another pitch deck." copy="Tap through a sample booking, commerce, and customer-support flow. The data is illustrative; the experience is real." /></div>
      <div className="product-window">
        <div className="window-top"><div className="window-dots"><i /><i /><i /></div><b>Northstar OS / Live preview</b><span>DEMO DATA</span></div>
        <div className="demo-tabs" role="tablist" aria-label="Product previews">
          {([['booking','Booking'],['commerce','Commerce'],['assist','AI Assist']] as const).map(([id,label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}><span>0{['booking','commerce','assist'].indexOf(id)+1}</span>{label}</button>)}
        </div>
        {tab === "booking" && <div className="demo-canvas booking-canvas">
          <div className="demo-copy"><span>WELLNESS STUDIO</span><h3>Book without the back-and-forth.</h3><p>Real availability. Clear confirmation. No Messenger tag.</p><div className="mini-progress"><i className="done" /><i className="active" /><i /></div></div>
          <div className="booking-card"><div><small>AUGUST 2026</small><b>Choose a time</b></div><div className="date-row">{[15,16,17,18,19].map(d => <button key={d} className={d===17 ? "selected" : ""}><span>{['FRI','SAT','SUN','MON','TUE'][d-15]}</span>{d}</button>)}</div><div className="slot-row">{['09:00','10:30','14:00'].map(t => <button key={t} onClick={() => {setSlot(t);setSent(false)}} className={slot===t ? "selected" : ""}>{t}</button>)}</div><button className="confirm-button" onClick={() => setSent(true)}>{sent ? "BOOKING CONFIRMED ✓" : `CONFIRM ${slot}`} </button></div>
        </div>}
        {tab === "commerce" && <div className="demo-canvas commerce-canvas"><div className="commerce-title"><span>OPERATIONS / TODAY</span><h3>Everything moving.<br />Nothing hidden.</h3></div><div className="metric-card metric-a"><span>NET SALES</span><strong>₱84,260</strong><small>↑ 12.4% today</small></div><div className="metric-card metric-b"><span>ORDERS</span><strong>126</strong><small>18 from website</small></div><div className="metric-card metric-c"><span>LOW STOCK</span><strong>07</strong><small>Needs attention</small></div><div className="bar-chart">{[38,62,48,83,58,94,74].map((n,i)=><i key={i} style={{height:`${n}%`}} />)}</div><div className="order-alert"><b>NEW ORDER #1048</b><span>Website → POS workflow</span><i>NOW</i></div></div>}
        {tab === "assist" && <div className="demo-canvas assist-canvas"><div className="assist-profile"><div className="assist-orb"><Logo compact /></div><span>CONTROLLED AI</span><h3>Fast answers.<br />Human judgment.</h3><p>Approved knowledge in English, Tagalog, and Bisaya—with a clean handoff to your team.</p></div><div className="chat-card"><div className="chat-header"><i /><b>Northstar Assist</b><span>ONLINE</span></div><p className="chat-bubble bot">Hi! I can help with services, pricing, or available times.</p><p className="chat-bubble user">Do you have an opening Saturday?</p><p className="chat-bubble bot">Yes—10:30 AM and 2:00 PM are available. Want me to reserve one?</p><button>HAND OFF TO STAFF ↗</button></div></div>}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="faq section-pad"><SectionHead kicker="Straight answers" title="Good questions deserve clear answers." /><div className="faq-list">{faqs.slice(0,8).map(([q,a],i)=><article key={q} className={open===i ? "open" : ""}><button onClick={() => setOpen(open===i ? -1 : i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,"0")}</span><b>{q}</b><i>{open===i ? "−" : "+"}</i></button>{open===i && <p>{a}</p>}</article>)}</div></section>;
}

function FinalCTA() {
  return <section className="final-cta"><div className="cta-kicker">YOUR MOVE <span>✦</span> OUR SYSTEM</div><h2>Let’s make your business easier to run.</h2><p>Bring us the messy workflow. We’ll find the clearest place to start.</p><div><Link href="/contact" className="button dark">Book my free audit <Arrow /></Link><a href={`mailto:${siteConfig.email}`} className="text-button">or email us directly</a></div><div className="cta-stamp"><Logo compact /><span>BUILT FOR<br />THE PHILIPPINES</span></div></section>;
}

export function HomePage() {
  const friction = ["Slow replies", "Double bookings", "Lost inquiries", "Mystery inventory", "Manual follow-ups", "Scattered reports"];
  return <Shell>
    <section className="hero">
      <div className="hero-note"><i /> Founding client spots open / 2026</div>
      <div className="hero-main"><div className="hero-copy"><Eyebrow>Business systems, beautifully connected</Eyebrow><h1>Less chaos.<br /><em>More business.</em></h1><p>Northstar connects your website, bookings, sales, inventory, and customer support—so your team can move faster and your customers never feel the gaps.</p><div className="hero-actions"><Link href="/contact" className="button primary">Fix my workflow <Arrow /></Link><Link href="#systems" className="button ghost">See how it works ↓</Link></div></div><SystemMap /></div>
      <div className="hero-bottom"><span>WEBSITES</span><i>✦</i><span>BOOKING</span><i>✦</i><span>POS + INVENTORY</span><i>✦</i><span>AI SUPPORT</span><i>✦</i><span>AUTOMATION</span></div>
    </section>
    <section className="manifesto section-pad"><Eyebrow>The honest problem</Eyebrow><div className="manifesto-grid"><h2>Your business grew.<br />Your tools didn’t.</h2><div><p>Customers are waiting in Messenger. Staff are cross-checking calendars. Sales live in one app and stock in another.</p><p className="manifesto-answer">You don’t need more software.<br /><strong>You need the pieces to work together.</strong></p></div></div><div className="friction-row">{friction.map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b><i>×</i></div>)}</div></section>
    <section className="systems section-pad" id="systems"><div className="systems-top"><SectionHead kicker="The Northstar system" title="One clear operating picture." copy="Start with the biggest bottleneck. Add what you need. Keep every piece connected." /><div className="systems-index">01—04<br /><span>CORE SYSTEMS</span></div></div><div className="service-grid">{services.map((service,i)=><article key={service.slug} style={{"--accent":service.accent} as CSSProperties}><div className="service-number">{String(i+1).padStart(2,"0")}<span>↗</span></div><span className="service-label">{service.label}</span><h3>{service.name}</h3><p>{service.headline}</p><ul>{service.features.slice(0,4).map(f=><li key={f}>{f}</li>)}</ul><Link href={`/services/${service.slug}`}>EXPLORE SYSTEM <Arrow /></Link></article>)}</div></section>
    <ProductDemo />
    <section className="industries-section section-pad"><div className="industry-lead"><SectionHead kicker="Built around real work" title="Different business. Same need for clarity." /><Link href="/industries" className="round-link">VIEW ALL<br />INDUSTRIES <Arrow /></Link></div><div className="industry-list">{industries.map((industry,i)=><Link href="/industries" key={industry.name}><span>{String(i+1).padStart(2,"0")}</span><h3>{industry.name}</h3><p>{industry.note}</p><i>↗</i></Link>)}</div></section>
    <section className="process section-pad" id="process"><SectionHead kicker="No black box" title="From scattered to switched on." /><div className="process-list">{process.map(([n,t,c],i)=><article key={n}><div className="process-marker"><span>{n}</span>{i<process.length-1 && <i />}</div><h3>{t}</h3><p>{c}</p></article>)}</div></section>
    <section className="packages section-pad"><SectionHead kicker="Ways to work together" title="Start where it hurts most." copy="Every engagement is scoped around your business. Third-party subscriptions, hardware, and fees stay transparent." /><div className="package-grid">{packages.map((pack,i)=><article key={pack.name} className={i===3 ? "featured" : ""}><span>{pack.tag}</span><h3>{pack.name}</h3><p>{pack.description}</p><ul>{pack.includes.slice(0,5).map(item=><li key={item}>✓ {item}</li>)}</ul><Link href="/contact">{pack.cta} <Arrow /></Link></article>)}</div></section>
    <FAQ /><FinalCTA />
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
