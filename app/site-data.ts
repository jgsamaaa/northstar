export type Service = {
  slug: string;
  code: string;
  name: string;
  label: string;
  headline: string;
  description: string;
  features: string[];
  accent: string;
};

export const services: Service[] = [
  {
    slug: "websites",
    code: "01",
    name: "Northstar Web",
    label: "WEB & CONVERSION",
    headline: "Professional websites built to convert.",
    description: "Custom, mobile-first websites designed to make a business look legitimate, explain its services clearly, and turn visitors into inquiries, bookings, or customers.",
    features: ["Custom responsive design", "Product or service presentation", "Inquiry forms", "Google Maps", "Search-engine foundations", "Analytics", "Messenger and call integration", "Fast performance"],
    accent: "#5ddcff",
  },
  {
    slug: "booking",
    code: "02",
    name: "Northstar Booking",
    label: "BOOKING & SCHEDULING",
    headline: "Let customers book without waiting for a reply.",
    description: "Real-time booking systems that display available dates and times while preventing scheduling conflicts.",
    features: ["Service selection", "Staff scheduling", "Room scheduling", "Vehicle scheduling", "Equipment scheduling", "Deposits", "Confirmations", "Reminders", "Rescheduling", "Cancellation rules", "Waitlists", "Customer records"],
    accent: "#2f7bff",
  },
  {
    slug: "pos-inventory",
    code: "03",
    name: "Northstar Commerce",
    label: "POS & INVENTORY",
    headline: "Connect sales, products, and inventory.",
    description: "Northstar Systems helps businesses select, configure, and connect an appropriate POS and inventory system.",
    features: ["Product encoding", "Cashier accounts", "Inventory tracking", "Low-stock alerts", "Website order integration when supported", "Sales reports", "Staff training", "BIR-ready setup assistance through suitable accredited providers"],
    accent: "#8aa9ff",
  },
  {
    slug: "ai-automation",
    code: "04",
    name: "Northstar Assist",
    label: "AI & AUTOMATION",
    headline: "AI customer assistance with real human support.",
    description: "A controlled AI assistant answers approved questions, explains services, checks connected availability, captures inquiries, and transfers customers to staff when necessary.",
    features: ["English, Tagalog, and Bisaya", "Frequently asked questions", "Service recommendations", "Availability checking", "Lead capture", "Human escalation", "Business-information updates", "Integration monitoring", "Technical support"],
    accent: "#72e7c3",
  },
];

export const industries = [
  { name: "Clinics & dental practices", short: "Clinics", note: "Clear scheduling without clinical overreach.", features: ["Patient scheduling", "Staff calendars", "Intake forms", "Reminders", "Customer database", "AI FAQ assistant"] },
  { name: "Salons & spas", short: "Wellness", note: "A smoother path from discovery to repeat visit.", features: ["Employee scheduling", "Service booking", "Deposits", "Product sales", "Memberships", "Repeat-customer reminders"] },
  { name: "Resorts & event venues", short: "Hospitality", note: "Availability, packages, and guest communication in one flow.", features: ["Room or venue availability", "Request-to-book", "Packages and add-ons", "Deposits", "Guest communication", "POS connection"] },
  { name: "Restaurants & cafés", short: "Food", note: "Connect the menu, inquiries, reservations, and operations.", features: ["Website menu", "Reservations", "Online order requests", "POS setup", "Inventory", "Customer assistance"] },
  { name: "Retail businesses", short: "Retail", note: "Keep products, branches, and customer questions visible.", features: ["Product catalog", "Website orders", "POS setup", "Inventory", "Branch reporting", "Customer inquiries"] },
  { name: "Rentals & service companies", short: "Rentals", note: "Make scarce resources easier to schedule and manage.", features: ["Vehicle, room, equipment, or team availability", "Deposits", "Agreements", "Automated reminders", "Customer records"] },
];

