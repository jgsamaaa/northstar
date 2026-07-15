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
    slug: "websites", code: "01", name: "Northstar Web", label: "WEBSITES",
    headline: "Professional websites built to convert.",
    description: "A fast, credible website that explains what you do and gives every visitor a clear next step.",
    features: ["Custom responsive design", "Service and product pages", "Inquiry forms", "Analytics and SEO foundations", "Messenger, maps, and call integration", "Fast, accessible performance"], accent: "#78aef3",
  },
  {
    slug: "booking", code: "02", name: "Northstar Booking", label: "ONLINE BOOKING",
    headline: "Let customers book without waiting for a reply.",
    description: "Real-time availability, deposits, reminders, and scheduling rules shaped around your team and resources.",
    features: ["Service selection", "Staff and resource scheduling", "Deposits", "Confirmations and reminders", "Rescheduling rules", "Customer records"], accent: "#5ddcff",
  },
  {
    slug: "pos-inventory", code: "03", name: "Northstar POS & Inventory", label: "POS & INVENTORY",
    headline: "Connect sales, products, stock, and reporting.",
    description: "We help you select, configure, and connect an appropriate POS and inventory platform for clearer daily operations.",
    features: ["Product encoding", "Cashier accounts", "Inventory tracking", "Low-stock alerts", "Website-to-POS integration when supported", "Sales reports", "Staff training", "BIR-ready POS setup assistance using an appropriate accredited provider"], accent: "#8aa9ff",
  },
  {
    slug: "ai-automation", code: "04", name: "Northstar Assist", label: "AI CUSTOMER ASSISTANCE",
    headline: "AI customer assistance with real human support.",
    description: "Answer approved questions quickly, capture useful details, and hand the conversation to your team when judgment is needed.",
    features: ["English, Tagalog, and Bisaya", "Approved FAQ responses", "Service recommendations", "Availability guidance", "Lead capture", "Human escalation"], accent: "#72e7c3",
  },
  {
    slug: "automation-integrations", code: "05", name: "Northstar Automation", label: "AUTOMATION",
    headline: "Reduce repetitive tasks and manual follow-up.",
    description: "Connect the practical handoffs, alerts, and records that slow teams down when they are handled manually.",
    features: ["Lead routing", "Booking notifications", "Customer follow-ups", "Record synchronization", "Staff alerts", "Human approval points"], accent: "#7f9ac6",
  },
  {
    slug: "support-maintenance", code: "06", name: "Northstar Support", label: "ONGOING SUPPORT",
    headline: "Ongoing technical help after launch.",
    description: "Keep the system current and useful with monitoring, issue resolution, guidance, and planned improvements.",
    features: ["Content updates", "Integration monitoring", "Issue resolution", "Performance checks", "Staff guidance", "Vendor coordination"], accent: "#a6b4c7",
  },
];

export const industries = [
  { name: "Clinics & dental practices", short: "Clinics", note: "Make patient scheduling and follow-up easier for staff.", features: ["Patient scheduling", "Staff calendars", "Intake forms", "Reminders", "Customer database", "AI FAQ assistant"] },
  { name: "Salons & spas", short: "Salons", note: "Turn discovery into a booked and repeat visit.", features: ["Employee scheduling", "Service booking", "Deposits", "Product sales", "Memberships", "Repeat-customer reminders"] },
  { name: "Resorts & event venues", short: "Hospitality", note: "Show availability, packages, and guest details in one flow.", features: ["Room or venue availability", "Request-to-book", "Packages and add-ons", "Deposits", "Guest communication", "POS connection"] },
  { name: "Restaurants & cafes", short: "Food", note: "Connect your menu, inquiries, reservations, and operations.", features: ["Website menu", "Reservations", "Online order requests", "POS setup", "Inventory", "Customer assistance"] },
  { name: "Retail businesses", short: "Retail", note: "Keep products, branches, and customer questions visible.", features: ["Product catalog", "Website orders", "POS setup", "Inventory", "Branch reporting", "Customer inquiries"] },
  { name: "Rentals & service companies", short: "Rentals", note: "Make scarce resources easier to schedule and manage.", features: ["Vehicle, room, equipment, or team availability", "Deposits", "Agreements", "Automated reminders", "Customer records"] },
];

export const process = [
  ["01", "Discover", "We map the way customers, staff, bookings, sales, and support work today."],
  ["02", "Plan", "You receive a clear scope, timeline, recommended tools, and third-party costs."],
  ["03", "Build", "We design, configure, connect, and test the approved system."],
  ["04", "Launch", "We train your team, confirm the workflow, and launch with documentation."],
  ["05", "Support", "We stay available to maintain, troubleshoot, and improve the system."],
];

export const packages = [
  { name: "Website Launch", price: "₱25k", tag: "ESTABLISH", description: "For businesses that need a professional online presence.", includes: ["Custom business website", "Service or product presentation", "Inquiry forms", "Contact integrations", "Analytics and SEO setup"], cta: "Request a proposal" },
  { name: "Booking Growth", price: "₱45k", tag: "SCHEDULE", description: "For appointment, rental, resort, clinic, salon, and service businesses.", includes: ["Professional website", "Real-time booking", "Staff or resource scheduling", "Confirmations", "Customer records", "Admin dashboard"], cta: "Book a systems audit" },
  { name: "POS & Inventory Setup", price: "₱40k", tag: "OPERATE", description: "For restaurants, retail stores, hardware, auto parts, and product businesses.", includes: ["POS provider setup", "Inventory configuration", "Product migration", "Staff accounts", "Training", "Integration planning"], cta: "Request a proposal" },
  { name: "Complete Business System", price: "₱75k", tag: "CONNECT", description: "For businesses that need bookings, sales, inventory, AI assistance, and automation.", includes: ["Website", "Booking", "POS and inventory", "AI assistant", "Automation", "Training and support options"], cta: "Build my system" },
];

export const commerceDisclaimer = "BIR-ready POS setup assistance uses an appropriate accredited provider. Accreditation, Permit-to-Use requirements, subscriptions, hardware, final tax configuration, and website-to-POS integration depend on the selected provider and supported integrations. Confirm tax requirements with your accountant or CPA.";
