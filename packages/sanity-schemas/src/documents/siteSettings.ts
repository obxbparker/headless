import { defineArrayMember, defineField, defineType } from "sanity";

const navLinkObject = defineArrayMember({
  type: "object",
  name: "navLink",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "href",
      type: "string",
      description:
        "Internal links start with /, external with https://, phone with tel:, email with mailto:.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description:
    "Singleton — only one of these per project. Drives header, footer, llms.txt, default metadata.",
  groups: [
    { name: "business", title: "Business", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "metadata", title: "Metadata + GEO" },
  ],
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      group: "business",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "One-line tagline",
      type: "string",
      group: "business",
      description: "Used in default meta descriptions, llms.txt, and the footer.",
    }),
    defineField({
      name: "logo",
      title: "Logo (light backgrounds)",
      type: "imageWithAlt",
      group: "business",
    }),
    defineField({
      name: "logoOnDark",
      title: "Logo (dark backgrounds)",
      type: "imageWithAlt",
      group: "business",
      description: "Optional reverse/white logo for use on the footer or dark hero.",
    }),
    defineField({
      name: "primaryUrl",
      title: "Primary site URL",
      type: "string",
      group: "business",
      description: "https://www.example.com — used to construct canonical URLs.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactInfo",
      title: "Contact info",
      type: "object",
      group: "business",
      fields: [
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "address", type: "text", rows: 3 }),
        defineField({ name: "hours", type: "text", rows: 3 }),
      ],
    }),

    // --- Navigation ---
    defineField({
      name: "mainNav",
      title: "Main navigation",
      type: "object",
      group: "navigation",
      fields: [
        defineField({
          name: "links",
          title: "Nav links",
          type: "array",
          of: [navLinkObject],
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA (right side)",
          type: "cta",
        }),
      ],
    }),
    defineField({
      name: "utilityBar",
      title: "Utility bar (top strip)",
      type: "object",
      group: "navigation",
      description:
        "Thin dark strip above the main nav. Uses phone/email from Contact info unless overridden here.",
      fields: [
        defineField({
          name: "secondaryCta",
          title: "Secondary CTA (right side)",
          type: "cta",
        }),
      ],
    }),

    // --- Footer ---
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({
          name: "columns",
          title: "Link columns",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "footerColumn",
              fields: [
                defineField({
                  name: "heading",
                  type: "string",
                  validation: (Rule) => Rule.required().max(40),
                }),
                defineField({
                  name: "links",
                  type: "array",
                  of: [navLinkObject],
                  validation: (Rule) => Rule.min(1),
                }),
              ],
              preview: {
                select: { title: "heading", count: "links.length" },
                prepare: ({ title, count }) => ({
                  title: title || "Column",
                  subtitle: `${count ?? 0} links`,
                }),
              },
            }),
          ],
        }),
        defineField({
          name: "legalText",
          title: "Legal / copyright line",
          type: "string",
          description:
            "Optional. Defaults to '© {year} {businessName}. All rights reserved.'",
        }),
      ],
    }),

    // --- Social + metadata ---
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: [
                  "facebook",
                  "instagram",
                  "linkedin",
                  "x",
                  "youtube",
                  "tiktok",
                  "google-business",
                ].map((p) => ({ title: p, value: p })),
              },
            }),
            defineField({
              name: "href",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "llmsTxt",
      title: "llms.txt body",
      type: "text",
      rows: 8,
      group: "metadata",
      description:
        "Plain-language site summary served at /llms.txt for AI indexing. Include: who you are, services, locations, contact.",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "metadata",
      description: "Fallback title/description/og used when a page doesn't supply its own.",
    }),
  ],
  preview: {
    select: { title: "businessName", subtitle: "primaryUrl" },
  },
});
