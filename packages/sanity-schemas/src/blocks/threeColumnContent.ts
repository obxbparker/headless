import { defineArrayMember, defineField, defineType } from "sanity";

export const threeColumnItemSchema = defineType({
  name: "threeColumnItem",
  title: "Column item",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "imageWithAlt",
      description: "Use either an image or an icon, not both.",
    }),
    defineField({
      name: "icon",
      title: "Icon (optional SVG upload)",
      type: "image",
      description: "Use only when no image is provided. Prefer SVG.",
      options: { accept: "image/svg+xml" },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "href",
      title: "Link (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "image" },
  },
});

export const threeColumnContentSchema = defineType({
  name: "three-column-content",
  title: "3 Column Content",
  type: "object",
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
      title: "Body intro",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "cta",
      title: "Section CTA (optional)",
      type: "cta",
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
          { title: "Dark blue", value: "dark" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "items",
      title: "Columns",
      description: "Exactly 3 items.",
      type: "array",
      of: [defineArrayMember({ type: "threeColumnItem" })],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title || "3 Column Content",
      subtitle: subtitle ? `${subtitle} — 3 Column Content` : "3 Column Content",
    }),
  },
});
