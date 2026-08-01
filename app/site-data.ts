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

export type Project = {
  slug: string;
  name: string;
  category: string;
  status: string;
  year: string;
  summary: string;
  outcome: string;
  services: string[];
  accent: string;
  href: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "top-asia",
    name: "TOP ASIA",
    category: "Editorial culture website concept",
    status: "Live concept",
    year: "2026",
    summary: "An independent creative-studio concept documenting the new pulse of Asian cinema, fashion, music, and culture.",
    outcome: "A cinematic, magazine-led interface with full-bleed visual storytelling, strong typographic pacing, and responsive editorial navigation.",
    services: ["Creative direction", "Editorial web design", "Responsive development", "Motion system"],
    accent: "#f04a37",
    href: "https://topasia.vercel.app/",
    image: "/project-thumbnails/top-asia.webp",
  },
  {
    slug: "woodvelly",
    name: "Woodvelly",
    category: "Wilderness hospitality website concept",
    status: "Live concept",
    year: "2026",
    summary: "A hospitality concept for thoughtfully placed cabins and wilderness stays designed around slower, more meaningful travel.",
    outcome: "A calm, image-led journey that introduces the setting, stay experience, and brand atmosphere with clear paths to explore further.",
    services: ["Brand direction", "Hospitality UX", "Responsive design", "Frontend development"],
    accent: "#8ca36c",
    href: "https://nature1-sigma.vercel.app/",
    image: "/project-thumbnails/woodvelly.webp",
  },
  {
    slug: "dr-b-dental-clinic",
    name: "DR. B. Dental Clinic",
    category: "Dental clinic website concept",
    status: "Live concept",
    year: "2026",
    summary: "A patient-focused clinic website for check-ups, cleaning, tooth restoration, orthodontic treatment, and family dental care in Tacurong City.",
    outcome: "A clear service and trust journey that helps prospective patients understand available care and find the clinic’s contact and visit information.",
    services: ["Clinic website strategy", "Service architecture", "Responsive design", "Local discovery UX"],
    accent: "#55a7a2",
    href: "https://dentistb.vercel.app/",
    image: "/project-thumbnails/dr-b-dental.webp",
  },
  {
    slug: "sight-expert-eye-care",
    name: "Sight Expert Eye Care Clinic",
    category: "Eye care clinic website concept",
    status: "Live concept",
    year: "2026",
    summary: "A polished clinic concept for Sight Expert Eye Care Clinic in Bayugan City, centered on clarity, care, and confidence at every stage of sight.",
    outcome: "A reassuring patient experience with clear service pathways, clinic context, and prominent actions for visitors seeking eye care.",
    services: ["Healthcare UX", "Content structure", "Responsive design", "Frontend development"],
    accent: "#6695c7",
    href: "https://eyesight-kappa.vercel.app/",
    image: "/project-thumbnails/sight-expert.webp",
  },
  {
    slug: "amihan-ridge",
    name: "Amihan Ridge",
    category: "Mountain retreat website concept",
    status: "Live concept",
    year: "2026",
    summary: "A premium Philippine mountain-retreat concept shaped around cool mornings, local food, forest paths, and generous highland hospitality.",
    outcome: "An atmospheric, photo-led hospitality experience that communicates the retreat’s setting and gives visitors clear ways to explore the stay.",
    services: ["Hospitality strategy", "Visual direction", "Responsive design", "Inquiry UX"],
    accent: "#8da084",
    href: "https://amihan-six.vercel.app/",
    image: "/project-thumbnails/amihan-ridge.webp",
  },
  {
    slug: "aloha-beach-resort",
    name: "Aloha Beach Resort",
    category: "Beach resort website concept",
    status: "Live concept",
    year: "2026",
    summary: "A source-grounded beachfront resort concept for Brgy. Rizal, Dulag, Leyte, built around authentic property photography and direct reservation options.",
    outcome: "A responsive stay-planning journey with room details, gallery content, visitor guidance, and an honest inquiry handoff instead of a simulated booking engine.",
    services: ["Web strategy", "Responsive design", "Content structure", "Inquiry UX"],
    accent: "#d59268",
    href: "https://aloharesort.vercel.app/",
    image: "/project-thumbnails/aloha-beach-resort.webp",
  },
];

