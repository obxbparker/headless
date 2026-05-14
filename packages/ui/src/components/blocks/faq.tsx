import { cn } from "../../lib/cn";
import { Eyebrow } from "../primitives/eyebrow";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqBackground = "white" | "frost";

export type FaqProps = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  items: FaqItem[];
  background?: FaqBackground;
  className?: string;
};

const bgClasses: Record<FaqBackground, string> = {
  white: "bg-white",
  frost: "bg-frost",
};

export function Faq({
  eyebrow,
  heading,
  body,
  items,
  background = "white",
  className,
}: FaqProps) {
  return (
    <section
      data-block="faq"
      className={cn(
        "relative w-full px-gutter-xl py-section-y",
        bgClasses[background],
        className,
      )}
    >
      <div className="mx-auto flex max-w-content flex-col gap-xl lg:flex-row lg:gap-xxl">
        <header className="flex flex-col gap-md lg:w-1/3 lg:sticky lg:top-xxl lg:self-start">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {heading && (
            <h2 className="font-heading text-heading-2 font-bold leading-tight text-dark-blue">
              {heading}
            </h2>
          )}
          {body && <p className="text-base leading-body text-slate">{body}</p>}
        </header>

        <ul className="flex w-full flex-col gap-sm list-none p-0 m-0 lg:w-2/3">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="rounded-element border border-dark-blue/10 bg-white"
            >
              <details className="group">
                <summary
                  className={cn(
                    "flex cursor-pointer items-start justify-between gap-md p-md font-heading text-heading-5 font-bold leading-tight text-dark-blue marker:hidden [&::-webkit-details-marker]:hidden",
                    "hover:text-obx-blue transition-colors",
                  )}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-xxs inline-flex size-md shrink-0 items-center justify-center rounded-full bg-frost text-dark-blue transition-transform group-open:rotate-45 group-open:bg-orange group-open:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="size-sm" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="px-md pb-md text-base leading-body text-slate">
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Build the FAQPage JSON-LD payload from a list of FAQ items.
 * Site templates inject this into `<head>` when an FAQ block is present
 * (CLAUDE.md GEO requirement).
 */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
