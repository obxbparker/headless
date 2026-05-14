/**
 * Compact block catalogue passed to the model. Kept in this package as the
 * single source of truth for "what the AI needs to know" — fields, constraints,
 * and when to use each block. Mirrors packages/sanity-schemas/src/blocks and
 * packages/ui/src/metadata/selection.ts; update both when blocks change.
 */
export const blockCatalogue = `# Block catalogue

Every block emits an object with a \`_type\` field (the block slug) plus fields listed below.
Nested item arrays use their own \`_type\` (e.g. valuePropItem, threeColumnItem).
Do NOT include \`_key\` fields — the writer adds those automatically.

## Shared object shapes

- cta: { label: string (max 40), href: string }
  - href: internal "/..." | external "https://..." | "tel:..." | "mailto:..."
- imageWithAlt: { sourceUrl: string, alt: string }
  - sourceUrl MUST be one of the client-supplied assetUrls (or omit the whole field if none fit).
  - alt is required when sourceUrl is set. Describe the subject in plain English.

## Blocks

### hero-banner  (required on most pages; supplies the page H1)
- eyebrow?: string (max 40)
- heading: string (required, max 120) — the page H1
- body?: string (max 400)
- primaryCta?: cta
- secondaryCta?: cta
- media?: imageWithAlt
- backgroundTreatment: "image" | "image-dark-overlay" | "solid-dark" (required)
- align: "center" | "left" (required)
Use when: every page has one hero above the fold. Use "solid-dark" when no suitable image; "image-dark-overlay" is the default when an image is supplied.
Avoid when: utility pages (privacy, terms).

### value-prop-bar  (compact trust-signal strip)
- items: valuePropItem[] (2-4 required)
- background?: "white" | "frost" | "dark"
valuePropItem: { title: string (max 60), body?: string (max 120) }
Use when: directly under the hero on home/landing pages. 3-4 short trust signals (years in business, certifications, response time, guarantee).
Avoid when: more than 4 props — use three-column-content instead.

### media-content-50-50  (storytelling section, optional image)
- eyebrow?: string (max 40)
- heading: string (required, max 120)
- body?: string (max 800)
- cta?: cta
- media?: imageWithAlt
- mediaShape?: "rectangle" | "circle"  (only if media set)
- mediaSide?: "left" | "right"          (only if media set)
- background?: "white" | "frost" | "dark"
- divider?: boolean
Use when: about, process, key service explanation. Reusable 2-4x per page with alternating mediaSide.
Avoid when: a page already has 3+ in a row — switch rhythm with three-column-content or callout.

### three-column-content  (exactly 3 items)
- eyebrow?: string (max 40)
- heading?: string (max 120)
- body?: string (max 400)
- cta?: cta
- background?: "white" | "frost" | "dark"
- items: threeColumnItem[] (REQUIRED — exactly 3)
threeColumnItem: { title: string (max 80), description?: string (max 300), href?: string, image?: imageWithAlt }
Use when: Our Services overview, Why Choose Us pillars, team highlights — anything with exactly 3 items.
Avoid when: not exactly 3 items — use content-carousel-4-column for 4+.

### content-carousel-4-column  (4+ items of similar weight)
- eyebrow?: string (max 40)
- heading?: string (max 120)
- body?: string (max 400)
- cta?: cta
- background?: "white" | "frost" | "dark"
- items: contentCarouselItem[] (min 2)
contentCarouselItem: { title: string (max 80), description?: string (max 240), href?: string, media?: imageWithAlt }
Use when: service lineups, project gallery preview, related articles. 4+ items.
Avoid when: only 2-3 items — use three-column-content or media-content-50-50.

### gallery  (image-first showcase)
- eyebrow?: string (max 40)
- heading?: string (max 120)
- body?: string (max 400)
- layout?: "grid-2" | "grid-3" | "grid-4"
- background?: "white" | "frost" | "dark"
- items: galleryItem[] (min 2)
galleryItem: { image: imageWithAlt (REQUIRED), caption?: string (max 160) }
Use when: project portfolios, before/after, team headshots, location photography. Dedicated portfolio/about pages.
Avoid when: service overview pages — readers need explanatory copy more than image weight.

### callout  (mid-scroll conversion nudge)
- eyebrow?: string (max 40)
- heading: string (required, max 120)
- body?: string (max 300)
- cta: cta (REQUIRED)
- secondaryCta?: cta
- background: "obx-blue" | "dark-blue" | "deep-blue" | "orange" (required)
- headingLevel?: "h2" | "h3"
Use when: page needs a mid-scroll CTA or a visual reset between heavy content sections. Strong fit before FAQ or contact form.
Avoid when: already 2 CTAs on the page above the fold.

### faq  (Q&A — auto-emits FAQPage JSON-LD)
- eyebrow?: string (max 40)
- heading?: string (max 120)
- body?: string (max 400)
- background?: "white" | "frost"
- items: faqItem[] (min 1, target 4-6 strong Q/A pairs)
faqItem: { question: string (max 160, required), answer: string (max 800, required) }
Use when: service detail pages, landing pages, anywhere with common prospect objections. Always include on home page if 4+ questions are obvious.
Avoid when: fewer than 3 strong Q/A pairs — fold answers into body copy instead.

### form  (contact / quote-request)
- eyebrow?: string (max 40)
- heading: string (required, max 120)
- body?: string (max 400)
- contactInfo?: { phone?: string, email?: string, address?: string, hours?: string }
- formType: "contact" | "quote-request" | "consultation" | "newsletter" (required)
- destinationEmail: string (required — use the business email from intake)
- subjectLine?: string
- submitLabel?: string (defaults to "Send message")
- fields: formField[] (min 1, REQUIRED)
formField:
  - name: string (lowerCamelCase, required)
  - label: string (max 60, required)
  - type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "file" (required)
  - required?: boolean
  - placeholder?: string
  - helpText?: string
  - width?: "full" | "half"
  - options?: { value: string, label: string }[]  (only when type=select)
Use when: every site needs at least one. Contact page always. Often duplicated on service pages.
Avoid when: page already has a callout linking to a dedicated contact page.

## SEO + GEO

Every page emits an \`seo\` object:
- title: string (required, 50-60 chars ideal, max 70)
- description: string (required, 140-160 chars ideal, max 180)
- jsonLdType?: "Default" | "LocalBusiness" | "Service" | "Article" | "FAQPage"
  - Home page of a local service business: "LocalBusiness"
  - Service detail pages: "Service"
  - Blog/article: "Article"
  - FAQPage is auto-emitted when a faq block is present; you can still set this for FAQ-heavy pages.
  - Otherwise omit or use "Default"
`;
