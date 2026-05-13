import { defineField, defineType } from "sanity";

export const seoSchema = defineType({
  name: "seo",
  title: "SEO + GEO",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "title",
      title: "Title tag",
      type: "string",
      description: "Shows in browser tabs and search results. Aim for 50–60 characters.",
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Search-result snippet. Aim for 140–160 characters.",
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "canonicalPath",
      title: "Canonical path (optional)",
      type: "string",
      description: "Override the canonical URL path. Leave blank to use the page slug.",
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "imageWithAlt",
      description: "1200×630 recommended. Used for Open Graph / Twitter cards.",
    }),
    defineField({
      name: "jsonLdType",
      title: "JSON-LD structured data type",
      type: "string",
      initialValue: "Default",
      description: "Drives the structured data emitted in <head>. FAQPage is injected automatically when an FAQ block is present.",
      options: {
        list: [
          { title: "Default (WebPage)", value: "Default" },
          { title: "LocalBusiness", value: "LocalBusiness" },
          { title: "Service", value: "Service" },
          { title: "Article", value: "Article" },
          { title: "FAQPage", value: "FAQPage" },
        ],
      },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
      description: "Emits noindex,nofollow when on. Use for utility pages, drafts, thank-you pages.",
    }),
  ],
});