export const services: Service[] = [
  {
    slug: "websites", code: "01", name: "Northstar Web", label: "WEBSITES",
    headline: "Professional websites built to convert.",
    description: "A fast, credible website that explains what you do and gives every visitor a clear next step.",
    features: ["Responsive static and business websites", "Service and product pages", "Direct contact links or a tested inquiry form, depending on package", "SEO foundations", "Messenger, WhatsApp, maps, and email integration", "Fast, accessible performance"], accent: "#78aef3",
  },
  {
    slug: "booking", code: "02", name: "Northstar Booking", label: "ONLINE BOOKING",
    headline: "Let customers book without waiting for a reply.",
    description: "Appointment and reservation experiences connected to an appropriate booking provider and scoped around your real availability workflow.",
    features: ["Service or room selection", "Staff and resource scheduling", "Booking-provider integration", "Confirmations and reminders when supported", "Reservation rules", "Truthful availability and inquiry states"], accent: "#5ddcff",
  },
  {
    slug: "pos-inventory", code: "03", name: "Northstar POS & Inventory", label: "POS & INVENTORY",
    headline: "Connect sales, products, stock, and reporting.",
    description: "We help you select, configure, and connect an appropriate POS and inventory platform for clearer daily operations.",
    features: ["Product encoding", "Cashier accounts", "Inventory tracking", "Low-stock alerts", "Website-to-POS integration when supported", "Sales reports", "Staff training", "BIR-ready POS setup assistance using an appropriate accredited provider"], accent: "#8aa9ff",
  },
  {
    slug: "ai-automation", code: "04", name: "Northstar Assist", label: "AI CUSTOMER ASSISTANCE",
    headline: "Optional AI assistance with real human support.",
    description: "A separately scoped website assistant that answers from approved information and hands the conversation to your team when judgment is needed.",
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
  {
    name: "Starter Static Website",
    tag: "GET ONLINE",
    price: "₱15,000",
    description: "Small businesses that need a clean, credible online presence without forms or backend systems.",
    outcome: "Launch a focused website that explains the business and sends visitors to the right direct contact channel.",
    primary: ["Small static website with agreed pages", "Responsive desktop and mobile design", "Facebook, email, or WhatsApp contact links", "Basic SEO foundations", "One revision round"],
    expanded: ["Free-tier deployment", "Client-provided copy, photos, and logo", "No contact form or lead storage", "Domain purchase and connection billed separately", "Paid providers and future updates not included"],
    cta: "Request the Starter Website",
  },
  {
    name: "Business Website",
    tag: "BUILD TRUST",
    price: "₱25,000",
    description: "Businesses that need a more complete website and a dependable way to receive inquiries.",
    outcome: "Present the business professionally and turn qualified visitors into delivered inquiries.",
    primary: ["Up to five pages", "More customized responsive design", "Working contact form", "Direct contact and map integrations", "Two revision rounds"],
    expanded: ["Form validation and basic spam protection", "Light organization of client-provided content", "Basic SEO and social-sharing setup", "Free-tier deployment", "Form delivery tested with the client inbox", "Paid form or email services quoted separately"],
    cta: "Request the Business Website",
  },
  {
    name: "Booking Website",
    tag: "SCHEDULE",
    price: "From ₱50,000",
    description: "Clinics, salons, consultants, rentals, and other appointment-led businesses.",
    outcome: "Give customers a clear path from service selection to a confirmed appointment using an appropriate booking provider.",
    primary: ["Up to seven website pages", "Booking-provider integration", "Service, staff, date, and time selection", "Customer information collection", "Testing, training, and handover"],
    expanded: ["Contact form and direct contact links", "Confirmations and reminders when supported", "Provider subscription paid by the client", "Deposits and payment processing quoted separately", "Hotel and resort reservation websites start at ₱72,000", "Live availability is promised only when a supported inventory source is connected"],
    cta: "Plan a Booking Website",
  },
  {
    name: "POS & Inventory Implementation",
    tag: "OPERATE",
    price: "From ₱50,000",
    description: "Restaurants, cafés, retailers, and product-based businesses implementing an established provider.",
    outcome: "Configure a practical sales and stock workflow without pretending a custom POS is a simple website feature.",
    primary: ["Business workflow assessment", "Appropriate POS provider setup", "Product and inventory configuration", "Staff accounts and basic reports", "Testing and staff training"],
    expanded: ["Agreed product-import allowance", "Low-stock alerts when supported", "Hardware-planning assistance", "Website integration when supported", "Subscriptions, hardware, and processing fees paid by the client", "BIR-ready assistance uses an appropriate accredited provider"],
    cta: "Request a POS Consultation",
  },
];

export const advancedSystems = [
  {
    name: "Hotel & Resort Reservation Website",
    price: "From ₱72,000",
    description: "A scoped stay or venue reservation experience covering rooms or packages, guest details, dates, policies, and an honest availability workflow.",
    features: ["Room or package presentation", "Check-in and check-out flow", "Guest and reservation details", "Deposits or payments quoted separately"],
  },
  {
    name: "Custom Inventory System",
    price: "From ₱90,000",
    description: "A secure internal system for businesses whose stock workflow cannot be handled well by an established provider.",
    features: ["Products and stock movements", "Suppliers and purchasing", "User permissions", "Reports, exports, and audit history"],
  },
  {
    name: "Custom POS System",
    price: "From ₱180,000",
    description: "A separately scoped operational product for businesses with validated requirements, support expectations, and compliance responsibilities.",
    features: ["Checkout and inventory deduction", "Returns, voids, shifts, and reconciliation", "Roles, receipts, reports, and backups", "No BIR-accreditation claim without the required approval process"],
  },
];

export const packageAddOns = [
  ["Domain connection", "Paid service; the client purchases and owns the domain"],
  ["Existing POS or inventory integration", "From ₱15,000 when the provider supports the required connection"],
  ["Additional pages", "Quoted after the page content and complexity are confirmed"],
  ["Business email setup", "Quoted separately; provider fees remain with the client"],
  ["Payments or deposits", "Quoted separately; transaction and provider fees remain with the client"],
  ["Professional copywriting or branding", "Quoted after the required scope is reviewed"],
  ["Additional revision rounds", "Quoted before the extra work begins"],
  ["Ongoing maintenance", "Available under a separate support plan"],
] as const;

export const commerceDisclaimer = "BIR-ready POS setup assistance uses an appropriate accredited provider. Accreditation, Permit-to-Use requirements, subscriptions, hardware, final tax configuration, and website-to-POS integration depend on the selected provider and supported integrations. Confirm tax requirements with your accountant or CPA.";
