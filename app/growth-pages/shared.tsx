import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "../site";
import { publicSiteUrl, siteConfig } from "../site-config";

export type Faq = { question: string; answer: string };
export type Breadcrumb = { name: string; href: string };

type PageKind = "service" | "industry" | "article";

type GrowthPageShellProps = {
  path: string;
  kind: PageKind;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  breadcrumbs: Breadcrumb[];
  faqs: Faq[];
  description: string;
  children: ReactNode;
  secondaryCta?: { label: string; href: string };
  finalTitle?: string;
  finalCopy?: string;
  finalSecondary?: { label: string; href: string };
  nonce?: string;
};

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function pageSchema({ path, kind, title, description, breadcrumbs, faqs }: Pick<GrowthPageShellProps, "path" | "kind" | "title" | "description" | "breadcrumbs" | "faqs">) {
  const url = `${publicSiteUrl}${path}`;
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${publicSiteUrl}${item.href}`,
    })),
  };
  const faqPage = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const mainEntity = kind === "article"
    ? {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        datePublished: "2026-08-02",
        dateModified: "2026-08-02",
        author: { "@id": `${publicSiteUrl}/#organization` },
        publisher: { "@id": `${publicSiteUrl}/#organization` },
      }
    : {
        "@type": "Service",
        "@id": `${url}#service`,
        url,
        name: title,
        description,
        provider: { "@id": `${publicSiteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "Philippines" },
        ...(kind === "industry" ? { audience: { "@type": "Audience", audienceType: "Philippine business owners and managers" } } : {}),
      };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        ...(kind === "article" ? { datePublished: "2026-08-02", dateModified: "2026-08-02" } : {}),
      },
      mainEntity,
      breadcrumbList,
      faqPage,
    ],
  };
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return <nav className="growth-breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={item.href}>{index < items.length - 1 ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>;
}

export function AuditActions({ secondary }: { secondary?: { label: string; href: string } }) {
  return <div className="growth-actions"><Link className="button primary" href="/contact">Book a Free Systems Audit</Link>{secondary && <Link className="button growth-secondary" href={secondary.href}>{secondary.label}</Link>}</div>;
}

export function GrowthPageShell({ path, kind, eyebrow, title, intro, breadcrumbs, faqs, description, children, secondaryCta, finalTitle, finalCopy, finalSecondary, nonce }: GrowthPageShellProps) {
  return <SiteShell>
    <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(pageSchema({ path, kind, title, description, breadcrumbs, faqs })) }} />
    <article className="growth-page">
      <header className="growth-hero">
        <div className="growth-shell">
          <Breadcrumbs items={breadcrumbs} />
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <div className="growth-intro">{intro}</div>
          <AuditActions secondary={secondaryCta} />
        </div>
      </header>
      <div className="growth-body">{children}<FaqSection faqs={faqs} /><FinalAudit title={finalTitle} copy={finalCopy} secondary={finalSecondary} /></div>
    </article>
  </SiteShell>;
}

export function GrowthSection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`growth-section ${className}`}><div className="growth-shell"><h2>{title}</h2><div className="growth-copy">{children}</div></div></section>;
}

export function TopicGrid({ children }: { children: ReactNode }) {
  return <div className="growth-topic-grid">{children}</div>;
}

export function Topic({ title, children }: { title: string; children: ReactNode }) {
  return <section className="growth-topic"><h3>{title}</h3>{children}</section>;
}

export function TextLinks({ children }: { children: ReactNode }) {
  return <nav className="growth-text-links" aria-label="Related pages">{children}</nav>;
}

export function Disclosure({ children }: { children: ReactNode }) {
  return <aside className="growth-disclosure">{children}</aside>;
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return <GrowthSection title="Frequently asked questions." className="growth-faq"><div className="growth-faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></GrowthSection>;
}

export function FinalAudit({ title = "Find the clearest place to start.", copy = "Tell Northstar what feels disconnected today. We will review the situation and recommend a focused first step.", secondary }: { title?: string; copy?: string; secondary?: { label: string; href: string } }) {
  return <section className="growth-final"><div className="growth-shell"><span className="eyebrow">FREE SYSTEMS AUDIT</span><h2>{title}</h2><p>{copy}</p><ul><li>Free 20–30 minute discovery call</li><li>Clear recommendation with no obligation</li><li>Written proposal only when the project is a good fit</li></ul><AuditActions secondary={secondary} /></div></section>;
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href}>{children}</Link>;
}

export function OrderedProcess({ items }: { items: { title: string; copy: ReactNode }[] }) {
  return <ol className="growth-process">{items.map((item, index) => <li key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><div>{item.copy}</div></div></li>)}</ol>;
}

export function HomeSchema({ faqs, nonce }: { faqs: Faq[]; nonce?: string }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${publicSiteUrl}/#website`,
        url: publicSiteUrl,
        name: siteConfig.name,
        publisher: { "@id": `${publicSiteUrl}/#organization` },
        inLanguage: "en-PH",
      },
      {
        "@type": "FAQPage",
        "@id": `${publicSiteUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      },
    ],
  };
  return <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}
