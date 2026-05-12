# Component Inventory

Authoritative list of platform-wide blocks. The AI engine (Phase 2) selects and arranges from this fixed set. New blocks are added platform-wide, not per project.

**Source:** Figma "WEB-TEMPLATE — Examples", frame `4001:6566` ("Homepage 1 — Tech"). Field detail will be refined per-block during Step 4 (component implementation) via `mcp__Figma__get_design_context`.

**Style note:** Figma uses placeholder purple/Inter/Poppins. All blocks render in OBx brand tokens (Dark Blue / OBx Blue / Frost / Orange / Gold / Slate, Roboto) from `packages/ui/src/tokens`.

---

## Naming convention

- **slug** — kebab-case identifier used in Sanity schema names and BlockRegistry keys
- **Variants** — only added when the visual difference materially changes which content type fits (e.g. media-left vs media-right; not "5px taller")

---

## Global / structural

### `template-navigation`
**Figma:** `Template Navigation` (6030:15563), 1440×96
**Purpose:** Top utility bar above main nav. Phone, email, secondary CTAs.
**Fields:**
- `phone` — string (tel link)
- `email` — string (mailto link)
- `secondaryCta` — { label, href } (e.g. "REQUEST QUOTE")
- `visible` — boolean (some clients won't want this)

**Use when:** Service businesses with strong phone/email-driven leads (HVAC, legal, medical, contractors).
**Avoid when:** Pure ecommerce or product-led brands where the main nav already carries the primary CTA.

---

### `main-navigation`
**Figma:** `Navigation - Option A` (4020:12731), 1440×156
**Purpose:** Primary site navigation. Logo + 4–6 links + primary CTA.
**Fields:**
- `logo` — image reference (from site-settings)
- `links` — array of { label, href, children?: { label, href }[] } (one dropdown level)
- `primaryCta` — { label, href }

**Use when:** Every site uses this. Required.
**Variants (future):** Option B (centered logo), Option C (mega-menu) — not in current scope.

---

### `footer-a`
**Figma:** `Footer A` (6021:12142), 1440×532
**Purpose:** Site-wide footer. Logo, address, link columns, legal.
**Fields:**
- `logo` — image reference
- `addressBlock` — { street, city, state, zip, country }
- `linkColumns` — array of { heading, links: { label, href }[] } (2–4 columns)
- `socialLinks` — array of { platform, href }
- `legalText` — rich text (copyright, disclaimers)

**Use when:** Every site uses this. Required.

---

## Hero / above the fold

### `hero-banner`
**Figma:** `Hero Banner` (4001:6567), 1440×600
**Purpose:** Primary above-fold heading + dual CTA + supporting image.
**Fields:**
- `eyebrow` — string (optional, short label)
- `heading` — string (H1, single per page)
- `body` — string (supporting paragraph)
- `primaryCta` — { label, href }
- `secondaryCta` — { label, href } (optional)
- `backgroundImage` — image reference
- `backgroundTreatment` — enum: `image`, `image-dark-overlay`, `solid-dark`

**Use when:** Every page should have one. Required on home and landing pages.
**Avoid when:** Internal/utility pages (privacy, terms) — those use a simpler page header instead (future block).

---

## Content blocks

### `value-prop-bar`
**Figma:** `Value Prop Bar` (4001:6584), 1440×254
**Purpose:** 3–4 column horizontal strip of icon + short label + 1-line description. Communicates pillars at a glance.
**Fields:**
- `items` — array of { icon, label, description } (3 or 4 items)
- `background` — enum: `white`, `frost`, `dark`

**Use when:** Service businesses with 3–4 clear differentiators (e.g. "Licensed", "Insured", "24/7", "Local"). Strong fit for home + landing pages.
**Avoid when:** Content-led brands where prose carries the story better than icon-strips.

---

### `media-content-50-50`
**Figma:** `50 50 Media Content` (4001:6568 + variant 4001:6571), 1440×404 / 1440×728
**Purpose:** Half-image, half-text section. Repeatable for "About", "Process", feature highlights.
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2)
- `body` — rich text
- `cta` — { label, href } (optional)
- `media` — image or video reference
- `mediaShape` — enum: `rectangle`, `circle` (Figma shows both variants)
- `mediaSide` — enum: `left`, `right` (alternate for visual rhythm)

**Use when:** Storytelling sections that need a visual anchor — about, process, key service explanation. Reusable 2–4× per page in alternating sides.
**Avoid when:** A page already has 3+ of these in a row — readers fatigue. Switch to `3-column-content` or `callout` to break rhythm.

---

### `content-carousel-4-column`
**Figma:** `Content Carousel - 4 Column` (4020:12123), 1418×736
**Purpose:** 4-card horizontal carousel. Services, products, case studies.
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2)
- `body` — string (optional intro)
- `items` — array of { image, title, description, href, cta? } (min 4, no max)
- `autoplay` — boolean (default false; respect prefers-reduced-motion)

**Use when:** Client has 4+ comparable offerings (services, locations, case studies) that benefit from horizontal browsing.
**Avoid when:** Client has only 2–3 items — looks under-populated. Use `3-column-content` instead.

---

### `three-column-content`
**Figma:** `3 Column Content` (4001:6577), 1440×702
**Purpose:** Static 3-card grid. Services overview, team highlights, feature summary.
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2)
- `body` — string (optional intro)
- `cta` — { label, href } (optional, section-level)
- `items` — array of { icon?, image?, title, description, href? } (exactly 3)

