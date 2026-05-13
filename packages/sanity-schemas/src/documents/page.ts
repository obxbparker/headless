import { defineArrayMember, defineField, defineType } from "sanity";
import { blockTypeNames } from "../blocks";

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Shown in Studio. Not rendered on the public page (the hero heading is the H1).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "Use 'home' for the homepage. Otherwise the URL path, e.g. 'about', 'services/roofing'.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\/]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Page content",
      type: "array",
      description: "Drag blocks to reorder. The first block on every page should typically be a Hero Banner.",
      of: blockTypeNames.map((name) => defineArrayMember({ type: name })),
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO + GEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled page",
      subtitle: subtitle ? `/${subtitle}` : "(no slug)",
    }),
  },
});