export const process = [
  ["01", "Systems Audit", "We review how the business handles customers, bookings, sales, inventory, and staff."],
  ["02", "Solution Plan", "You receive a clear scope, timeline, recommended tools, and third-party costs."],
  ["03", "Build & Connect", "We create the website and configure the approved booking, POS, automation, and AI tools."],
  ["04", "Test & Train", "We test the complete workflow and train the owner and staff."],
  ["05", "Launch & Support", "The system launches with documentation, monitoring, and optional ongoing support."],
];

export const packages = [
  { name: "Website Launch", tag: "ESTABLISH", description: "For businesses that need a professional online presence.", includes: ["Custom business website", "Service or product presentation", "Inquiry forms", "Contact integrations", "Basic analytics and SEO setup"], cta: "Request a proposal" },
  { name: "Booking Growth System", tag: "SCHEDULE", description: "For appointment, rental, resort, clinic, salon, and service businesses.", includes: ["Professional website", "Real-time booking", "Staff or resource scheduling", "Confirmations", "Customer records", "Admin dashboard"], cta: "Book a systems audit" },
  { name: "Commerce System", tag: "OPERATE", description: "For restaurants, retail stores, hardware, auto parts, and product businesses.", includes: ["Professional website", "POS provider setup", "Inventory configuration", "Product migration", "Staff accounts", "Training and integration planning"], cta: "Request a proposal" },
  { name: "Complete Business System", tag: "CONNECT", description: "For businesses requiring bookings, sales, inventory, AI assistance, and automation.", includes: ["Website", "Booking", "POS and inventory", "AI assistant", "Automation", "Training and ongoing support options"], cta: "Build my system" },
];

export const faqs = [
  ["Can the website connect to our POS?", "Sometimes. Website-to-POS integration depends on the selected POS platform and the integrations it supports. We confirm the available connection before it enters the project scope."],
  ["Can customers see unavailable dates and times?", "Yes. A booking system can show real-time availability, block unavailable resources, and prevent conflicting bookings when configured around the business rules."],
  ["Can the system handle multiple employees or branches?", "Yes. Staff, rooms, vehicles, equipment, and branches can be modeled when the selected tools support the required scheduling and reporting structure."],
  ["Can we collect deposits?", "Yes, when an approved payment provider is available. Deposit rules, transaction fees, refunds, and settlement timing depend on that provider."],
  ["What can the AI assistant do?", "It can answer approved questions, explain services, check connected availability, capture inquiries, and transfer the conversation to staff when needed."],
  ["Will AI replace our staff?", "No. Northstar Assist handles approved, repeatable questions and escalates to people when judgment or direct support is needed."],
  ["Do you guarantee BIR compliance?", "No. We provide BIR-ready POS setup assistance through suitable accredited providers. Final requirements and tax guidance should be confirmed with the provider and the client’s accountant or CPA."],
  ["Are POS hardware and subscriptions included?", "Not automatically. Hardware, subscriptions, payment fees, and third-party costs are shown separately in the solution plan."],
  ["How long does a project take?", "Timing depends on scope, content readiness, integrations, and third-party approvals. Your solution plan will show the expected timeline before work begins."],
  ["Do you provide ongoing support?", "Yes. Optional ongoing support can cover information updates, integration monitoring, troubleshooting, and planned improvements after launch."],
  ["Can we start with a website and add systems later?", "Yes. The system can be phased so the website establishes a strong foundation and booking, commerce, AI assistance, or automation can follow when the business is ready."],
  ["Who owns the website after completion?", "Ownership, licensed components, hosting, and third-party accounts are defined clearly in the project agreement. Client-owned accounts are preferred wherever practical."],
];

export const commerceDisclaimer = "BIR accreditation, Permit-to-Use requirements, subscriptions, hardware, and final tax configuration depend on the selected provider and the client’s registration. Tax advice should be confirmed by the client’s accountant or CPA.";
