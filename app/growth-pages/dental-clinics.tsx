import { Disclosure, GrowthPageShell, GrowthSection, InlineLink, OrderedProcess, TextLinks, Topic, TopicGrid, type Faq } from "./shared";

const faqs: Faq[] = [
  { question: "Can Northstar build a website for a dental clinic anywhere in the Philippines?", answer: "Northstar can support suitable clinics remotely across Luzon, Visayas, and Mindanao. The clinic must provide accurate local information, approved service content, practitioner details, contact channels, policies, and media." },
  { question: "Can patients book an appointment directly on the website?", answer: "Potentially. The correct flow may be an appointment request reviewed by staff or a connection to an appropriate booking provider. A request must not be presented as confirmed until the clinic or supported provider confirms it." },
  { question: "Can the website show dentist availability?", answer: "Only when the clinic has an accurate supported scheduling source and the provider connection has been validated. Otherwise, the website should collect preferred dates or direct the visitor to staff." },
  { question: "Can Northstar add online patient forms?", answer: "Forms can be scoped, but the clinic must first determine what information is appropriate to collect, how consent is handled, where data is stored, who can access it, and what privacy and retention requirements apply. Sensitive health information requires separate review." },
  { question: "Can an AI assistant answer dental questions?", answer: "It can be limited to clinic-approved administrative information such as hours, location, services, and appointment instructions. It should not diagnose, recommend treatment, handle emergencies, or replace a dentist or trained clinic staff." },
  { question: "Will the website rank first on Google or bring more patients?", answer: "Northstar does not guarantee rankings or patient volume. A technically sound, useful website can support discovery and conversion, but visibility and inquiries depend on competition, reputation, local signals, content, operations, and continued marketing work." },
  { question: "What content does the clinic need to provide?", answer: "The clinic should provide or approve its real services, dentist and staff information, location, hours, contact details, policies, photos, brand assets, appointment process, privacy requirements, and any professional claims intended for publication." },
];

