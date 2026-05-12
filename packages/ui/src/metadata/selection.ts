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
  callout: {
    useWhen:
      "Page needs a mid-scroll conversion nudge or a visual reset between heavy content sections. Strong fit before FAQ or contact form.",
    avoidWhen:
      "Already 2 CTAs on the page above the fold — overuse dilutes them.",
  },
  form: {
    useWhen:
      "Every site needs at least one. Contact page always. Often duplicated on service pages as a 'quote-request' variant.",
    avoidWhen:
      "Page already has a callout driving to a dedicated contact page — don't compete with itself.",
    required: true,
  },
};
