import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { SiteShell } from "./site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested Northstar Systems page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <SiteShell>
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div>
        <span className="eyebrow"><Compass aria-hidden="true" /> ERROR 404</span>
        <h1 id="not-found-title">That page is off the map.</h1>
        <p>The link may be outdated or the page may have moved. Choose a clear route back into Northstar Systems.</p>
        <nav className="not-found-actions" aria-label="Page recovery">
          <Link className="button primary" href="/">Return home <ArrowRight aria-hidden="true" /></Link>
          <Link className="button secondary" href="/services">Explore services</Link>
          <Link className="text-link light" href="/contact">Book a Free Systems Audit <ArrowRight aria-hidden="true" /></Link>
        </nav>
      </div>
    </section>
  </SiteShell>;
}
