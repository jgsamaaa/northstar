import { Disclosure, GrowthPageShell, GrowthSection, InlineLink, OrderedProcess, TextLinks, Topic, TopicGrid, type Faq } from "./shared";

const faqs: Faq[] = [
  { question: "How do I know if my business needs custom software?", answer: "Custom software may be appropriate when an important, repeated workflow cannot be handled effectively by an established platform and the business can define the users, records, rules, and outcomes required. Northstar reviews this during discovery before recommending a build." },
  { question: "Can Northstar improve an existing spreadsheet-based process?", answer: "Potentially. The first step is to understand what the spreadsheet currently does, who maintains it, what breaks, and whether a structured platform or custom tool is the better next step. Existing data may require separate cleaning and migration work." },
  { question: "Can custom software connect to our current systems?", answer: "It depends on the provider, documentation, available APIs or export methods, permissions, commercial terms, and required data flow. Every integration is validated and quoted separately." },
  { question: "How much does custom software development cost in the Philippines?", answer: "There is no responsible single price without a defined workflow. Users, permissions, screens, data, integrations, migration, reporting, hosting, compliance, and support all affect scope. Northstar prices custom work after discovery. Current advanced-system starting prices are published on the Packages page where applicable." },
  { question: "How long does custom software take to build?", answer: "A timeline can be estimated only after requirements, dependencies, review responsibilities, and acceptance criteria are defined. Northstar provides an agreed schedule as part of the proposal rather than promising a generic turnaround." },
  { question: "Who owns the finished system?", answer: "Ownership, source access, hosting, third-party accounts, licenses, reusable components, and handover terms must be stated in the approved agreement. Northstar does not rely on a vague ownership promise outside the project contract." },
  { question: "Does Northstar provide support after launch?", answer: "Support can be provided under an agreed plan covering defined responsibilities such as issue resolution, monitoring, provider changes, guidance, and planned improvements." },
  { question: "Can Northstar guarantee that custom software will increase revenue or reduce costs?", answer: "No. Northstar can define and test whether the system performs the approved functions. Revenue, savings, adoption, productivity, and other business outcomes depend on factors beyond the software itself and require reliable measurement." },
];

