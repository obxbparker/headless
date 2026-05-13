import { defineField, defineType } from "sanity";

export const calloutSchema = defineType({
  name: "callout",
  title: "Callout",
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
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "body",
      title: "Body (short)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "cta",
      title: "Primary CTA",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
    }),
    defineField({
      name: "background",
      title: "Background colour",
      type: "string",
      initialValue: "obx-blue",
      options: {
        list: [
          { title: "OBx Blue", value: "obx-blue" },
          { title: "Dark Blue", value: "dark-blue" },
          { title: "Deep Blue", value: "deep-blue" },
          { title: "Orange", value: "orange" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingLevel",
      title: "Heading level",
      type: "string",
      initialValue: "h3",
      description: "H2 when this is the primary heading on the page; H3 when nested under another section.",
      options: {
        list: [
          { title: "H2 (page-primary)", value: "h2" },
          { title: "H3 (section)", value: "h3" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", background: "background" },
    prepare: ({ title, subtitle, background }) => ({
      title: title || "Callout",
      subtitle: `${subtitle ? subtitle + " — " : ""}Callout (${background ?? "obx-blue"})`,
    }),
  },
});
