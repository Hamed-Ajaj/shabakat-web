# Shabakat — Marketing Website & Legal Pages Specification

**Audience:** Frontend engineer(s) building the public-facing pages in `shabakat-web`
**Product:** Shabakat (شبكات) — subscription SaaS for private/neighborhood electricity generator operators
**Market:** Lebanon (primary), MENA (secondary)
**Status:** Specification for kickoff. Legal text drafts require review by the business owner before publication.
**Last updated:** 2026-09-18

---

## Table of contents

1. [Purpose and scope](#1-purpose-and-scope)
2. [Product snapshot (single source of truth)](#2-product-snapshot-single-source-of-truth)
3. [Global requirements](#3-global-requirements)
4. [Routing and integration plan](#4-routing-and-integration-plan)
5. [Page 1 — Landing page](#5-page-1--landing-page)
6. [Page 2 — About us](#6-page-2--about-us)
7. [Page 3 — Contact us](#7-page-3--contact-us)
8. [Page 4 — Privacy Policy](#8-page-4--privacy-policy)
9. [Page 5 — Terms of Service](#9-page-5--terms-of-service)
10. [Page 6 — Data Deletion Request](#10-page-6--data-deletion-request)
11. [App Store and Play Store requirements](#11-app-store-and-play-store-requirements)
12. [Assets and source-of-truth files](#12-assets-and-source-of-truth-files)
13. [Content inputs required before launch](#13-content-inputs-required-before-launch)
14. [Definition of done / QA checklist](#14-definition-of-done--qa-checklist)

---

## 1. Purpose and scope

The current `shabakat-web` application is an authenticated admin dashboard. It has no public marketing surface. This document specifies the public pages that must be added:

- Landing page (home)
- About us
- Contact us
- Privacy Policy
- Terms of Service
- Data Deletion Request (needed for app store compliance)

These pages serve two purposes:

1. **Marketing and lead capture.** The product is a closed, private SaaS. New generator operators are onboarded by the vendor, not by self-registration. Therefore the site's primary conversion goal is a **"Request access" / "Book a demo"** action, not "Sign up".
2. **App store compliance.** The mobile app is distributed privately (link-only). Apple and Google still require a public privacy policy URL, a support URL, and a functional way for a user to request account deletion. These pages satisfy that requirement.

Out of scope: the in-app dashboard UI, backend API changes, and app store binary work. Where a backend change is required (for example, a contact form endpoint), it is flagged in this document but not implemented here.

---

## 2. Product snapshot (single source of truth)

Use the facts below as the canonical description. Do not invent features, pricing, or claims that are not in this list.

### 2.1 One-line description

> Shabakat is subscription software that lets private electricity generator operators manage subscribers, meter readings, monthly billing, payments, and payment reminders from one workspace — online, on mobile, or fully offline on desktop.

### 2.2 Short description (meta description / store subtitle)

> Shabakat (شبكات) is billing and subscriber management software for private generators in Lebanon. Handle ampere, kilowatt, and prepaid plans, invoices, payments, expenses, and WhatsApp reminders. English and Arabic. Works offline.

### 2.3 Target user

Private and neighborhood generator operators ("شبكات" / "مولدات" operators), small electricity distributors, and anyone billing a shared generator connection. The operator is the buyer, not the end consumer. The operator's own customers (subscribers) are the data subjects whose information is processed by the software.

### 2.4 Confirmed capabilities

- **Subscriber management:** add, edit, search, filter, suspend, delete subscribers. Fields include name, phone, address, area, distribution box, plan, plan value, customer type, and per-subscriber price overrides.
- **Billing plans:**
  - **Ampere** — prepaid, current-month subscription.
  - **Kilowatt** — postpaid, based on meter readings (current reading minus previous reading).
  - **Fixed Kilowatt** — prepaid counter; payment is converted to credited kWh at the counter and the invoice is created as paid immediately.
- **Meter readings:** record monthly kWh readings per Kilowatt subscriber; one reading per month, must be greater than or equal to the previous reading.
- **Invoices:** create single or bulk invoices for all active subscribers; printable HTML and downloadable PDF invoices in English or Arabic (RTL); invoice number, issue date, due date, fixed charge, TVA, amounts.
- **Payments:** record full or partial payments; invoice status updates automatically (Unpaid, Partially Paid, Paid). Payment methods currently recorded as Cash or Wish.
- **Expenses:** track generator running costs by type — Fuel, Maintenance, Employees, Other.
- **Areas and distribution boxes:** organize subscribers by area/zone and by physical distribution box/cable.
- **Dashboard and reports:** totals for billed, collected, outstanding, collection rate, expenses, and net income; subscriber and invoice breakdowns; revenue chart.
- **WhatsApp reminders:** connect a WhatsApp number by QR code and send automatic payment reminders to subscribers with unpaid invoices on a configurable trigger day. Reminders exclude Fixed Kilowatt subscribers.
- **Audit logs:** activity trail of key actions (customer, invoice, payment, expense) with success/failure status.
- **Company branding:** upload the operator's own logo; the logo and company name appear on invoices.
- **Roles:** Owner, Admin, and User (employee) with role-based permissions. Employee accounts are created by an Admin.
- **Language:** English and Arabic with right-to-left (RTL) support.
- **Offline mode (mobile):** read-only access to saved subscribers, invoices, expenses, areas, and boxes when there is no internet connection.
- **Offline desktop (Windows):** the full application runs locally on SQLite with no internet required; optional encrypted JSON backup to cloud storage; includes a fuel market price view for Lebanon and global benchmarks.
- **AI assistant (mobile):** in-app assistant with text and voice message support.
- **Fixed Kilowatt calculator:** converts a payment amount to kWh credit and vice versa.

### 2.5 What the product explicitly does NOT do

Do not claim any of the following:

- No self-service sign-up. Accounts are provisioned by the vendor.
- No online payment gateway. Payments are recorded manually (Cash/Wish).
- No credit card processing.
- No email notifications. The only outbound messaging channel is WhatsApp.
- No public customer portal. Subscribers do not log in.
- No iOS/Android app store listing by public search; distribution is private/unlisted and link-only.
- The desktop application is Windows-only.

### 2.6 Contact and identity facts

The following values do not currently exist anywhere in the codebase. They must be supplied by the business owner and substituted into the site. Until supplied, use obvious placeholders and do not publish.

| Token | Meaning | Status |
|---|---|---|
| `{{PRODUCT_NAME}}` | Shabakat / شبكات | Known |
| `{{LEGAL_ENTITY}}` | Registered company or individual operating Shabakat | **Required** |
| `{{DOMAIN}}` | Primary website domain | **Required** |
| `{{SUPPORT_EMAIL}}` | Support and privacy contact email | **Required** |
| `{{SUPPORT_PHONE}}` | Support phone number (Lebanon format) | **Required** |
| `{{WHATSAPP_NUMBER}}` | Sales/support WhatsApp number | **Required** |
| `{{BUSINESS_ADDRESS}}` | Registered address in Lebanon | **Required** |
| `{{GOVERNING_LAW}}` | Governing jurisdiction for terms (default: Lebanon) | To confirm |
| `{{LAST_UPDATED}}` | Legal pages effective date | Set at publish |

---

## 3. Global requirements

### 3.1 Technology

Reuse the existing stack. Do not add new frameworks.

- Vite + React 19 + TypeScript
- React Router 7
- Tailwind CSS v4
- shadcn/ui components already present in `src/app/components/ui`
- lucide-react icons
- Existing providers: `I18nProvider`, `SettingsProvider`
- Package manager: pnpm

### 3.2 Bilingual and RTL

- Every public page must be fully bilingual: **English (en)** and **Arabic (ar)**.
- Reuse the existing `I18nProvider` and `useI18n`/`t()` mechanism. Do not introduce i18next.
- Add all new marketing and legal strings to `src/app/shared/i18n/messages.ts` under new namespaces: `marketing.*`, `about.*`, `contact.*`, `privacy.*`, `terms.*`, `deletion.*`, `footer.*`.
- Arabic must render RTL. The existing provider already sets `document.documentElement.dir` and `lang`.
- All layouts must be checked in both directions. Mirror directional icons (arrows, chevrons) and use logical spacing utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`).
- The language switcher must be visible in the public header and persist across pages.

### 3.3 Brand tokens

Use these exact values. They are consistent across the web app, the mobile app, and the desktop app.

**Primary gold**
- Dark surfaces: `#F5C000`
- Light surfaces: `#E6C43A`

**Surfaces**
- Dark background: `#0B0B15`
- Dark card: `#13131F`
- Dark popover: `#1A1A2E`
- Light background: `#F5F5F3`
- Light card: `#FCFCFB`

**Text**
- Dark foreground: `#F0F0F8`
- Light foreground: `#262423`
- Muted (dark): `#7A7A9A`
- Muted (light): `#868178`

**Status**
- Success: `#22C55E`
- Error / destructive: `#EF4444` (dark), `#DC2626` (light)
- WhatsApp: `#25D366`

**Chart palette (dark):** `#F5C000`, `#22C55E`, `#3B82F6`, `#A855F7`, `#F97316`

**Typography**
- Body: `Inter`, fallback `system-ui, -apple-system, sans-serif`
- Tailwind `font-sans`: `Geist Variable` (already wired)
- Mono (code, invoice numbers): `JetBrains Mono`

**Shape**
- Base radius: `0.75rem` (12px)

**Visual motifs**
- Gold glow accents: `rgba(245,192,0,0.22)` to `rgba(245,192,0,0.35)`
- Rounded corners commonly `rounded-xl` / `rounded-2xl` / `rounded-[24px]` / `rounded-[32px]`
- Dark theme is the primary marketing surface; light theme is the secondary option.

**Logo**
- Primary mark: gold rounded square with a dark lightning bolt (see `public/favicon.svg`).
- Full logo asset (mobile/desktop): `shabakat_logo.png` (see section 12 for paths).
- The product needs a horizontal wordmark lockup (icon + "Shabakat" / "شبكات") for the header and footer. This does not exist yet and must be produced.

### 3.4 Header (public navigation)

Persistent, sticky, with backdrop blur. Same component across all public pages.

- Left: logo/wordmark linking to `/`.
- Center/right links: Features, Platforms, How it works, About, Contact.
- Right: language switcher (EN | AR), "Sign in" text link, and a primary "Request access" button.
- Mobile: hamburger opening a full-height sheet/drawer using the existing shadcn `Sheet`.
- On scroll, add a subtle background and border so links stay readable over hero imagery.
- "Sign in" links to `/login` (the existing dashboard login). Do not build a separate login.

### 3.5 Footer (public)

Four-column layout on desktop, stacked on mobile.

- **Column 1 — Brand:** logo, one-line description, social icons (only if accounts exist).
- **Column 2 — Product:** Features, Platforms, How it works, Request access, Sign in.
- **Column 3 — Company:** About us, Contact us.
- **Column 4 — Legal:** Privacy Policy, Terms of Service, Data Deletion Request.
- **Bottom bar:** `© {{YEAR}} {{LEGAL_ENTITY}}. All rights reserved.` plus language switcher and a short note: "Shabakat is a product for generator operators in Lebanon."
- Every legal link must resolve to a real page (app store reviewers will click them).

### 3.6 SEO and metadata

The current `index.html` only has `charset` and `viewport`. Required additions:

- `<title>` per page (Shabakat — private generator billing and subscriber management).
- `<meta name="description">` per page, using the short description in section 2.2.
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:locale:alternate`.
- Twitter card tags.
- `<link rel="canonical">`.
- `theme-color` set to `#0B0B15`.
- `robots.txt` and `sitemap.xml`.
- `hreflang` alternates for `en` and `ar`.
- Because this is a single-page app, per-page meta must be set at runtime (recommend a small `usePageMeta` hook) or via prerendering. At minimum, implement a client-side hook.

### 3.7 Accessibility

- Color contrast: gold `#F5C000` on dark `#0B0B15` passes for large text and UI; verify small text pairs. Never use gold text on white for body copy.
- All images require meaningful `alt` text; decorative images use empty `alt`.
- Full keyboard navigation for the header, mobile drawer, forms, and footer.
- Visible focus rings using the existing `--ring` token.
- Forms must have labels, inline error text, and `aria-describedby` where relevant.
- Respect `prefers-reduced-motion` for any scroll or hover animation.

### 3.8 Performance

- Compress and lazy-load all images. Prefer WebP/AVIF with PNG fallback.
- Serve screenshots at explicit `width`/`height` to avoid layout shift.
- Load fonts with `display=swap` (already the case for Inter).
- Keep the landing page JavaScript minimal; avoid importing dashboard feature code into public routes.

### 3.9 Analytics

No analytics provider exists in the project. Do not add one without owner approval. If analytics are approved, the privacy policy must disclose it.

---

## 4. Routing and integration plan

Add public routes in `src/app/routes/AppRoutes.tsx` **outside** the `ProtectedRoute`/`AppShell` wrapper:

| Path | Page | Auth |
|---|---|---|
| `/` | Landing (public home) | Public |
| `/about` | About us | Public |
| `/contact` | Contact us | Public |
| `/privacy` | Privacy Policy | Public |
| `/terms` | Terms of Service | Public |
| `/data-deletion` | Data Deletion Request | Public |
| `/login` | Existing dashboard login | Public |
| `/dashboard`, `/areas`, ... | Existing app routes | Protected (unchanged) |

**Important routing change:** today `/` redirects to `/dashboard` (which redirects to `/login` when logged out). The new public landing page takes over `/`. Keep the dashboard entry at `/login` and `/dashboard`. Update the in-app logo/links so they do not collide.

Recommended folder structure (follows the existing feature-first convention):

```
src/app/features/marketing/
  pages/
    LandingPage.tsx
    AboutPage.tsx
    ContactPage.tsx
    PrivacyPolicyPage.tsx
    TermsPage.tsx
    DataDeletionPage.tsx
  components/
    MarketingHeader.tsx
    MarketingFooter.tsx
    MarketingLayout.tsx
    HeroSection.tsx
    FeatureGrid.tsx
    PlanComparison.tsx
    PlatformShowcase.tsx
    HowItWorks.tsx
    StatsStrip.tsx
    FaqAccordion.tsx
    CtaBand.tsx
    RequestAccessDialog.tsx
  lib/
    pageMeta.ts
```

Add marketing strings to `messages.ts`. Legal pages should be structured data (arrays of sections) so headings stay translatable and the table of contents can be generated.

---

## 5. Page 1 — Landing page

**Goal:** explain what Shabakat is in under 10 seconds, show who it is for, and drive "Request access" or "Book a demo".

**Tone:** confident, practical, operator-first. Speak to a generator owner, not a software buyer. Use sentences like "You bill your subscribers. Shabakat handles the rest."

### 5.1 Announcement bar (optional)

- Thin bar above the header, dismissible.
- Copy example: "Shabakat is now available on iOS and Android by invitation. Request access today."
- Left: small badge or icon. Right: link "Request access".

### 5.2 Hero

- **Layout:** two columns on desktop (text left, visual right). Single column on mobile with the visual below the text.
- **Eyebrow:** "Generator operations, simplified" (EN) / "إدارة المولدات ببساطة" (AR).
- **Headline (H1):** "Billing and subscriber management for private generators."
- **Subheadline:** "Shabakat keeps your subscribers, meter readings, invoices, and payment reminders in one place. Works in English and Arabic, online or offline."
- **Primary CTA:** "Request access" → opens the request-access dialog or scrolls to the final CTA.
- **Secondary CTA:** "See how it works" → scrolls to the How it works section.
- **Trust bullets (inline, with check icons):** "No setup fees to start", "English and Arabic", "Works offline".
- **Hero visual:** a composed mockup showing the dashboard, the mobile app, and the desktop app together on a dark gold-glow background. Include a subtle gold radial glow behind the device cluster.
  - Suggested asset: `hero-devices.png`, 1600x1200, transparent background, WebP.
  - Alt text: "Shabakat dashboard, mobile app, and desktop app shown together."
- **Background:** `#0B0B15` with a soft gold radial glow, echoing the login page gradient motif.

### 5.3 Stats strip

Four small stats in a row, separated by dividers. Use conservative, verifiable numbers only. If numbers are not yet available, replace with capability statements instead of fabricated metrics.

- Example (capabilities, not fake numbers):
  - "3 billing plans: Ampere, Kilowatt, Fixed Kilowatt"
  - "EN / AR with full RTL"
  - "Offline on desktop"
  - "WhatsApp reminders"

If real metrics become available (subscribers billed, invoices processed), use them with a footnote.

### 5.4 Problem section

- **Heading:** "Running a generator by hand does not scale."
- **Body:** one short paragraph about paper notebooks, missed payments, and guessing who owes what.
- **Visual:** small illustration or annotated photo of a paper billing notebook next to the digital dashboard.
  - Use a real photo only if licensed. Otherwise use an icon-led graphic. `ATTRIBUTIONS.md` mentions Unsplash but no licensed photos currently exist in the repo.
- **Layout:** text left, comparison graphic right.

### 5.5 Features grid

Six to nine cards, each with a lucide icon, title, and one-sentence description. 3 columns desktop, 2 tablet, 1 mobile.

1. **Subscriber management** — "Keep every subscriber, address, area, and connection detail in one searchable list."
2. **Flexible billing plans** — "Bill by ampere, by metered kilowatt, or prepaid kilowatt credits."
3. **Meter readings** — "Record monthly readings and let Shabakat calculate consumption automatically."
4. **Invoices in one click** — "Generate one invoice or a full month for all active subscribers at once."
5. **Payments and balances** — "Record full or partial payments and see who still owes you."
6. **Automatic WhatsApp reminders** — "Send payment reminders to unpaid subscribers on the day you choose."
7. **Expenses and profit** — "Track fuel, maintenance, and salaries to see your real net income."
8. **Areas and distribution boxes** — "Organize subscribers by zone, box, and cable."
9. **Offline capability** — "Keep working on desktop with no internet; view saved data on mobile offline."

Icons: `Users`, `FileText`, `Gauge`, `ReceiptText`, `Wallet`, `MessageCircle` (or a WhatsApp glyph), `TrendingUp`, `MapPinned`, `WifiOff`.

### 5.6 Billing plans explained

Three cards, one per plan. Each with a small diagram or icon and a one-line rule.

- **Ampere (prepaid subscription).** "A fixed monthly amount based on the subscriber's ampere rating."
- **Kilowatt (postpaid meter).** "Billed on actual consumption: this month's reading minus last month's."
- **Fixed Kilowatt (prepaid credits).** "The subscriber pays at the counter and the amount is converted to kWh credit instantly."

Include a small note: "Each operator sets their own prices, fixed charge, and TVA in settings."

### 5.7 How it works

Three or four numbered steps with a connecting line on desktop.

1. "Add your subscribers." — name, phone, area, plan.
2. "Record readings and generate invoices." — single or bulk.
3. "Record payments and send reminders." — cash, Wish, or your own method.
4. "Watch your numbers." — dashboard shows collected, outstanding, and net income.

### 5.8 Platform showcase

Three tabs or three columns: Web dashboard, Mobile app, Desktop app. Each has a screenshot and a short list.

- **Web dashboard** — "Manage everything from your browser. Areas, subscribers, invoices, expenses, and settings." Screenshot: dashboard page.
- **Mobile app** — "Bill and check on the go. Includes offline access to your saved data and an AI assistant." Screenshot: a phone frame with the subscribers list and a second with the dashboard.
- **Desktop app (Windows)** — "Run everything fully offline on your PC, with automatic cloud backup and a fuel market view." Screenshot: desktop dashboard.

Use the existing screenshots listed in section 12. Frame mobile screenshots in a phone mockup and desktop screenshots in a window chrome mockup.

### 5.9 Offline and data section

- **Heading:** "Your data does not stop when the internet does."
- Two-column: left text, right diagram of device-to-cloud flow.
- Bullets: "Mobile shows your saved subscribers and invoices offline", "Desktop runs fully standalone on a local database", "Optional automatic backup to the cloud".

### 5.10 Security and privacy teaser

- Short section with a lock icon.
- Copy: "Your subscribers' data is isolated per company. Only you and the employees you authorize can see it."
- Link: "Read our Privacy Policy" → `/privacy`.

### 5.11 Testimonials (optional, only if real)

Do not fabricate testimonials. If the owner provides them, show one to three quotes with name, business, and city (for example, "Nour Electric, Tripoli"). If none exist, omit this section entirely.

### 5.12 Access and pricing

This product is vendor-onboarded, so the pricing section should be a call to action, not a public price list — unless the owner explicitly wants public tiers.

- **Heading:** "Get set up with Shabakat."
- **Body:** "Shabakat is provided to generator operators directly. Tell us about your network and we will set up your account."
- **CTA:** "Request access" → opens the request-access dialog.
- If public tiers are approved later, replace with a normal three-tier pricing table and keep "Request access" as the CTA on each tier.

### 5.13 FAQ

Accordion using the shadcn `Accordion`. Suggested questions:

- "Do I need a credit card to use Shabakat?" — "No. Payment is arranged directly with our team."
- "Does Shabakat work without internet?" — "The desktop app runs fully offline. The mobile app shows your saved data offline and syncs when you reconnect."
- "Which languages are supported?" — "English and Arabic, including full right-to-left layout."
- "Can my employees use it?" — "Yes. You can create employee accounts with limited permissions."
- "How are reminders sent?" — "Through WhatsApp, from a number you connect by scanning a QR code."
- "Does Shabakat process online payments for my subscribers?" — "No. You record payments as you receive them; Shabakat tracks the balances."
- "Is there an app store link?" — "The mobile app is distributed by invitation. Request access and we will send you the link."

### 5.14 Final CTA band

- Full-width band in dark with a gold glow.
- **Heading:** "Ready to modernize your generator billing?"
- **Buttons:** "Request access" (primary), "Contact us" (secondary → `/contact`).

---

## 6. Page 2 — About us

**Goal:** build trust. Explain who is behind Shabakat and why it was built for Lebanese generator operators.

Suggested structure:

1. **Hero**
   - Eyebrow: "About Shabakat"
   - Headline: "Built for the people who keep the power on."
   - Short intro paragraph.

2. **Our story**
   - Two to three paragraphs on the origin: private generator operators in Lebanon run essential infrastructure, often with notebooks and manual calculations. Shabakat was built to give them proper tools.
   - Include the practical realities: disconnected power, variable fuel prices, subscribers paying in cash, and the need to work offline.

3. **Mission**
   - A single, strong statement. Example: "Make professional billing effortless for every private generator operator."

4. **Who we serve**
   - Cards or a list: neighborhood generator operators, building generator managers, small distributors, and operator teams with employees.
   - Mention the three roles: Owner, Admin, User.

5. **What we value**
   - Reliability (works offline), clarity (clean numbers), local first (Arabic and English, Lebanon-aware), and privacy.

6. **Platform coverage**
   - Short section pointing to the three products. Reuse the platform showcase component.

7. **The team** (optional)
   - Only include if the owner provides real names, roles, and photos. Otherwise omit.

8. **CTA**
   - "Want to bring Shabakat to your network?" → Request access.

Images: a photo of a generator/neighborhood power setup (licensed), an abstract gold-on-dark graphic, and team photos only if real. Avoid generic stock "handshake" imagery.

---

## 7. Page 3 — Contact us

**Goal:** give a clear, working path to reach the team, and satisfy the app store "support URL" requirement.

Suggested structure:

1. **Hero**
   - Eyebrow: "Contact"
   - Headline: "Talk to the Shabakat team."
   - Short line: "Questions about setup, pricing, or your network? We will get back to you."

2. **Contact methods** (cards)
   - **Email:** `{{SUPPORT_EMAIL}}` — `mailto:` link.
   - **Phone:** `{{SUPPORT_PHONE}}` — `tel:` link.
   - **WhatsApp:** `{{WHATSAPP_NUMBER}}` — `https://wa.me/961XXXXXXXXX` link. This is the preferred channel.
   - **Address:** `{{BUSINESS_ADDRESS}}` (optional, if a physical office exists).
   - **Hours:** business hours and timezone (Asia/Beirut).

3. **Contact form**
   - Fields: Full name (required), Company/business name (optional), Email (required), Phone (optional), Subject (select: Sales, Support, Billing, Other), Message (required, textarea).
   - Client-side validation with react-hook-form + zod (already in the project).
   - Success state: toast and inline confirmation. Failure state: clear error message with the email fallback.
   - **Backend note:** the API currently has no email sending and no contact endpoint. Choose one of:
     - **Recommended:** add a `POST /api/v1/contact` endpoint that stores the message and forwards it via WhatsApp using the existing Evolution API, or via an email provider added to the backend. The frontend then posts to this endpoint.
     - **Fastest launch:** make the form open a prefilled WhatsApp message and/or `mailto:` link, and label it clearly ("Send via WhatsApp").
     - Third-party form service is possible but requires a privacy-policy update.

4. **Map** (optional)
   - Only if there is a real office. Use a static map image to avoid embedding third-party scripts that collect data.

5. **Response-time note**
   - "We usually reply within one business day."

6. **Support for app users**
   - A short line for subscribers of the *subscriber's* operator explaining that they should contact their generator operator directly, since Shabakat is the operator's software.

---

## 8. Page 4 — Privacy Policy

This is the most important page for app store approval. It must be public, reachable without login, and linked from the mobile app listing, the app itself, and the footer.

**Legal disclaimer:** The text below is a draft template and must be reviewed by the business owner and, ideally, a qualified legal professional before publication. Replace all `{{tokens}}`.

### 8.1 Page structure

- Page title: "Privacy Policy"
- Effective date line: "Effective date: {{LAST_UPDATED}}"
- Auto-generated table of contents from section headings.
- Clean reading layout: max width around 760px, generous line height, clear H2/H3.
- Support both EN and AR, RTL for Arabic.

### 8.2 Required sections (with draft English text)

#### 1. Introduction

> This Privacy Policy explains how {{LEGAL_ENTITY}} ("we", "us") collects, uses, and protects information in connection with the Shabakat software, including our website, web dashboard, mobile application, and desktop application (together, the "Service").
>
> Shabakat is a business tool for electricity generator operators. The operator who subscribes to Shabakat is the data controller of their subscribers' information. We process that information on the operator's behalf. If you are a subscriber of a generator operator and have questions about your data, please contact your operator first.

#### 2. Information we collect

> **Account information.** When your company is set up on Shabakat, we collect the operator's company name, company logo, and the name, email address, and encrypted password of the operator's users (Owner, Admin, and employee accounts).
>
> **Subscriber information entered by the operator.** The Service lets operators record information about their own subscribers, including name, phone number, address, area or zone, distribution box, connection details, subscription type, subscription value, meter readings, invoices, payments, and payment notes.
>
> **Operational records.** Invoices, payments, expenses, meter readings, audit logs, and related records you create in the Service.
>
> **Technical information.** Authentication tokens, device and application version, and server logs generated when you use the Service.
>
> **Communications.** If you contact us, we collect the information you provide in that message.
>
> We do not collect precise location data, and we do not use advertising trackers.

#### 3. How we use information

> We use the information to: provide and operate the Service; create and manage accounts and permissions; calculate bills and generate invoices; send payment reminders through WhatsApp when the operator enables them; provide offline and backup functionality; maintain security and prevent misuse; provide support; and comply with legal obligations.

#### 4. How we share information

> We do not sell personal information. We share information only with the service providers needed to run the Service, and only as required to provide it. These currently include:
>
> - **Cloud hosting and database providers** that store the application and its data.
> - **Cloudflare R2** for storing company logos and optional desktop backups.
> - **A WhatsApp messaging provider** used to send reminders and messages on the operator's instructions. Messages are sent through the WhatsApp platform, which is operated by Meta.
>
> We may also disclose information if required by law or to protect rights and safety.

*(Confirm the exact hosting provider and list it. The codebase indicates Railway-style hosting may be used; verify before publishing.)*

#### 5. WhatsApp messaging

> If the operator connects a WhatsApp number and enables reminders, Shabakat sends messages to subscriber phone numbers through the WhatsApp platform. The operator is responsible for having a lawful basis to message their subscribers. Message content and delivery are also subject to WhatsApp's own terms and privacy policy.

#### 6. Data retention

> We retain account and operational data for as long as the operator's account is active, and for a reasonable period afterward to comply with legal, tax, and accounting obligations. Operators may request deletion of their account data as described below.

#### 7. Security

> We use technical and organizational measures to protect information, including password hashing, authentication tokens, encryption in transit, and per-company data isolation. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.

#### 8. Data isolation between companies

> Each company's data is scoped and isolated so that a company and its authorized users can access only their own data.

#### 9. International transfers

> Our service providers may store or process data outside Lebanon. Where required, we take steps to ensure appropriate safeguards are in place.

#### 10. Your rights

> Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict processing of your personal information, and to object to certain processing. Operators can exercise these rights for their account data, and subscribers should contact their operator. To make a request to us directly, contact {{SUPPORT_EMAIL}}.

#### 11. Account and data deletion

> Account holders can request deletion of their account and associated data by:
>
> - Using the Data Deletion Request page at `https://{{DOMAIN}}/data-deletion`, or
> - Emailing {{SUPPORT_EMAIL}} from the email address associated with the account.
>
> We will verify the request and process it within a reasonable period, subject to legal retention requirements. Some records, such as paid invoices, may need to be retained for accounting purposes; where possible, they are retained in a de-identified form.

#### 12. Children's privacy

> The Service is a business tool and is not intended for children. We do not knowingly collect information from children.

#### 13. Changes to this policy

> We may update this policy from time to time. We will update the effective date and, for material changes, provide notice through the Service or website.

#### 14. Contact us

> Questions about this policy can be sent to {{SUPPORT_EMAIL}} or {{BUSINESS_ADDRESS}}.

### 8.3 Arabic version

Provide a complete Arabic translation of every section above, with `dir="rtl"`. Arabic is a first-class language in the app; app reviewers may open the Arabic policy, and it must be complete and accurate, not a summary.

Key Arabic heading labels to use consistently:

- مقدمة
- المعلومات التي نجمعها
- كيف نستخدم المعلومات
- كيف نشارك المعلومات
- رسائل واتساب
- الاحتفاظ بالبيانات
- الأمان
- عزل البيانات بين الشركات
- نقل البيانات دولياً
- حقوقك
- حذف الحساب والبيانات
- خصوصية الأطفال
- التغييرات على هذه السياسة
- اتصل بنا

### 8.4 App store specific notes

- Apple and Google require the privacy policy to be reachable by a public URL with no login. `/privacy` satisfies this.
- The privacy policy URL must match exactly what is entered in App Store Connect and Google Play Console.
- Because the app collects phone numbers, names, addresses, and uses camera and microphone permissions, the policy must explicitly address those. The mobile app requests camera access (company logo photos), photo library access (logo selection), and microphone access (voice messages to the AI assistant). Confirm these are disclosed under "Information we collect".
- Refer to section 11 for the exact App Privacy and Data Safety answers that must align with this policy.

---

## 9. Page 5 — Terms of Service

The app stores require a Terms/EULA link in some contexts, and the product needs one regardless. Draft structure:

1. **Acceptance of terms** — by using the Service you agree to these terms.
2. **The Service** — description of Shabakat as business software for generator operators.
3. **Accounts** — accounts are created and managed by {{LEGAL_ENTITY}}; the operator is responsible for its users and credentials.
4. **Operator responsibilities** — the operator must have the right to process its subscribers' data and to message them.
5. **Acceptable use** — no unlawful use, no attempts to breach security, no reselling without permission.
6. **Subscriptions and payment** — how the operator pays for Shabakat (arranged directly, per section 5.12).
7. **Intellectual property** — the software and brand belong to {{LEGAL_ENTITY}}; operator data belongs to the operator.
8. **Third-party services** — WhatsApp and cloud providers are subject to their own terms.
9. **Availability and support** — best-effort availability; offline desktop works without our servers.
10. **Disclaimer of warranties** — provided "as is" to the extent permitted by law.
11. **Limitation of liability**.
12. **Termination** — either party may end the agreement; data deletion as per the privacy policy.
13. **Governing law** — `{{GOVERNING_LAW}}` (default Lebanon).
14. **Changes to terms**.
15. **Contact**.

Provide a complete Arabic translation, RTL.

---

## 10. Page 6 — Data Deletion Request

This page is required to satisfy the account-deletion requirement for account-based mobile apps, and to back the "Account and data deletion" section of the privacy policy.

- Route: `/data-deletion`.
- Fields: account email, company name, reason (optional), confirmation checkbox acknowledging permanent deletion.
- On submit: either post to a backend endpoint or open a prefilled email to `{{SUPPORT_EMAIL}}`.
- Clear explanation of what will be deleted, what may be retained (paid invoices for accounting), and the expected processing time.
- Show a confirmation state with a reference number if the backend supports it.
- Bilingual and RTL.

---

## 11. App Store and Play Store requirements

The mobile app is distributed privately, by invitation/link only. Use the following to prepare metadata. The marketing pages must exist before submission.

### 11.1 Store listing prerequisites

| Item | Value / source |
|---|---|
| App name | Shabakat |
| Subtitle / short description | "Generator billing and subscriber management" |
| Full description | Adapt section 2.4 into store-safe prose |
| Primary language | English |
| Additional language | Arabic |
| Privacy Policy URL | `https://{{DOMAIN}}/privacy` |
| Support URL | `https://{{DOMAIN}}/contact` |
| Marketing URL (optional) | `https://{{DOMAIN}}` |
| Category | Business (Apple), Business (Google) |
| Content rating | Business utility; no objectionable content |
| Sign-in required | Yes; accounts are provided by the vendor |

### 11.2 Private distribution notes

- **Apple:** request "Unlisted app distribution" in App Store Connect. The app is accessed only via a direct link and is not discoverable in search. A privacy policy and support URL are still mandatory.
- **Google Play:** use internal testing or a private app via Managed Google Play, or the unlisted/private track. Privacy policy URL is mandatory.
- Because accounts are vendor-provisioned, mention in the store listing that access is by invitation and provide the support URL.

### 11.3 Apple App Privacy answers (must match the policy)

Based on the codebase, the app collects and processes:

- **Contact info:** name, phone number, email address, physical address (subscriber and user records).
- **User content:** photos (company logo), audio (voice messages), and business records.
- **Identifiers:** account identifiers.
- **Usage / diagnostics:** application version and basic logs.

The app does **not** currently use third-party advertising or analytics SDKs. Confirm the final answer set with the owner, then ensure the privacy policy lists the same items.

### 11.4 Google Play Data Safety answers (must match the policy)

- Data collected: name, phone, address, email, photos, audio, app activity/records.
- Data shared: with service providers for messaging and hosting.
- Data encrypted in transit: yes.
- Users can request deletion: yes, via `/data-deletion`.
- Data types align with the privacy policy.

### 11.5 Permissions to disclose

- Camera — to capture a company logo.
- Photo library — to choose a company logo.
- Microphone — to record voice messages for the in-app assistant.
- Internet — to sync.
- Storage (Android, legacy, max SDK 32) — for saving invoices/PDFs and sharing.

The privacy policy and store privacy forms must disclose these.

---

## 12. Assets and source-of-truth files

### 12.1 Existing brand assets

| Asset | Path | Notes |
|---|---|---|
| Web favicon / logo mark | `C:\Users\bhbored\Documents\react\shabakat-web\public\favicon.svg` | Gold rounded square with dark bolt |
| Mobile/desktop logo | `C:\Users\bhbored\Documents\flutter\shabakat\assets\logo\shabakat_logo.png` | Large PNG, used for app icon and splash |
| Desktop logo | `C:\Users\bhbored\Documents\csharp\maui\Shabakat\wwwroot\images\shabakat_logo.png` | Used in README |
| Web theme tokens | `src/styles/theme.css` | Light and dark palettes |
| Components config | `components.json` | shadcn configuration |

There is currently **no horizontal wordmark**, **no OG image**, and **no marketing illustrations**. These must be produced or commissioned.

### 12.2 Product screenshots (real, usable)

Mobile app screenshots (14 PNGs) are available at:

```
C:\Users\bhbored\Documents\flutter\shabakat\docs\screenshots\
```

Files: `01-splash`, `02-login`, `03-dashboard`, `04-subscribers`, `05-invoices`, `06-expenses`, `07-areas`, `08-distribution-boxes`, `09-settings`, `10-subscriber-detail`, `11-audit`, `12-calculator`, `13-ai-assistant`, `14-offline-mode`.

Desktop screenshots live at:

```
C:\Users\bhbored\Documents\csharp\maui\Shabakat\wwwroot\images\screenshots\
```

Note: some desktop screenshots are placeholders or marked as pending capture (`fuel-market-lebanon.png`, `fuel-market-global.png`, refreshed `dashboard.png` and `invoices.png`). Verify freshness before using.

### 12.3 Recommended new assets

| Asset | Purpose | Spec |
|---|---|---|
| Horizontal wordmark (EN) | Header, footer | SVG, gold on transparent |
| Horizontal wordmark (AR) | Arabic header, footer | SVG with شبكات |
| Hero device cluster | Landing hero | 1600x1200 PNG/WebP |
| OG share image | Social previews | 1200x630 |
| Plan diagrams | Billing plans section | 3 SVGs, one per plan |
| Offline/data flow diagram | Offline section | SVG |
| Window/phone mockup frames | Platform showcase | SVG or CSS |

Use screenshots inside device frames rather than raw full-screen captures for a cleaner look.

---

## 13. Content inputs required before launch

These must be supplied by the business owner. Until then, keep the site in draft or staging and do not publish legal pages.

1. `{{LEGAL_ENTITY}}` — registered company or individual name.
2. `{{DOMAIN}}` — final domain.
3. `{{SUPPORT_EMAIL}}` — monitored support email.
4. `{{SUPPORT_PHONE}}` and `{{WHATSAPP_NUMBER}}`.
5. `{{BUSINESS_ADDRESS}}` — registered address, if any.
6. Confirmed cloud hosting provider name(s) for the privacy policy.
7. Confirmed WhatsApp messaging provider description for the privacy policy.
8. Decision on the contact form backend approach (section 7, item 3).
9. Decision on public pricing (section 5.12).
10. Real testimonials, if any (section 5.11), or a decision to omit.
11. Legal review of the Privacy Policy and Terms.
12. Confirmation of whether any analytics will be added, before launch.

---

## 14. Definition of done / QA checklist

- [ ] `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/data-deletion` render without authentication.
- [ ] `/` no longer redirects to the dashboard. The dashboard remains reachable at `/login` and `/dashboard`.
- [ ] All pages are fully bilingual (EN/AR) with correct RTL layout.
- [ ] Header, footer, and language switcher work on mobile and desktop.
- [ ] Every footer legal link resolves to a real page.
- [ ] "Request access" and "Contact us" actions work and are wired to the chosen backend/flow.
- [ ] Per-page title, meta description, canonical, and Open Graph tags are present.
- [ ] `theme-color` is `#0B0B15`; favicon is present.
- [ ] `robots.txt` and `sitemap.xml` are served; sitemap includes public pages with `hreflang` alternates.
- [ ] All images have alt text, explicit dimensions, and are compressed.
- [ ] Keyboard navigation, focus states, and reduced-motion behavior verified.
- [ ] Contrast checked: gold on dark for large/UI text; no gold body text on light backgrounds.
- [ ] Privacy Policy is reachable at a stable public URL, matches the store submission, and discloses data collection, WhatsApp processing, third-party processors, retention, security, rights, and account deletion.
- [ ] Data Deletion page submits successfully and is referenced from the privacy policy.
- [ ] `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass.
- [ ] Tested at mobile (375px), tablet (768px), and desktop (1440px) widths in both themes.
- [ ] Arabic pages reviewed by a native speaker for tone and correctness.

---

*End of specification.*
