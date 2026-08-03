import { Disclosure, GrowthPageShell, GrowthSection, InlineLink, OrderedProcess, TextLinks, Topic, TopicGrid, type Faq } from "./shared";

const faqs: Faq[] = [
  { question: "Can Northstar build a website for a resort anywhere in the Philippines?", answer: "Northstar can support suitable properties remotely across Luzon, Visayas, and Mindanao. The property must provide accurate rooms, rates or inquiry rules, policies, location details, photos, and operational decisions required for the site." },
  { question: "Can the website show live room availability?", answer: "Only when an authoritative supported inventory source can be connected and tested. Otherwise, Northstar recommends an honest request-to-book or availability-inquiry flow." },
  { question: "Can guests pay a deposit through the website?", answer: "Potentially. Payment or deposit processing depends on the selected provider, account approval, transaction terms, technical support, and project scope. Provider and transaction fees are paid by the client." },
  { question: "Can Northstar connect the site to our existing booking platform?", answer: "It depends on the platform’s supported connection methods, documentation, permissions, and the required experience. Northstar validates the connection before including it in the approved scope." },
  { question: "How much does a resort website cost?", answer: "Northstar’s current hotel and resort reservation websites start at ₱72,000 for the stated base scope. Final pricing depends on rooms or packages, content, availability workflow, provider integration, payments, additional pages, data entry, and other requirements. Current details belong on the Packages page." },
  { question: "Will a new website increase direct bookings?", answer: "A clearer website can improve the path to inquiry or reservation, but Northstar does not guarantee booking volume. Demand, pricing, reputation, availability, operations, marketing, and other factors also influence results." },
  { question: "Can Northstar write our room descriptions or arrange photography?", answer: "Professional copywriting, branding, photography, and extensive content organization require a separately approved scope. The property remains responsible for factual accuracy and permission to use supplied media." },
];

