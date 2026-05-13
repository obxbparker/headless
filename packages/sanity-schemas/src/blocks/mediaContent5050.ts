import { defineField, defineType } from "sanity";

export const mediaContent5050Schema = defineType({
  name: "media-content-50-50",
  title: "Media Content 50/50",
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
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.max(800),
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "cta",
    }),
    defineField({
      name: "media",
      title: "Image",
      type: "imageWithAlt",
      description: "Optional. When present, block renders as 50/50 split. When absent, content centers full width.",
    }),
    defineField({
      name: "mediaShape",
      title: "Image shape",
      type: "string",
      initialValue: "rectangle",
      hidden: ({ parent }) => !parent?.media,
      options: {
        list: [
          { title: "Rectangle", value: "rectangle" },
          { title: "Circle", value: "circle" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "mediaSide",
      title: "Image side",
      type: "string",
      initialValue: "left",
      hidden: ({ parent }) => !parent?.media,
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "White", value: "white" },
          { title: "Frost (light grey-blue)", value: "frost" },
          { title: "Dark blue", value: "dark" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "divider",
      title: "Show divider below",
      type: "boolean",
      description: "Useful when stacking text-only variants. Defaults: on for text-only, off when an image is present.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "media" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Media Content 50/50",
      subtitle: subtitle ? `${subtitle} — Media Content 50/50` : "Media Content 50/50",
      media,
    }),
  },
});