**Use when:** Exactly 3 items to highlight. Common for "Our Services" overview, "Why Choose Us" pillars.
**Avoid when:** Item count isn't 3 — use carousel for 4+, or a 2-column variant (future) for 2.

---

### `callout`
**Figma:** `Callout` (4020:14669), 1202×540
**Purpose:** Full-bleed colored section breaking content rhythm. Heading + CTA. High visual weight.
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H3 typical; can be H2 on landing pages)
- `body` — string (optional, short)
- `cta` — { label, href } (required — this block exists to drive an action)
- `background` — enum: `obx-blue`, `dark-blue`, `orange`

**Use when:** Page needs a mid-scroll conversion nudge or a visual reset between heavy content sections. Strong fit before FAQ or contact form.
**Avoid when:** Already 2 CTAs on the page above the fold — overuse dilutes them.

---

### `faq`
**Figma:** `FAQ` (4001:6587), 1440×822
**Purpose:** Accordion-style Q&A list. SEO/GEO benefit (FAQPage schema injected automatically).
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2, e.g. "How can we help you today?")
- `items` — array of { question, answer (rich text) } (3–10 items)

**SEO note:** When this block is present on a page, the site-template auto-injects `FAQPage` JSON-LD per CLAUDE.md GEO requirements.

**Use when:** Service pages, landing pages, pricing pages. Almost always beneficial for SEO/GEO.
**Avoid when:** Brand/marketing splash pages where questions would break the tone.

---

### `gallery`
**Figma:** `Gallery` (6001:18422), 1440×403
**Purpose:** Thumbnail strip (6 visible at desktop) with pagination. Project portfolios, recent work, location photos.
**Fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2, optional)
- `images` — array of { image, alt, caption?, href? } (min 6)
- `layout` — enum: `strip` (current), `grid` (future)

**Use when:** Client has 6+ visual proof points (project photos, before/afters, gallery of work).
**Avoid when:** Fewer than 6 images — looks sparse. Use `3-column-content` with image items.

---

### `form`
**Figma:** `Form` (4020:12830), 1440×825
**Purpose:** Lead-capture / contact form. Heading + intro + fields + submit. Often paired with location/contact info.

**Submission pipeline (Phase 1):**
Browser → per-site Cloudflare Worker (`/api/form-submit`) → client's SMTP server → client inbox.
- Cloudflare Turnstile token validated server-side before SMTP send.
- SMTP credentials live in **Cloudflare Worker env vars** (set per-site during `spawn-site`), never in Sanity or the repo:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - `TURNSTILE_SECRET`
- Worker logs success/fail counts to Cloudflare Analytics; no persistent submission store in Phase 1 (add KV/D1 later if needed).

**Sanity fields:**
- `eyebrow` — string (optional)
- `heading` — string (H2)
- `body` — string (intro paragraph)
- `contactInfo` — { address?, phone?, email?, hours? } (left rail when present)
- `formType` — enum: `contact`, `quote-request`, `consultation`, `newsletter`
- `fields` — array of { name, label, type, required?, options? } (configurable per project)
- `submitLabel` — string
- `successMessage` — string
- `destinationEmail` — string (the "to:" address — **not a secret**, safe to live in Sanity)
- `subjectLine` — string (optional override; default: `"New {formType} submission from {siteName}"`)

**Use when:** Every site needs at least one. Contact page always. Often duplicated on service pages as a "quote-request" variant.
**Avoid when:** Page already has a `callout` driving to a dedicated contact page — don't compete with itself.

---

## Block registry (planned)

`packages/ui/src/components/blocks/index.ts` will export:

```ts
export const BlockRegistry = {
  "template-navigation": TemplateNavigation,
  "main-navigation": MainNavigation,
  "hero-banner": HeroBanner,
  "value-prop-bar": ValuePropBar,
  "media-content-50-50": MediaContent5050,
  "content-carousel-4-column": ContentCarousel4Col,
  "three-column-content": ThreeColumnContent,
  "callout": Callout,
  "faq": FAQ,
  "gallery": Gallery,
  "form": Form,
  "footer-a": FooterA,
} as const;
```

AI selection metadata lives at `packages/ui/src/metadata/selection.ts` (one entry per slug, `useWhen` + `avoidWhen` strings copied from this file).

---

## Build order

For Step 9 end-to-end validation, prioritize:

1. **`hero-banner`** — every page needs one
2. **`media-content-50-50`** — most reusable content block
3. **`three-column-content`** — services overview
4. **`callout`** — proves CTA pattern works
5. **`form`** — proves form submission pattern works

Once these 5 ship through Sanity → site-template → Cloudflare staging, the rest can be built in batches.

---

## Decisions locked in (2026-05-11)

- **Mobile layouts:** inferred from Tailwind default breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). No designer mobile frames; components are responsive by construction.
- **Figma source:** the current template is a generic starting point — **not** built for this project. Treat it as the structural reference for MVP, not the long-term design system. A canonical library page does not exist; component variants will be defined here in `COMPONENT_INVENTORY.md` as the platform matures.
- **Form submission backend:** per-site Cloudflare Worker → client SMTP (see `form` block above for env-var contract).
