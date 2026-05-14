import { defineArrayMember, defineField, defineType } from "sanity";

export const contentCarouselItemSchema = defineType({
  name: "contentCarouselItem",
  title: "Carousel item",
  type: "object",
  fields: [
    defineField({
      name: "media",
      title: "Image",
      type: "imageWithAlt",
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
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "href",
      title: "Link (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "media" },
  },
});

export const contentCarousel4ColumnSchema = defineType({
  name: "content-carousel-4-column",
  title: "4-Column Content Carousel",
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
      title: "Cards",
      description: "Renders 4 across on desktop, scroll-snaps horizontally on mobile.",
      type: "array",
      of: [defineArrayMember({ type: "contentCarouselItem" })],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
  preview: {
    select: { title: "heading", count: "items.length" },
    prepare: ({ title, count }) => ({
      title: title || "4-Column Content Carousel",
      subtitle: `${count ?? 0} cards`,
    }),
  },
});
