import { defineArrayMember, defineField, defineType } from "sanity";

export const valuePropItemSchema = defineType({
  name: "valuePropItem",
  title: "Value prop",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon (optional SVG upload)",
      type: "image",
      description: "Prefer SVG. Keep simple and monochrome.",
      options: { accept: "image/svg+xml" },
    }),
    defineField({
      name: "title",
      title: "Title (short)",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "body",
      title: "Supporting text (optional)",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "body", media: "icon" },
  },
});

export const valuePropBarSchema = defineType({
  name: "value-prop-bar",
  title: "Value Prop Bar",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Value props",
      description: "3 or 4 short trust signals shown as a horizontal strip.",
      type: "array",
      of: [defineArrayMember({ type: "valuePropItem" })],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      initialValue: "frost",
      options: {
        list: [
          { title: "White", value: "white" },
          { title: "Frost", value: "frost" },
          { title: "Dark blue", value: "dark" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { count: "items.length" },
    prepare: ({ count }) => ({
      title: "Value Prop Bar",
      subtitle: `${count ?? 0} props`,
    }),
  },
});
