import { defineField, defineType, type SchemaTypeDefinition } from "sanity";

const intakeSchema = defineType({
  name: "intake",
  title: "Client intake",
  type: "document",
  description: "Submission from the portal intake form. Feeds the Phase 2 AI engine.",
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
    }),
    defineField({
      name: "primaryDomain",
      title: "Primary domain",
      type: "string",
    }),
    defineField({
      name: "primaryContact",
      title: "Primary contact (internal PM)",
      type: "string",
    }),
    defineField({
      name: "targetAudience",
      title: "Target audience",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tone",
      title: "Brand tone",
      type: "string",
    }),
    defineField({
      name: "toneNotes",
      title: "Tone notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "differentiators",
      title: "Differentiators / proof points",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "serviceAreas",
      title: "Service areas / locations",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "existingCopy",
      title: "Existing copy",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "assetUrls",
      title: "Asset URLs",
      type: "array",
      of: [{ type: "url", validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }) }],
    }),
    defineField({
      name: "sitemap",
      title: "Sitemap (raw)",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In review", value: "in-review" },
          { title: "Ready for AI", value: "ready-for-ai" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "businessName",
      subtitle: "industry",
      status: "status",
    },
    prepare: ({ title, subtitle, status }) => ({
      title: title || "Untitled intake",
      subtitle: [subtitle, status].filter(Boolean).join(" — "),
    }),
  },
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});

export const schemaTypes: SchemaTypeDefinition[] = [intakeSchema];
