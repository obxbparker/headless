import { defineArrayMember, defineField, defineType } from "sanity";

export const faqItemSchema = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(800),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});

export const faqSchema = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  description:
    "Auto-emits FAQPage JSON-LD on any page that includes this block. Use 3+ items for SEO/GEO value.",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading (H2)",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "body",
      title: "Intro body",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      initialValue: "white",
      options: {
        list: [
          { title: "White", value: "white" },
          { title: "Frost", value: "frost" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "heading", count: "items.length" },
    prepare: ({ title, count }) => ({
      title: title || "FAQ",
      subtitle: `FAQ — ${count ?? 0} questions`,
    }),
  },
});
