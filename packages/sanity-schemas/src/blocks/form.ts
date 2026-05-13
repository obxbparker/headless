import { defineArrayMember, defineField, defineType } from "sanity";

export const formFieldSchema = defineType({
  name: "formField",
  title: "Form field",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Field name (technical)",
      type: "string",
      description: "Identifier sent in the submission payload. lowerCamelCase, e.g. firstName, phoneNumber.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z][a-zA-Z0-9]*$/, {
          name: "lowerCamelCase",
          invert: false,
        }),
    }),
    defineField({
      name: "label",
      title: "Field label (visible)",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "type",
      title: "Field type",
      type: "string",
      initialValue: "text",
      options: {
        list: [
          { title: "Text (single line)", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "tel" },
          { title: "Textarea (multi-line)", value: "textarea" },
          { title: "Select (dropdown)", value: "select" },
          { title: "Checkbox", value: "checkbox" },
          { title: "File upload", value: "file" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Required?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder text",
      type: "string",
    }),
    defineField({
      name: "helpText",
      title: "Help text (shown below the field)",
      type: "string",
    }),
    defineField({
      name: "width",
      title: "Field width",
      type: "string",
      initialValue: "full",
      options: {
        list: [
          { title: "Full row", value: "full" },
          { title: "Half row (pairs with another half)", value: "half" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "options",
      title: "Options (for select fields)",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "select",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "name", type: "type" },
    prepare: ({ title, subtitle, type }) => ({
      title: title || "Form field",
      subtitle: `${subtitle} (${type})`,
    }),
  },
});

export const formContactInfoSchema = defineType({
  name: "formContactInfo",
  title: "Contact info (form rail)",
  type: "object",
  fields: [
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Line breaks are preserved.",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "text",
      rows: 3,
      description: "Line breaks are preserved.",
    }),
  ],
});

export const formSchema = defineType({
  name: "form",
  title: "Form",
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
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "contactInfo",
      title: "Contact info (left rail)",
      type: "formContactInfo",
    }),
    defineField({
      name: "formType",
      title: "Form type",
      type: "string",
      initialValue: "contact",
      description: "Used in the email subject and for routing in the Worker.",
      options: {
        list: [
          { title: "Contact", value: "contact" },
          { title: "Quote request", value: "quote-request" },
          { title: "Consultation", value: "consultation" },
          { title: "Newsletter", value: "newsletter" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [defineArrayMember({ type: "formField" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "destinationEmail",
      title: "Destination email",
      type: "string",
      description:
        "Where submissions are emailed. Not a secret. SMTP credentials live in Cloudflare Worker env vars, not here.",
      validation: (Rule) =>
        Rule.required().email().error("A valid email is required for routing form submissions."),
    }),
    defineField({
      name: "subjectLine",
      title: "Email subject line (optional override)",
      type: "string",
      description:
        "Defaults to 'New {formType} submission from {siteName}' if left blank.",
    }),
    defineField({
      name: "submitLabel",
      title: "Submit button label",
      type: "string",
      initialValue: "Send message",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "formType" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Form",
      subtitle: `Form (${subtitle ?? "contact"})`,
    }),
  },
});
