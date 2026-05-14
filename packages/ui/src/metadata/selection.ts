import type { BlockSlug } from "../components/blocks";

export type BlockSelectionMetadata = {
  useWhen: string;
  avoidWhen: string;
  required?: boolean;
};

export const blockSelection: Partial<Record<BlockSlug, BlockSelectionMetadata>> = {
  "hero-banner": {
    useWhen:
      "Every page should have one hero block above the fold. Required on home and landing pages. Primary heading drives SEO H1.",
    avoidWhen:
      "Internal/utility pages (privacy, terms) — use a simpler page header instead (future block).",
    required: true,
  },
  "value-prop-bar": {
    useWhen:
      "Directly under the hero on home and landing pages — quick scan of 3–4 trust signals or differentiators (years in business, certifications, response time, guarantee). Compact, single row.",
    avoidWhen:
      "More than 4 props to communicate — use three-column-content or content-carousel-4-column instead so each gets real space.",
  },
  "media-content-50-50": {
    useWhen:
      "Storytelling sections that need a visual anchor — about, process, key service explanation. Reusable 2-4x per page in alternating sides.",
    avoidWhen:
      "A page already has 3+ of these in a row — readers fatigue. Switch to three-column-content or callout to break rhythm.",
  },
  "three-column-content": {
    useWhen:
      "Exactly 3 items to highlight. Common for 'Our Services' overview, 'Why Choose Us' pillars, team highlights.",
    avoidWhen:
      "Item count isn't 3 — use carousel for 4+, or a 2-column variant (future) for 2.",
  },
  "content-carousel-4-column": {
    useWhen:
      "4 or more items of similar weight — service lineup, project gallery preview, related articles. Mobile becomes a horizontal scroller; desktop is a 4-up grid.",
    avoidWhen:
      "Only 2–3 items — use three-column-content or media-content-50-50 so each item gets fuller treatment.",
  },
  gallery: {
    useWhen:
      "Project portfolios, before/after sets, team headshots, location photography. Best on dedicated portfolio/about pages where image-first storytelling drives the page.",
    avoidWhen:
      "Service overview pages — readers need explanatory copy more than image weight there.",
  },
  callout: {
    useWhen:
      "Page needs a mid-scroll conversion nudge or a visual reset between heavy content sections. Strong fit before FAQ or contact form.",
    avoidWhen:
      "Already 2 CTAs on the page above the fold — overuse dilutes them.",
  },
  faq: {
    useWhen:
      "Service detail pages, landing pages, and any page where prospects have common objections to surface. Auto-emits FAQPage JSON-LD for GEO/SEO.",
    avoidWhen:
      "Pages with fewer than 3 strong Q/A pairs — a thin FAQ underperforms; fold the answers into body copy instead.",
  },
  form: {
    useWhen:
      "Every site needs at least one. Contact page always. Often duplicated on service pages as a 'quote-request' variant.",
    avoidWhen:
      "Page already has a callout driving to a dedicated contact page — don't compete with itself.",
    required: true,
  },
};
