import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "../contact-form";
import { ProductDemo } from "../interactive-sections";
import { projects } from "../site-data";
import { SiteShell } from "../site";
import { AuditActions, Disclosure, FaqSection, HomeSchema, InlineLink, OrderedProcess, TextLinks, Topic, TopicGrid, type Faq } from "./shared";

const faqs: Faq[] = [
  { question: "Does Northstar serve businesses outside Metro Manila?", answer: "Yes. Northstar serves Philippine businesses that can be supported remotely across Luzon, Visayas, and Mindanao. The exact discovery, review, training, and support process is agreed during scoping." },
  { question: "Does every project start with a custom system?", answer: "No. Northstar prefers an appropriate established platform when it can support the workflow well. Custom software is scoped when the business has validated requirements that general-purpose tools cannot handle effectively." },
  { question: "Can Northstar build only a website?", answer: "Yes. A focused static or business website can be delivered without adding booking, POS, inventory, AI, or custom software. Connected systems can be considered later when they solve a real need." },
  { question: "Can a website connect to booking, POS, inventory, or payment providers?", answer: "Sometimes. Integration depends on the provider, available connection methods, required data, and approved project scope. Northstar confirms these conditions before promising a connection." },
  { question: "How much does a Northstar website cost?", answer: "Current Northstar packages start at ₱15,000 for a Starter Static Website and ₱25,000 for a Business Website. Booking websites start at ₱50,000. The final price depends on the approved scope, and client-owned provider costs are separate. See the Packages page for current details." },
  { question: "What happens during the Free Systems Audit?", answer: "Northstar reviews the problem you describe, asks about the customer and staff workflow, and recommends a practical place to start. The discovery call normally takes 20–30 minutes. A written proposal is prepared only when the project appears to be a good fit." },
];

const services = [
  { title: "Website design and development", copy: "Build a fast, credible website that explains what you do, supports your brand, and gives every visitor a useful next action.", items: ["Responsive website design", "Clear service and product pages", "Inquiry forms or direct contact links", "Basic search and social-sharing foundations", "Mobile-friendly customer journeys"], href: "/services/websites", link: "Explore website design and development" },
  { title: "Online booking and reservations", copy: "Give customers a clearer path to request or confirm an appointment, service, room, venue, or other scheduled resource.", items: ["Service, room, staff, or resource selection", "Date and time workflows", "Booking-provider integration", "Confirmation and reminder options when supported", "Honest availability and inquiry states"], href: "/services/booking", link: "Explore online booking systems" },
  { title: "POS and inventory implementation", copy: "Connect products, stock, cashier access, sales records, and reporting through an appropriate established provider—or scope custom work only when the operation genuinely requires it.", items: ["Product and inventory configuration", "Cashier and staff accounts", "Low-stock alerts when supported", "Reports and operational handover", "Website integration when the selected provider supports it"], href: "/services/pos-inventory", link: "Explore POS and inventory systems" },
  { title: "Custom business software", copy: "When spreadsheets and general-purpose tools can no longer support a validated workflow, Northstar can scope a system around the people, permissions, records, and decisions involved.", items: ["Internal dashboards and business tools", "Inventory, rental, or operational workflows", "User roles and approval steps", "Reports, exports, and audit history where required", "Integrations and migration assessed during discovery"], href: "/services/custom-software-development", link: "Explore custom software development" },
  { title: "AI assistance and business automation", copy: "Reduce repetitive questions and handoffs without removing human judgment from the moments that need it.", items: ["Website assistance based on approved information", "Inquiry routing and staff alerts", "Booking notifications and follow-up", "Record synchronization where supported", "Clear escalation to a person"], href: "/services/ai-automation", link: "Explore AI and automation services" },
  { title: "Support after launch", copy: "A working handover is part of the product. Northstar can provide monitoring, issue resolution, guidance, and planned improvements under an agreed support scope.", items: [], href: "/services/support-maintenance", link: "Explore support and maintenance" },
] as const;

