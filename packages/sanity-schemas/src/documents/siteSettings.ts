import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "Singleton — only one of these per project. Drives header, footer, llms.txt, default metadata.",
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "One-line tagline",
      type: "string",
      description: "Used in default meta descriptions and llms.txt.",
    }),
    defineField({
      name: "logo",
      title: "Logo (light backgrounds)",
      type: "imageWithAlt",
    }),
    defineField({
      name: "logoOnDark",
      title: "Logo (dark backgrounds)",
      type: "imageWithAlt",
      description: "Optional reverse/white logo for use on the footer or dark hero.",
    }),
    defineField({
      name: "primaryUrl",
      title: "Primary site URL",
      type: "string",
      description: "https://www.example.com — used to construct canonical URLs.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactInfo",
      title: "Contact info",
      type: "object",
      fields: [
        defineField({ name: "phone", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "address", type: "text", rows: 3 }),
        defineField({ name: "hours", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
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
      description:
        "Plain-language site summary served at /llms.txt for AI indexing. Include: who you are, services, locations, contact.",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      description: "Fallback title/description/og used when a page doesn't supply its own.",
    }),
  ],
  preview: {
    select: { title: "businessName", subtitle: "primaryUrl" },
  },
});
