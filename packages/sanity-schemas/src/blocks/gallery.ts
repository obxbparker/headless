import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryItemSchema = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: { title: "caption", media: "image" },
    prepare: ({ title, media }) => ({
      title: title || "Untitled image",
      media,
    }),
  },
});

export const gallerySchema = defineType({
  name: "gallery",
  title: "Gallery",
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
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "grid-3",
      options: {
        list: [
          { title: "2 columns", value: "grid-2" },
          { title: "3 columns", value: "grid-3" },
          { title: "4 columns", value: "grid-4" },
        ],
        layout: "radio",
      },
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
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "galleryItem" })],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
  preview: {
    select: { title: "heading", count: "items.length" },
    prepare: ({ title, count }) => ({
      title: title || "Gallery",
      subtitle: `Gallery — ${count ?? 0} images`,
    }),
  },
});
