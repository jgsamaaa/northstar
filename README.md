# Northstar Systems

Production website for Northstar Systems, a technology implementation and business-systems company serving Philippine businesses.

## What is included

- Premium responsive marketing site with an animated connected-system visual
- Interactive booking, commerce, and controlled AI-assistant demonstrations
- Data-driven service, industry, package, process, and FAQ content
- Dedicated service, industry, company, contact, privacy, and terms routes
- Server-side contact delivery with Zod validation, a honeypot, rate limiting, and Resend
- Route-specific metadata, canonical links, Open Graph and X cards, sitemap, robots rules, and structured data
- Keyboard-visible focus states, reduced-motion support, semantic controls, and responsive layouts

## Routes

- `/`
- `/services`
- `/services/websites`
- `/services/booking`
- `/services/pos-inventory`
- `/services/ai-automation`
- `/industries`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/api/contact` (`POST` only)

## Local setup

Requires Node.js 22.13 or newer.

```bash
npm install
copy .env.example .env.local
npm run dev
```

The development server prints its local URL. The contact page remains usable for validation without email credentials, but it will show a clear configuration message instead of pretending a request was sent.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For live inquiries | Resend API credential used only on the server |
| `CONTACT_TO_EMAIL` | For live inquiries | Inbox that receives audit requests |
| `CONTACT_FROM_EMAIL` | Recommended | Verified Resend sender, e.g. `Northstar Systems <hello@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL` | Before launch | Canonical production URL used by sitemap and robots metadata |
| `NEXT_PUBLIC_BOOKING_URL` | When a scheduler is connected | Public booking destination for future direct-booking CTAs |

Never commit real credentials. The default Resend sender is suitable only for initial testing and must be replaced with a verified sender for production delivery.

## Editing content

- Core services, industries, packages, process, and FAQs: `app/site-data.ts`
- Public contact details and social placeholders: `app/site-config.ts`
- Main page sections and shared layout: `app/site.tsx`
- Contact form fields and client states: `app/contact-form.tsx`
- Contact validation and server delivery: `app/contact-schema.ts` and `app/api/contact/route.ts`
- Visual system and responsive behavior: `app/globals.css`
- Metadata and structured data: `app/layout.tsx` and `app/[...slug]/page.tsx`

## Quality checks

```bash
npm run lint
npm test
```

`npm test` runs a full production build and verifies rendered HTML for key routes. Before launch, also submit a real inquiry using the production Resend configuration and confirm delivery to `CONTACT_TO_EMAIL`.

## Crash diagnostics

The `dev`, `build`, `start`, `test`, and `lint` commands are monitored. Each run writes its status and complete output under `.diagnostics/`. If a command exits unexpectedly, `.diagnostics/latest-crash.md` records the command, exit code or termination signal, and the last log lines. A normal `Ctrl+C` shutdown of the development server is recorded as stopped rather than crashed.

## Deployment

The project uses the bundled vinext/Cloudflare-compatible Sites runtime. Set the hosted environment variables, build the exact source revision, and deploy through Sites. The contact endpoint uses an edge-compatible runtime.

## Replace before public launch

1. Set the real canonical site URL and booking URL.
2. Configure and test the verified Resend sender and destination inbox.
3. Replace the placeholder Facebook, Instagram, and LinkedIn URLs in `app/site-config.ts`.
4. Confirm the displayed email address and legal starter copy with the business owner and legal adviser.
5. Replace sample product-demo content only if the intended sales narrative changes; demo figures must remain clearly identified as sample data.

Northstar Systems does not claim a proprietary BIR-accredited POS, guaranteed tax compliance, medical decision-making by AI, or unverified client outcomes.