const industries = [
  ["Clinics and dental practices", "service information, appointment requests, practitioner availability, intake, reminders, and controlled FAQ assistance", "/industries/dental-clinics"],
  ["Resorts and hotels", "rooms, packages, guest inquiries, reservation workflows, deposits, and direct booking paths", "/industries/resorts-hotels"],
  ["Salons and spas", "service selection, staff schedules, appointments, packages, and repeat-customer follow-up", "/industries"],
  ["Restaurants and cafés", "menus, reservations, order inquiries, POS setup, inventory, and reporting", "/industries"],
  ["Retail businesses", "product catalogs, sales, stock, cashier access, low-stock alerts, and branch reporting", "/industries"],
  ["Rentals and service companies", "resources, date selection, request-to-book flows, deposits, approvals, and reminders", "/industries"],
] as const;

export function GrowthHomePage({ nonce }: { nonce?: string }) {
  const featured = projects.filter((project) => ["top-asia", "bukidnon", "hidden-gardens-resort", "the-petite-creamery"].includes(project.slug));
  return <SiteShell>
    <HomeSchema faqs={faqs} nonce={nonce} />
    <article className="growth-page growth-home">
      <header className="growth-home-hero">
        <Image src="/northstar-horizon-v2.webp" alt="A Philippine coastal city beneath the North Star" fill priority sizes="100vw" />
        <div className="growth-home-overlay" />
        <div className="growth-shell">
          <span className="eyebrow">WEB DEVELOPMENT &amp; CONNECTED SYSTEMS FOR PHILIPPINE BUSINESSES</span>
          <h1>Websites and connected business systems for Philippine companies.</h1>
          <p>Northstar Systems is a web development company serving businesses across the Philippines. We design professional websites first, then connect booking, sales, inventory, customer support, and automation when the workflow calls for it.</p>
          <p>The goal is not to add more software. It is to give customers a clearer next step and give your team a system it can confidently operate.</p>
          <AuditActions secondary={{ label: "Explore Website Services", href: "/services/websites" }} />
          <p className="growth-service-strip">Web Design &amp; Development · Online Booking · POS &amp; Inventory · Custom Software · Automation · Support</p>
        </div>
      </header>

      <div className="growth-body">
        <section className="growth-section"><div className="growth-shell"><h2>Start with the website. Connect the rest when it makes sense.</h2><div className="growth-copy"><p>A growing business does not always need a large custom system on day one. It needs the right foundation, a clear customer journey, and a practical plan for what should connect next.</p><p>Northstar starts with the most important customer or operational problem. That may be a website that does not explain the business clearly, appointments managed through scattered messages, stock records that do not match daily sales, or follow-up work that depends on someone remembering every step.</p><TopicGrid>{services.map((service) => <Topic key={service.title} title={service.title}><p>{service.copy}</p>{service.items.length > 0 && <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>}<TextLinks><InlineLink href={service.href}>{service.link}</InlineLink></TextLinks></Topic>)}</TopicGrid><TextLinks><InlineLink href="/services/automation-integrations">Explore business automation and integrations</InlineLink></TextLinks></div></div></section>

        <section className="growth-section growth-tinted"><div className="growth-shell"><h2>Built for businesses across the Philippines.</h2><div className="growth-copy"><p>Northstar works with Philippine businesses that can be supported remotely across Luzon, Visayas, and Mindanao. Discovery, content review, design decisions, testing, training, and handover can be organized around the client’s team and operating schedule.</p><p>The work remains specific to the business. A clinic does not need the same customer flow as a resort. A retailer does not manage availability the way an equipment-rental company does. The website and connected systems should reflect those differences rather than force every business into the same template.</p><TextLinks><InlineLink href="/industries">Explore industry solutions</InlineLink><InlineLink href="/how-it-works">See how Northstar projects work</InlineLink></TextLinks></div></div></section>

        <section className="growth-section growth-dark"><div className="growth-shell"><h2>See how the systems work together.</h2><div className="growth-copy"><p>A website can do more than display information. It can guide a customer from a question to the right service, collect the details your team needs, connect to an appropriate provider, and create a clearer handoff.</p><p>Use the Northstar product demonstration to explore simplified booking, POS and inventory, and AI-assistance flows.</p><Disclosure><strong>Sample data is shown for demonstration purposes.</strong><p>Demonstrations do not represent a live client deployment or guarantee that every provider supports the same features.</p></Disclosure></div></div></section>
        <ProductDemo />

        <section className="growth-section growth-projects"><div className="growth-shell"><h2>Work presented with honest context.</h2><div className="growth-copy"><p>Northstar’s project collection includes live websites, internal products, and clearly labeled concepts. Each entry explains what was designed and its current stage so visitors can evaluate the work without invented client outcomes.</p><p>Use selected projects to show relevant strengths in responsive web development, hospitality journeys, clinic content structure, product workflows, and operational systems.</p><div className="growth-project-grid">{featured.map((project) => <article key={project.slug}><Link href="/projects"><span className="growth-project-image"><Image src={project.image} alt={`Desktop interface preview of ${project.name}`} fill sizes="(max-width: 720px) 100vw, 50vw" /></span><span className="growth-project-status">{project.status}</span><h3>{project.name}</h3><p>{project.summary}</p></Link></article>)}</div><TextLinks><InlineLink href="/projects">View selected projects</InlineLink></TextLinks></div></div></section>

        <section className="growth-section growth-tinted"><div className="growth-shell"><h2>Designed around the way your business actually operates.</h2><div className="growth-copy"><p>Northstar plans the customer-facing website and the staff workflow together. The tools should support how customers inquire, book, buy, and return—and how your team confirms, records, fulfills, and follows up.</p><div className="growth-industry-list">{industries.map(([name, copy, href]) => <article key={name}><h3><Link href={href}>{name}</Link></h3><p>{copy}</p></article>)}</div><TextLinks><InlineLink href="/industries">Explore industry solutions</InlineLink><InlineLink href="/industries/resorts-hotels">Websites and booking journeys for resorts and hotels</InlineLink><InlineLink href="/industries/dental-clinics">Dental clinic websites and appointment systems</InlineLink></TextLinks></div></div></section>

        <section className="growth-section growth-dark"><div className="growth-shell"><h2>A clear process from first problem to working system.</h2><div className="growth-copy"><OrderedProcess items={[
          { title: "Understand the business", copy: <p>Northstar reviews the customer journey, the staff workflow, the current tools, and the one problem worth solving first.</p> },
          { title: "Define the right scope", copy: <p>You see the proposed structure, responsibilities, provider costs, and important boundaries before implementation moves forward.</p> },
          { title: "Design and build", copy: <p>Northstar develops the approved pages and workflows, reviews important decisions with you, and avoids adding features that have not earned their place.</p> },
          { title: "Test, train, and launch", copy: <p>The agreed customer flow is tested. Your team receives the access, guidance, and handover included in the project scope.</p> },
          { title: "Support what comes next", copy: <p>Ongoing support and future improvements can be planned separately after launch.</p> },
        ]}/><TextLinks><InlineLink href="/how-it-works">See the full Northstar process</InlineLink></TextLinks></div></div></section>

        <section className="growth-section"><div className="growth-shell"><h2>What a Northstar project includes.</h2><div className="growth-copy"><dl className="growth-definition-grid"><div><dt>Clear scope</dt><dd>Understand what is being built, what it costs, and what is outside the current phase.</dd></div><div><dt>Client ownership</dt><dd>Client-owned domains and third-party accounts remain with the client.</dd></div><div><dt>Provider transparency</dt><dd>Subscriptions, hardware, transaction charges, messaging costs, and other provider fees are identified separately.</dd></div><div><dt>Working handover</dt><dd>Receive the agreed access, documentation, training, and tested flows.</dd></div><div><dt>Honest boundaries</dt><dd>Live availability, integrations, compliance requirements, and automation capabilities depend on the selected provider and validated scope.</dd></div><div><dt>Support options</dt><dd>Maintenance and improvements are available under a separate support plan.</dd></div></dl><TextLinks><InlineLink href="/packages">Compare solution packages</InlineLink><InlineLink href="/about">Learn about Northstar</InlineLink></TextLinks></div></div></section>

        <FaqSection faqs={faqs} />

        <section className="growth-home-contact"><div className="growth-shell"><div><span className="eyebrow">FREE SYSTEMS AUDIT</span><h2>Find the clearest place to start.</h2><p>Tell Northstar what feels disconnected today—your website, customer inquiries, bookings, sales, inventory, follow-up, or support. We will review the situation and recommend a focused first step.</p><ul><li>Free 20–30 minute discovery call</li><li>Clear recommendation with no obligation</li><li>Written proposal only when the project is a good fit</li></ul></div><ContactForm /></div></section>
      </div>
    </article>
  </SiteShell>;
}