export function ResortsHotelsPage({ nonce }: { nonce?: string }) {
  return <GrowthPageShell
    path="/industries/resorts-hotels"
    kind="industry"
    eyebrow="HOSPITALITY WEBSITE DESIGN"
    title="Resort and hotel websites built around the guest journey."
    description="Northstar designs resort and hotel websites with clear room, package, inquiry, and reservation journeys for properties across the Philippines."
    intro={<><p>Northstar Systems provides resort website design for Philippine properties that need a clearer path from discovery to inquiry or reservation. We organize rooms, packages, amenities, dining, events, location details, policies, and booking actions around what a prospective guest needs to decide.</p><p>The reservation flow is scoped honestly. A website can collect an inquiry, connect to an appropriate booking provider, or show live availability only when a reliable supported inventory source is connected and tested.</p></>}
    breadcrumbs={[{ name: "Home", href: "/" }, { name: "Industries", href: "/industries" }, { name: "Resorts and Hotels", href: "/industries/resorts-hotels" }]}
    faqs={faqs}
    nonce={nonce}
    secondaryCta={{ label: "View hospitality concepts", href: "/projects" }}
    finalTitle="Review your current guest booking journey."
    finalCopy="Show Northstar how guests currently discover rooms, ask about dates, compare packages, pay deposits, and receive confirmation. We will identify the clearest place to improve the website or reservation handoff."
    finalSecondary={{ label: "Compare booking website packages", href: "/packages" }}
  >
    <GrowthSection title="Help guests understand the stay before they send a message.">
      <p>Many property inquiries begin with the same questions: Which room fits our group? What is included? Is the property accessible from our route? Can we bring children or pets? Is a deposit required? Can we book an event, day visit, or meal separately?</p>
      <p>A useful resort or hotel website answers the questions that should not require a long message thread, then gives the guest an accurate next step for the questions that still need staff attention.</p>
      <p>Northstar designs the website around both sides of that handoff:</p>
      <ul><li>What the guest needs to compare and decide</li><li>What the property needs to collect and confirm</li><li>Which information changes frequently</li><li>Which requests require staff approval</li><li>Which booking or payment provider is available</li><li>What the website can state accurately today</li></ul>
    </GrowthSection>

    <GrowthSection title="What a resort or hotel website should make clear." className="growth-tinted">
      <TopicGrid>
        <Topic title="Rooms, packages, and inclusions">
          <p>Each room, villa, cabin, venue, or package should explain the practical decision points without forcing visitors to study a social-media feed or request a basic price list.</p>
          <p>Recommended content may include:</p><ul><li>Room or accommodation name</li><li>Capacity and sleeping arrangement</li><li>Important amenities</li><li>Published inclusions and exclusions</li><li>Approved rates or a clear inquiry path</li><li>Check-in and check-out information</li><li>Image gallery with accurate captions</li><li>Add-ons or package options</li><li>Availability or request status explained in plain language</li></ul>
          <p>Rates, packages, and policies should be easy for the property team to review and keep current.</p>
        </Topic>
        <Topic title="Property experience and location">
          <p>Hospitality decisions are not based on rooms alone. The site should help guests understand the setting, travel context, food, activities, gatherings, and type of stay the property offers.</p>
          <p>Useful sections can include:</p><ul><li>Property story and atmosphere</li><li>Accurate location and travel guidance</li><li>Nearby landmarks or routes</li><li>Dining and guest services</li><li>Activities and experiences</li><li>Accessibility information supplied by the property</li><li>Event or venue options</li><li>Day-use information</li><li>Contact and arrival instructions</li></ul>
        </Topic>
        <Topic title="Policies, questions, and contact options">
          <p>Place important policies where guests can find them before they inquire. This may include deposit rules, cancellation terms, check-in requirements, child or pet policies, outside-food rules, event conditions, and other property-approved information.</p>
          <p>The website should also identify the monitored contact channels and expected next step. Do not present an inquiry as a confirmed reservation.</p>
        </Topic>
        <Topic title="Events, dining, day visits, and add-ons">
          <p>Properties with more than overnight stays may need separate paths for weddings, meetings, celebrations, restaurant reservations, day use, tours, transport, or other approved experiences.</p>
          <p>These paths should collect the details staff needs rather than sending every visitor to one unstructured message thread.</p>
        </Topic>
      </TopicGrid>
    </GrowthSection>

    <GrowthSection title="Choose the right reservation model.">
      <TopicGrid>
        <Topic title="Direct inquiry or request-to-book"><p>A request-to-book flow collects dates, party details, room or package interest, and contact information for staff review. It is appropriate when availability must be confirmed manually or when the property does not have a supported live inventory source.</p><p>The website must say clearly that the request is pending until the property confirms it.</p></Topic>
        <Topic title="Connected booking-provider flow"><p>If the property already uses an appropriate booking provider, Northstar can assess whether the website can connect guests to that provider or embed an approved booking experience.</p><p>The provider’s subscription, capabilities, terms, payment support, channel connections, and technical access remain separate considerations.</p></Topic>
        <Topic title="Live availability only with a supported source"><p>Northstar does not simulate live room availability. Live status is shown only when an authoritative inventory source can be connected reliably and the agreed flow has been tested.</p><p>If a source cannot be connected, the site should use accurate language such as <strong>Check availability</strong>, <strong>Request your dates</strong>, or <strong>Ask about this room</strong> rather than <strong>Book now</strong> or <strong>Available now</strong>.</p></Topic>
      </TopicGrid>
    </GrowthSection>

    <GrowthSection title="Connect the guest journey without hiding operational limits." className="growth-dark">
      <p>A hospitality website can connect multiple steps when the selected providers support them:</p>
      <ul className="growth-check-grid"><li>Room or package discovery</li><li>Date and guest-detail collection</li><li>Booking-provider handoff</li><li>Deposit or payment request</li><li>Confirmation and reminder messages</li><li>Special request collection</li><li>Staff notification</li><li>Dining, event, or day-use inquiries</li><li>POS connection where technically supported</li></ul>
      <p>Each connection is scoped separately. Payment processing, messaging, booking-provider subscriptions, transaction charges, hardware, and other client-owned costs are identified before approval.</p>
      <p>The site should also maintain a human contact option for requests that do not fit the standard flow.</p>
      <TextLinks><InlineLink href="/services/booking">Explore online booking systems</InlineLink><InlineLink href="/packages">Compare booking website packages</InlineLink></TextLinks>
    </GrowthSection>

    <GrowthSection title="Hospitality website design for properties across the Philippines.">
      <p>Northstar can work remotely with suitable properties across Luzon, Visayas, and Mindanao. A nationwide service statement does not replace local accuracy: every page should use the property’s real location, approved travel details, policies, photos, rooms, packages, and contact information.</p>
      <p>The design and content should reflect the property rather than use generic destination language. A beach resort in Leyte, a mountain retreat in Davao, and an event venue in Luzon require different guest questions and booking paths.</p>
      <p>Northstar organizes remote discovery, content collection, review, testing, training, and handover around the approved project schedule.</p>
    </GrowthSection>

    <GrowthSection title="Relevant Northstar hospitality concepts." className="growth-tinted">
      <p>Northstar’s project collection includes hospitality website concepts demonstrating different approaches to rooms, destination context, inquiry actions, and reservation journeys.</p>
      <p>Relevant examples may include Hidden Gardens Resort, Aloha Beach Resort, Amihan Ridge, Woodvelly, The Aureline, and Lilee’s Farm Resort.</p>
      <Disclosure><strong>Required disclosure: Live concept</strong><p>These entries must remain labeled according to their actual stage, such as <strong>Live concept</strong>. They demonstrate design and workflow thinking but do not, by themselves, prove a paid engagement, production adoption, booking increase, or client endorsement.</p></Disclosure>
      <TextLinks><InlineLink href="/projects">View hospitality website concepts</InlineLink></TextLinks>
    </GrowthSection>

    <GrowthSection title="A clear resort website process.">
      <OrderedProcess items={[
        { title: "Review the property and current booking workflow", copy: <p>Northstar reviews the rooms or venues, packages, guest questions, staff confirmation process, current providers, payment steps, and information the property can publish.</p> },
        { title: "Define the guest journey", copy: <p>The approved structure identifies what guests can browse, what they can request, what the system can confirm, and where staff review is required.</p> },
        { title: "Organize content and design", copy: <p>Rooms, packages, amenities, location context, policies, galleries, and actions are arranged around guest decisions. The property supplies or approves the facts and media used.</p> },
        { title: "Connect the approved reservation path", copy: <p>Northstar implements the agreed inquiry or provider connection. Live availability, confirmations, reminders, deposits, and payment functions are included only when supported and approved.</p> },
        { title: "Test, train, and hand over", copy: <p>The agreed guest and staff flows are tested. The property team receives the access, guidance, and handover included in the scope.</p> },
      ]} />
    </GrowthSection>

    <GrowthSection title="Related hospitality services.">
      <Disclosure><p>Explore <InlineLink href="/services/websites">professional resort website design</InlineLink>, <InlineLink href="/services/booking">online booking and reservation systems</InlineLink>, <InlineLink href="/services/pos-inventory">POS and inventory implementation</InlineLink>, and <InlineLink href="/services/automation-integrations">guest notifications and workflow automation</InlineLink>. Review <InlineLink href="/industries">Northstar industry solutions</InlineLink>, <InlineLink href="/how-it-works">the Northstar project process</InlineLink>, and <InlineLink href="/packages">hotel and resort website starting prices</InlineLink>.</p></Disclosure>
    </GrowthSection>
  </GrowthPageShell>;
}
