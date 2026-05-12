import { cn } from "../../lib/cn";
import { Eyebrow } from "../primitives/eyebrow";

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox"
  | "file";

export type FormField = {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ value: string; label: string }>;
  width?: "full" | "half";
};

export type FormContactInfo = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
};

export type FormBlockProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  contactInfo?: FormContactInfo;
  formType?: "contact" | "quote-request" | "consultation" | "newsletter";
  fields: FormField[];
  submitLabel?: string;
  action?: string;
  destinationEmail: string;
  subjectLine?: string;
  className?: string;
};

const defaultAction = "/api/form-submit";

export function FormBlock({
  eyebrow,
  heading,
  body,
  contactInfo,
  formType = "contact",
  fields,
  submitLabel = "Submit",
  action = defaultAction,
  destinationEmail,
  subjectLine,
  className,
}: FormBlockProps) {
  return (
    <section
      data-block="form"
      className={cn(
        "relative isolate w-full px-gutter-xl py-section-y",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-deep-blue to-obx-blue"
      />

      <div className="mx-auto flex max-w-content flex-wrap items-start gap-xxl">
        <aside className="flex w-full max-w-[360px] flex-col gap-md text-white">
          <div className="flex flex-col gap-xxs">
            {eyebrow && <Eyebrow tone="on-dark">{eyebrow}</Eyebrow>}
            <h2 className="font-heading text-heading-2 font-bold leading-tight text-gold">
              {heading}
            </h2>
          </div>
          {body && <p className="text-base leading-body">{body}</p>}

          {contactInfo && (
            <dl className="mt-base flex flex-col gap-sm text-base leading-body">
              {contactInfo.phone && (
                <div className="flex gap-sm">
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-gold">
                      {contactInfo.phone}
                    </a>
                  </dd>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex gap-sm">
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-gold">
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
              )}
              {contactInfo.address && (
                <div className="flex gap-sm">
                  <dt className="sr-only">Address</dt>
                  <dd className="whitespace-pre-line">{contactInfo.address}</dd>
                </div>
              )}
              {contactInfo.hours && (
                <div className="flex gap-sm">
                  <dt className="sr-only">Hours</dt>
                  <dd className="whitespace-pre-line">{contactInfo.hours}</dd>
                </div>
              )}
            </dl>
          )}
        </aside>

        <form
          action={action}
          method="POST"
          encType="multipart/form-data"
          className="flex min-w-[320px] flex-1 flex-col gap-md rounded-element bg-white p-xl shadow-sm"
        >
          <input type="hidden" name="_formType" value={formType} />
          <input type="hidden" name="_destinationEmail" value={destinationEmail} />
          {subjectLine && (
            <input type="hidden" name="_subjectLine" value={subjectLine} />
          )}

          <div className="flex flex-wrap gap-md">
            {fields.map((field) => (
              <FormFieldRenderer key={field.name} field={field} />
            ))}
          </div>

          <button
            type="submit"
            className="self-start rounded-button border-2 border-obx-blue bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white text-base leading-body hover:bg-deep-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obx-blue focus-visible:ring-offset-2 transition-colors"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

function FormFieldRenderer({ field }: { field: FormField }) {
  const widthClass =
    field.width === "half" ? "flex-1 min-w-[250px]" : "w-full";

  const labelEl = (
    <span className="flex items-center gap-xxs text-base leading-body">
      <span className="font-bold text-dark-blue">{field.label}</span>
      <span className={cn("text-sm", field.required ? "text-orange" : "text-slate")}>
        {field.required ? "(required)" : "(optional)"}
      </span>
    </span>
  );

  const inputBaseClass =
    "w-full rounded-sm border border-slate bg-white px-base py-sm text-base leading-body text-dark-blue placeholder:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obx-blue";

  if (field.type === "textarea") {
    return (
      <label className={cn("flex flex-col gap-xs", widthClass)}>
        {labelEl}
        <textarea
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          rows={4}
          className={cn(inputBaseClass, "min-h-[96px] resize-y")}
        />
        {field.helpText && <span className="text-sm text-slate">{field.helpText}</span>}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className={cn("flex flex-col gap-xs", widthClass)}>
        {labelEl}
        <select
          name={field.name}
          required={field.required}
          defaultValue=""
          className={inputBaseClass}
        >
          <option value="" disabled>
            {field.placeholder ?? "Select an option"}
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {field.helpText && <span className="text-sm text-slate">{field.helpText}</span>}
      </label>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-xs w-full text-base leading-body text-dark-blue">
        <input
          type="checkbox"
          name={field.name}
          required={field.required}
          className="mt-1 size-base rounded-sm border-slate text-obx-blue focus-visible:ring-2 focus-visible:ring-obx-blue"
        />
        <span>
          {field.label}
          {field.required && <span className="ml-xxs text-orange text-sm">(required)</span>}
        </span>
      </label>
    );
  }

  return (
    <label className={cn("flex flex-col gap-xs", widthClass)}>
      {labelEl}
      <input
        name={field.name}
        type={field.type}
        required={field.required}
        placeholder={field.placeholder}
        className={inputBaseClass}
      />
      {field.helpText && <span className="text-sm text-slate">{field.helpText}</span>}
    </label>
  );
}