export function CustomSoftwarePage({ nonce }: { nonce?: string }) {
  return <GrowthPageShell
    path="/services/custom-software-development"
    kind="service"
    eyebrow="CUSTOM BUSINESS SOFTWARE"
    title="Custom software development for Philippine businesses."
    description="Northstar scopes and builds custom business software for validated Philippine workflows, including internal tools, dashboards, inventory, and approvals."
    intro={<><p>Northstar Systems designs and builds custom software around validated business workflows. The work may involve an internal dashboard, inventory or rental records, staff permissions, approval steps, customer information, reporting, or a combination of connected operational tools.</p><p>Custom development is not the automatic answer. Northstar first checks whether an appropriate established platform can solve the problem with less cost, risk, and maintenance. A custom system is recommended only when the business has clear requirements that standard tools cannot support well.</p></>}
    breadcrumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: "Custom Software Development", href: "/services/custom-software-development" }]}
    faqs={faqs}
    nonce={nonce}
    secondaryCta={{ label: "See solution packages", href: "/packages" }}
    finalTitle="Start with the workflow, not a list of features."
    finalCopy="Tell Northstar where the current operation feels disconnected, who is involved, and what your team is doing manually today. The Free Systems Audit will help determine whether the best next step is an established platform, an integration, a focused custom system, or further discovery."
  >
    <GrowthSection title="Build custom only when the workflow truly requires it.">
      <p>Spreadsheets and general-purpose platforms are useful until the operation starts depending on workarounds: duplicate encoding, unclear ownership, disconnected records, manual approvals, inconsistent reports, or information that only one person knows how to manage.</p>
      <p>A custom system can be appropriate when the business can explain:</p>
      <ul><li>Which people use the workflow</li><li>What each user needs to see or change</li><li>Which records must be created and maintained</li><li>What decisions or approvals happen at each stage</li><li>Which reports, exports, or histories are required</li><li>Which current tools must remain connected</li><li>What would make the first version operationally useful</li></ul>
      <p>If those answers are not clear yet, the first engagement should focus on discovery and validation—not immediate development.</p>
    </GrowthSection>

    <GrowthSection title="Business problems custom software can address." className="growth-tinted">
      <TopicGrid>
        <Topic title="Internal dashboards and operational records">
          <p>Bring the information needed for daily work into a structured interface instead of relying on scattered files and message threads.</p>
          <p>Possible scope may include:</p><ul><li>Customer or account records</li><li>Job, order, request, or service status</li><li>Assigned staff and responsibilities</li><li>Activity history</li><li>Search, filters, and exports</li><li>Role-based views</li></ul>
        </Topic>
        <Topic title="Inventory, rentals, and resource tracking">
          <p>Support a defined stock, equipment, vehicle, room, venue, or resource workflow when an established platform cannot handle the required rules.</p>
          <p>Possible scope may include:</p><ul><li>Products, assets, or resources</li><li>Stock or availability movements</li><li>Suppliers and purchasing</li><li>Reservations or allocations</li><li>Returns, maintenance, or condition records</li><li>Low-stock or due-date alerts</li><li>Audit history</li></ul>
        </Topic>
        <Topic title="Customer, staff, and approval workflows">
          <p>Create clearer handoffs between the people who request, review, approve, fulfill, and close a piece of work.</p>
          <p>Possible scope may include:</p><ul><li>Request forms</li><li>Assignment rules</li><li>Approval stages</li><li>Status changes</li><li>Notes and attachments</li><li>Notifications</li><li>Human review points</li></ul>
        </Topic>
        <Topic title="Reports, exports, and management visibility">
          <p>Give approved users a clearer view of the records already captured by the system.</p>
          <p>Reports depend on the quality and structure of the underlying data. Northstar defines required calculations, filters, dates, and export formats during scoping rather than promising a generic “real-time dashboard.”</p>
        </Topic>
        <Topic title="Integrations and controlled automation">
          <p>A custom system may connect with selected providers when reliable documentation, access, supported methods, and an approved scope are available.</p>
          <p>Potential connections can include website inquiries, booking providers, email or messaging services, payment providers, established POS platforms, and other business tools. Every connection is assessed separately. An integration is never assumed simply because two products are available online.</p>
        </Topic>
      </TopicGrid>
    </GrowthSection>

    <GrowthSection title="What Northstar defines before development begins.">
      <p>A useful custom system starts with boundaries. Before implementation, Northstar documents the agreed first version and the decisions that affect cost, complexity, and support.</p>
      <p>The scope should identify:</p>
      <ul className="growth-check-grid"><li>Business objective and users</li><li>Current workflow and points of friction</li><li>Required records and data fields</li><li>Roles and permissions</li><li>Statuses, rules, and approvals</li><li>Reports and exports</li><li>Required integrations</li><li>Migration responsibilities</li><li>Hosting and third-party providers</li><li>Testing and acceptance conditions</li><li>Training and handover</li><li>Support expectations</li><li>Items intentionally deferred to a later phase</li></ul>
      <p>This process protects the project from becoming an open-ended feature list.</p>
    </GrowthSection>

    <GrowthSection title="A practical custom software process." className="growth-dark">
      <OrderedProcess items={[
        { title: "Discovery and workflow validation", copy: <p>Northstar reviews the current process, the people involved, existing tools, recurring exceptions, and the result the system needs to support. The goal is to confirm whether custom development is justified and what the first version must accomplish.</p> },
        { title: "Requirements and system planning", copy: <p>The approved workflow is translated into screens, records, roles, rules, and acceptance criteria. Important provider costs, dependencies, assumptions, and exclusions are identified before full implementation.</p> },
        { title: "Interface and development", copy: <p>Northstar designs and develops the approved first version in reviewable stages. Decisions that affect daily use are presented before they become expensive changes.</p> },
        { title: "Testing and operational review", copy: <p>The agreed flows are tested against representative scenarios. The client reviews whether the system reflects the approved workflow and provides the data, access, and operational decisions required for testing.</p> },
        { title: "Training, handover, and launch", copy: <p>The agreed users receive the access, documentation, and training included in the scope. Launch conditions, ownership, backups, provider accounts, and outstanding limitations are recorded.</p> },
        { title: "Support and planned improvement", copy: <p>Custom systems require ongoing responsibility. Monitoring, issue resolution, provider changes, security updates, operational support, and future improvements are handled under an agreed maintenance or support arrangement.</p> },
      ]} />
    </GrowthSection>

    <GrowthSection title="Integrations, migration, security, and compliance need separate validation.">
      <p>These areas can materially change a custom software project and should never be treated as automatic inclusions.</p>
      <TopicGrid>
        <Topic title="Integrations"><p>Northstar must confirm provider documentation, authentication, data access, rate limits, commercial terms, and the exact information that needs to move between systems.</p></Topic>
        <Topic title="Data migration"><p>Existing records may need cleaning, mapping, deduplication, validation, or manual review. Migration scope depends on the source format, volume, quality, ownership, and required history.</p></Topic>
        <Topic title="Security and permissions"><p>The required user roles, access boundaries, authentication, activity history, backups, and operational controls must be defined for the specific system. No system should be described as universally secure without a validated threat, hosting, access, and maintenance scope.</p></Topic>
        <Topic title="Legal, tax, and industry requirements"><p>Northstar can implement approved technical requirements, but the client remains responsible for obtaining appropriate legal, accounting, tax, privacy, and industry advice. BIR accreditation, healthcare compliance, financial compliance, and similar obligations require the proper qualified parties and provider processes.</p></Topic>
      </TopicGrid>
    </GrowthSection>

    <GrowthSection title="Why Philippine businesses choose a focused first version." className="growth-tinted">
      <p>A smaller, well-defined first release is easier to test, train, operate, and improve than a large system built around untested assumptions.</p>
      <p>Northstar recommends starting with:</p>
      <ol><li>One validated operational problem</li><li>The users directly involved</li><li>The records and decisions required for daily work</li><li>A measurable acceptance condition for the system itself</li><li>A clear list of items deferred to later phases</li></ol>
      <p>This does not guarantee a business result. It creates a more disciplined way to decide what should be built and whether it works as specified.</p>
      <TextLinks><InlineLink href="/how-it-works">See how Northstar projects work</InlineLink><InlineLink href="/packages">Compare advanced system starting prices</InlineLink></TextLinks>
    </GrowthSection>

    <GrowthSection title="Related Northstar services.">
      <Disclosure><strong>Start with the simplest reliable path.</strong><p>Review <InlineLink href="/services">Northstar services</InlineLink>, <InlineLink href="/services/automation-integrations">automation and integrations</InlineLink>, <InlineLink href="/services/pos-inventory">established POS and inventory implementation</InlineLink>, and <InlineLink href="/services/support-maintenance">support after launch</InlineLink>. You can also explore <InlineLink href="/industries">industry workflows</InlineLink> and <InlineLink href="/projects">selected product and website projects</InlineLink>.</p></Disclosure>
    </GrowthSection>
  </GrowthPageShell>;
}
