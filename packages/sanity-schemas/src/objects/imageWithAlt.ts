import { defineField, defineType } from "sanity";

export const imageWithAltSchema = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe the image for screen readers and search engines. Leave empty only if the image is purely decorative.",
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as { _type?: string } | undefined;
          if (parent && !alt) {
            return "Alt text is required unless this image is decorative";
          }
          return true;
        }),
    }),
  ],
});
