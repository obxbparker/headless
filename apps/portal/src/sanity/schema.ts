import { defineField, defineType, type SchemaTypeDefinition } from "sanity";

const clientProjectSchema = defineType({
  name: "clientProject",
  title: "Client project",
  type: "document",
  description:
    "Per-client registry: where the AI engine writes generated content. Create one per client after spawning the site.",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      description: "Must match the `clients/<slug>` folder + Cloudflare Pages project name.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9-]+$/, { name: "lowercase-kebab" }),
    }),
    defineField({
      name: "displayName",
      title: "Display name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sanityProjectId",
      title: "Target Sanity project ID",
      type: "string",
      description: "The client's own Sanity project ID. AI-generated content gets written here.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sanityDataset",
      title: "Target Sanity dataset",
      type: "string",
      initialValue: "production",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sanityApiVersion",
      title: "Target Sanity API version",
      type: "string",
      initialValue: "2026-05-14",
    }),
    defineField({
      name: "sanityWriteToken",
      title: "Target Sanity write token (SENSITIVE)",
      type: "string",
      description:
        "Editor-role token generated at sanity.io/manage/project/<id>/api/tokens. Read by /api/generate only. The portal is gated by Cloudflare Access — do not share this Studio URL outside @outerbox.com.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pagesProjectName",
      title: "Cloudflare Pages project name",
      type: "string",
    }),
    defineField({
      name: "primaryUrl",
      title: "Deployed URL",
      type: "string",
      description: "e.g. https://<slug>.pages.dev (or the custom domain once wired).",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "displayName", subtitle: "slug", primaryUrl: "primaryUrl" },
    prepare: ({ title, subtitle, primaryUrl }) => ({
      title: title || subtitle || "Untitled client",
      subtitle: primaryUrl ? `${subtitle} · ${primaryUrl}` : subtitle,
    }),
  },
});

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
      name: "targetClient",
      title: "Target client",
      type: "reference",
      to: [{ type: "clientProject" }],
      description:
        "Which client project the AI engine should write into. Required before you can hit Generate.",
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
          { title: "Generating…", value: "generating" },
          { title: "Generated", value: "generated" },
          { title: "Generation failed", value: "generation-failed" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "generatedAt",
      title: "Generated at",
      type: "datetime",
      readOnly: true,
      description: "Set by /api/generate when generation succeeds.",
    }),
    defineField({
      name: "generationError",
      title: "Last generation error",
      type: "text",
      rows: 3,
      readOnly: true,
      description: "Populated when generation fails. Cleared on next successful run.",
    }),
    defineField({
      name: "generatedReport",
      title: "Last generation report",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "pagesWritten", type: "number" }),
        defineField({ name: "tokensIn", type: "number" }),
        defineField({ name: "tokensOut", type: "number" }),
        defineField({ name: "cacheReads", type: "number" }),
        defineField({ name: "assetsUploaded", type: "number" }),
        defineField({ name: "durationMs", type: "number" }),
      ],
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

export const schemaTypes: SchemaTypeDefinition[] = [intakeSchema, clientProjectSchema];