export function DentalClinicsPage({ nonce }: { nonce?: string }) {
  return <GrowthPageShell
    path="/industries/dental-clinics"
    kind="industry"
    eyebrow="DENTAL CLINIC WEBSITE DESIGN"
    title="Dental clinic websites built for clear patient journeys."
    description="Northstar designs dental clinic websites and appointment journeys that explain services clearly and support practical patient inquiries across the Philippines."
    intro={<><p>Northstar Systems designs dental clinic websites for Philippine practices that need to explain their services, establish a credible online presence, and give prospective patients a clear way to contact the clinic or request an appointment.</p><p>The website is planned around the administrative journey—not around medical promises. It can present clinic-approved information, guide visitors to the right contact path, and connect to an appropriate appointment provider when the provider and workflow support it.</p></>}
    breadcrumbs={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: "Dental Clinics", href: "/industries/dental-clinics" }]}
    faqs={faqs}
    nonce={nonce}
    secondaryCta={{ label: "View the dental clinic concept", href: "/projects" }}
    finalTitle="Review your clinic’s current inquiry and appointment journey."
    finalCopy="Show Northstar how prospective patients currently find the clinic, ask about services, request schedules, and receive confirmation. We will recommend the clearest first improvement without adding tools the clinic does not need."
    finalSecondary={{ label: "Explore website and booking services", href: "/services/websites" }}
  >
    <GrowthSection title="Help prospective patients understand the clinic before they contact you.">
      <p>A prospective patient may need to know whether the clinic offers a particular service, where it is located, when it is open, which contact channel is monitored, and what happens after an appointment request.</p>
      <p>When those details are scattered across social posts, map listings, and message threads, patients repeat basic questions and staff spend more time answering them individually.</p>
      <p>A focused dental clinic website gives approved information a permanent home and creates a clearer handoff to clinic staff. It should help a visitor:</p>
      <ul><li>Understand the services the clinic chooses to publish</li><li>Review verified dentist and clinic information</li><li>Find the correct location, landmarks, hours, and contact details</li><li>Learn what information is needed to request an appointment</li><li>Know whether a request is pending or confirmed</li><li>Reach a person for urgent, sensitive, or unusual concerns</li></ul>
      <p>The clinic remains responsible for the accuracy of medical, professional, pricing, scheduling, and policy information.</p>
    </GrowthSection>

    <GrowthSection title="What a useful dental clinic website should include." className="growth-tinted">
      <TopicGrid>
        <Topic title="Services explained in plain language">
          <p>Organize services so visitors can understand the clinic’s scope without navigating a long undifferentiated list.</p>
          <p>Depending on the clinic’s real services and approved terminology, pages may cover:</p><ul><li>Consultations and check-ups</li><li>Preventive care and cleaning</li><li>Restorative services</li><li>Orthodontic services</li><li>Tooth replacement options</li><li>Cosmetic services</li><li>Pediatric or family dental care</li><li>Other services performed by appropriately qualified practitioners</li></ul>
          <p>Service copy should explain the administrative next step and general purpose without diagnosing the visitor, promising an outcome, or replacing consultation with a dentist.</p>
        </Topic>
        <Topic title="Verified clinic and dentist information">
          <p>Trust starts with facts the clinic can substantiate. Useful content may include:</p><ul><li>Actual clinic name</li><li>Accurate address and map pin</li><li>Published opening hours</li><li>Monitored contact channels</li><li>Dentist names, credentials, and professional information supplied and approved by the clinic</li><li>Real clinic photography</li><li>Accepted appointment process</li><li>Approved payment or insurance information, if applicable</li></ul>
          <p>Do not invent qualifications, affiliations, specializations, years of experience, awards, patient counts, or success rates.</p>
        </Topic>
        <Topic title="Location, hours, and contact options">
          <p>Mobile visitors should be able to find the clinic, call or message the monitored channel, and understand the next step without searching through the entire page.</p>
          <p>Recommended elements include:</p><ul><li>Click-to-call link when the clinic has an approved public number</li><li>Messenger, WhatsApp, email, or other monitored contact link</li><li>Accurate address, barangay, city or municipality, province, and nearby landmarks</li><li>Embedded or linked map using the correct pin</li><li>Current opening hours and holiday-update process</li><li>Clear appointment-request button</li></ul>
        </Topic>
        <Topic title="Trust-building content without unsupported claims">
          <p>A clinic website can build confidence through clarity rather than exaggerated promises.</p>
          <p>Appropriate trust signals may include:</p><ul><li>Real photos of the clinic and team</li><li>Verified practitioner information</li><li>Transparent appointment and contact expectations</li><li>Clinic-approved service explanations</li><li>Genuine reviews or testimonials used with permission</li><li>Published policies the clinic can keep current</li><li>An accessible, mobile-friendly layout</li></ul>
          <p>Avoid “painless,” “guaranteed,” “best dentist,” guaranteed treatment-result, or universally safe claims unless the wording is supported and approved by appropriately qualified parties.</p>
        </Topic>
      </TopicGrid>
    </GrowthSection>

    <GrowthSection title="Make appointment requests easier for patients and staff.">
      <TopicGrid>
        <Topic title="Inquiry or appointment-request form"><p>A simple request form can collect the minimum administrative details needed for staff to respond, such as name, contact channel, preferred date, general service interest, and a non-sensitive note.</p><p>The form should state clearly that submission does not confirm an appointment. Clinic staff must review availability and respond through the approved channel.</p></Topic>
        <Topic title="Connected booking-provider workflow"><p>If the clinic uses an appropriate booking provider, Northstar can assess whether the website can connect to or embed that provider’s supported experience.</p><p>The scope may include practitioner or resource selection, service selection, available appointment times, and customer contact details when supported by the provider. Provider subscriptions, permissions, data handling, and technical capabilities remain separate conditions.</p></Topic>
        <Topic title="Confirmations and reminders when supported"><p>Confirmation and reminder messages may reduce administrative follow-up, but they should only be promised when the chosen provider, message channel, consent process, and project scope support them.</p><p>The clinic must decide what information can appear safely in messages and who is responsible for handling replies, cancellations, changes, and urgent concerns.</p></Topic>
      </TopicGrid>
      <TextLinks><InlineLink href="/services/booking">Explore online booking systems</InlineLink><InlineLink href="/packages">See booking website packages</InlineLink></TextLinks>
    </GrowthSection>

    <GrowthSection title="Use intake, automation, and AI with clear boundaries." className="growth-dark">
      <p>Administrative tools should reduce repetitive handoffs without making medical decisions or presenting automated text as professional advice.</p>
      <p>Potentially appropriate uses include:</p>
      <ul><li>Routing website inquiries to the correct staff channel</li><li>Sharing clinic-approved hours, location, services, and appointment instructions</li><li>Sending administrative reminders when supported</li><li>Collecting limited pre-appointment information under an approved process</li><li>Escalating sensitive or uncertain questions to a person</li></ul>
      <p>Northstar should not present an AI assistant as a dentist, diagnostic tool, emergency service, or substitute for professional consultation. It should not recommend treatment, interpret symptoms, promise results, or handle sensitive health information without a separately validated data, privacy, security, and compliance scope.</p>
      <p>The clinic is responsible for obtaining appropriate professional and legal guidance for patient information, consent, record retention, privacy notices, and health-related communications.</p>
    </GrowthSection>

    <GrowthSection title="Website design for dental clinics across the Philippines.">
      <p>Northstar can support suitable dental practices remotely across Luzon, Visayas, and Mindanao. Each site should use the clinic’s real local information rather than generic city-name copy.</p>
      <p>Local relevance can include the actual barangay, municipality or city, province, nearby landmarks, directions, service area, public contact information, and questions patients genuinely ask in that location.</p>
      <p>A location page is appropriate only when the clinic has a real eligible location and can provide unique useful information. Northstar does not create fake clinic listings, duplicate location pages, or misleading service areas.</p>
    </GrowthSection>

    <GrowthSection title="Relevant Northstar clinic concept work." className="growth-tinted">
      <p>The Northstar project collection includes the <strong>DR. B. Dental Clinic</strong> website concept, created to demonstrate clinic service architecture, responsive design, local-discovery UX, and a clear contact journey.</p>
      <Disclosure><strong>Required disclosure: Live concept</strong><p>Keep this work labeled <strong>Live concept</strong> unless its project status changes and is approved for publication. It does not, by itself, prove a paid engagement, clinic endorsement, patient growth, appointment increase, production adoption, or treatment outcome.</p></Disclosure>
      <TextLinks><InlineLink href="/projects">View the dental clinic website concept</InlineLink></TextLinks>
    </GrowthSection>

    <GrowthSection title="A practical dental website process.">
      <OrderedProcess items={[
        { title: "Review the clinic’s current patient journey", copy: <p>Northstar reviews how patients discover the clinic, ask about services, request schedules, find the location, and receive confirmation. The clinic identifies the staff members and providers involved.</p> },
        { title: "Confirm publishable facts and boundaries", copy: <p>The clinic supplies and approves service information, practitioner details, location, hours, policies, contact channels, privacy requirements, and claims that can be published.</p> },
        { title: "Plan the website and appointment path", copy: <p>Northstar organizes the pages, calls to action, inquiry fields, provider handoff, and human escalation points around the approved workflow.</p> },
        { title: "Design and build", copy: <p>The site is developed for responsive use with accessible structure, readable content, and clear actions. Only approved integrations and information are included.</p> },
        { title: "Test, train, and hand over", copy: <p>The agreed contact or booking journey is tested. The clinic receives the access, guidance, and handover included in the project scope and identifies who will keep hours, services, provider schedules, and policies current.</p> },
      ]} />
    </GrowthSection>

    <GrowthSection title="Related dental website services.">
      <Disclosure><p>Explore <InlineLink href="/services/websites">professional dental clinic websites</InlineLink>, <InlineLink href="/services/booking">appointment booking systems</InlineLink>, <InlineLink href="/services/ai-automation">controlled website assistance</InlineLink>, <InlineLink href="/services/automation-integrations">reminders and administrative automation</InlineLink>, and <InlineLink href="/services/support-maintenance">website support and maintenance</InlineLink>. Review <InlineLink href="/industries">Northstar industry solutions</InlineLink>, <InlineLink href="/how-it-works">the Northstar project process</InlineLink>, and <InlineLink href="/packages">website and booking packages</InlineLink>.</p></Disclosure>
    </GrowthSection>
  </GrowthPageShell>;
}
