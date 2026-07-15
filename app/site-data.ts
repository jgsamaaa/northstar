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
  { name: "Clinics and Dental Practices", short: "Clinics", problem: "Staff spend too much time answering schedule questions, confirming appointments, sending reminders, and collecting patient information manually.", outcome: "Reduce scheduling calls, prevent appointment conflicts, and give patients a simpler way to book and prepare for their visit.", system: "Website + patient booking + intake workflow + controlled FAQ assistance", features: ["Online appointment booking", "Practitioner availability", "Digital intake forms", "Automated appointment reminders", "Customer and appointment history", "AI FAQ assistant", "Human handoff for sensitive questions"], demo: ["Service: Dental cleaning", "Practitioner: Dr. Santos", "Date: Saturday, 22 June", "Time: 10:30 AM", "Intake form complete", "Booking confirmed"], cta: "Build a Clinic Booking System" },
  { name: "Salons and Spas", short: "Salons", problem: "Customers often wait for replies while staff manually check employee schedules and service availability.", outcome: "Help customers book the right service and employee while reducing manual scheduling and missed appointments.", system: "Website + service booking + staff calendar + repeat-customer follow-up", features: ["Employee scheduling", "Service selection", "Deposits", "Packages", "Memberships", "Product sales", "Repeat-customer reminders"], demo: ["Service: Hair color", "Stylist: Mika", "Date: Friday, 21 June", "Time: 1:00 PM", "Add-on: Treatment", "Deposit: ₱500"], cta: "Build a Salon Booking System" },
  { name: "Resorts and Event Venues", short: "Hospitality", problem: "Staff manually answer availability questions, compare packages, confirm deposits, and coordinate guest requests through chat.", outcome: "Turn availability inquiries into organized booking requests, deposits, guest information, and confirmed reservations.", system: "Website + availability requests + package selection + guest workflow", features: ["Room or venue availability", "Request-to-book", "Packages and add-ons", "Deposit tracking", "Guest communication", "Event or stay requirements", "POS connection where supported"], demo: ["Dates: 12–14 July", "Venue: Garden Pavilion", "Guests: 80", "Package: Celebration", "Add-on: Sound system", "Deposit: Received"], cta: "Build a Resort or Venue System" },
  { name: "Restaurants and Cafés", short: "Food", problem: "Menus, reservations, website orders, inventory, and in-store sales often operate separately.", outcome: "Connect menus, reservations, online requests, sales, and inventory into a clearer daily workflow.", system: "Digital menu + website order flow + POS & inventory setup", features: ["Digital menu", "Reservations", "Online order requests", "POS setup", "Inventory tracking", "Customer inquiries", "Sales reporting"], demo: ["Website order #1048", "2 × House Blend", "Sale recorded: ₱1,500", "Stock: 5 → 3", "Low-stock alert created", "Dashboard updated"], cta: "Connect My Restaurant Systems" },
  { name: "Retail Businesses", short: "Retail", problem: "Business owners struggle to keep website products, in-store sales, inventory, and branch reports consistent.", outcome: "Keep website products, cashier sales, stock levels, and branch reporting consistent.", system: "Product catalog + website orders + POS & inventory + branch reporting", features: ["Product catalog", "Website orders", "POS setup", "Inventory management", "Low-stock alerts", "Cashier accounts", "Branch reporting"], demo: ["Product: Premium Work Bag", "POS sale: ₱2,850", "Stock: 4 → 3", "Reorder level: 3", "Low-stock alert active", "Dashboard updated"], cta: "Build a Retail System" },
  { name: "Rentals and Service Companies", short: "Rentals", problem: "Customers cannot easily see whether a vehicle, room, machine, equipment item, or service team is available.", outcome: "Show customers when vehicles, rooms, equipment, or service teams are available and reduce manual availability checks.", system: "Resource calendar + request-to-book + deposits + approval workflow", features: ["Resource availability", "Date and time selection", "Deposits", "Agreements or waivers", "Automated reminders", "Customer records", "Booking approval"], demo: ["Resource: Delivery van", "Available: 24–26 June", "Duration: 3 days", "Deposit: ₱2,000", "Agreement: Accepted", "Request: Awaiting approval"], cta: "Build a Rental Booking System" },
];

export const process = [
  ["01", "Discover", "We map the way customers, staff, bookings, sales, and support work today."],
  ["02", "Plan", "You receive a clear scope, timeline, recommended tools, and third-party costs."],
  ["03", "Build", "We design, configure, connect, and test the approved system."],
  ["04", "Launch", "We train your team, confirm the workflow, and launch with documentation."],
  ["05", "Support", "We stay available to maintain, troubleshoot, and improve the system."],
];

export const packages = [
  { name: "Website Launch", tag: "ESTABLISH", description: "For businesses that need a professional and trustworthy online presence.", solves: "Clarifies your offer, builds credibility, and turns visitors into useful inquiries.", includes: ["Custom business website", "Mobile-first design", "Service or product presentation", "Inquiry forms", "Contact integrations", "Google Maps", "Analytics", "Search-engine foundations"], scope: "Page count, content readiness, product volume, custom features, and integrations.", cta: "Request a Website Proposal" },
  { name: "Booking Growth System", tag: "SCHEDULE", description: "For clinics, salons, resorts, rentals, venues, and appointment-based businesses.", solves: "Reduces manual availability checks, confirmations, rescheduling, and customer follow-up.", includes: ["Professional website", "Real-time booking calendar", "Staff or resource scheduling", "Confirmations", "Rescheduling and cancellation", "Customer database", "Admin dashboard", "Optional deposits and reminders"], scope: "Staff, locations, resources, booking rules, payment provider, and reminder volume.", cta: "Book a Systems Audit" },
  { name: "POS & Inventory System", tag: "OPERATE", description: "For restaurants, cafés, stores, hardware, auto parts, pharmacies, and product-based businesses.", solves: "Connects products, in-store sales, stock levels, cashier activity, and practical reporting.", includes: ["Website or product catalog", "POS provider selection and setup", "Inventory configuration", "Product migration", "Staff accounts", "Reporting", "Training", "Integration planning"], scope: "Product count, branches, hardware, accredited provider, migration, and supported integrations.", cta: "Request a POS Consultation" },
  { name: "Complete Business System", tag: "CONNECT", description: "For businesses that need website, booking, sales, inventory, AI, and automation working together.", solves: "Replaces fragmented customer and staff handoffs with one documented operating workflow.", includes: ["Website", "Booking", "POS and inventory", "Customer database", "AI assistance", "Automated follow-up", "Staff training", "Ongoing support options"], scope: "Locations, departments, users, integrations, automation complexity, and support needs.", cta: "Build My System" },
];

export const commerceDisclaimer = "BIR-ready POS setup assistance uses an appropriate accredited provider. Accreditation, Permit-to-Use requirements, subscriptions, hardware, final tax configuration, and website-to-POS integration depend on the selected provider and supported integrations. Confirm tax requirements with your accountant or CPA.";
