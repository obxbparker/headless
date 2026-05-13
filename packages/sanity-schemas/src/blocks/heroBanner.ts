import { defineField, defineType } from "sanity";

export const heroBannerSchema = defineType({
  name: "hero-banner",
  title: "Hero Banner",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Short label above the heading. Optional.",
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "heading",
      title: "Heading (H1)",
      type: "string",
      description: "The primary headline for the page. Only one H1 per page.",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
    }),
    defineField({
      name: "media",
      title: "Background image",
      type: "imageWithAlt",
      description: "Used when background treatment is image or image-dark-overlay.",
    }),
    defineField({
      name: "backgroundTreatment",
      title: "Background treatment",
      type: "string",
      initialValue: "image-dark-overlay",
      options: {
        list: [
          { title: "Image (no overlay)", value: "image" },
          { title: "Image with dark overlay", value: "image-dark-overlay" },
          { title: "Solid dark blue", value: "solid-dark" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "align",
      title: "Content alignment",
      type: "string",
      initialValue: "center",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "media" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Hero Banner",
      subtitle: subtitle ? `${subtitle} — Hero Banner` : "Hero Banner",
      media,
    }),
  },
});
