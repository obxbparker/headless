import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";
import { Eyebrow } from "../primitives/eyebrow";

export type CalloutBackground = "obx-blue" | "dark-blue" | "orange" | "deep-blue";

export type CalloutProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  background?: CalloutBackground;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const bgClasses: Record<CalloutBackground, string> = {
  "obx-blue": "bg-obx-blue",
  "dark-blue": "bg-dark-blue",
  orange: "bg-orange",
  "deep-blue": "bg-deep-blue",
};

export function Callout({
  eyebrow,
  heading,
  body,
  cta,
  secondaryCta,
  background = "obx-blue",
  headingLevel = "h3",
  className,
}: CalloutProps) {
  const HeadingTag = headingLevel;
  const headingSizeClass =
    headingLevel === "h2" ? "text-heading-2" : "text-heading-3";

  return (
    <section
      data-block="callout"
      className={cn("relative w-full px-gutter-xl py-section-y", className)}
    >
      <div
        className={cn(
          "mx-auto flex max-w-content flex-col items-center gap-md rounded-element p-xxl text-center text-white",
          bgClasses[background],
        )}
      >
        <div className="flex w-full max-w-body flex-col items-center gap-base">
          {(eyebrow || heading) && (
            <div className="flex w-full flex-col items-center gap-xxs">
              {eyebrow && <Eyebrow tone="on-dark">{eyebrow}</Eyebrow>}
              <HeadingTag
                className={cn(
                  "font-heading font-bold leading-tight text-gold",
                  headingSizeClass,
                )}
              >
                {heading}
              </HeadingTag>
            </div>
          )}
          {body && <p className="text-base leading-body">{body}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-md">
          <Button href={cta.href} variant="secondary" tone="on-dark">
            {cta.label}
          </Button>
          {secondaryCta && (
            <Button href={secondaryCta.href} variant="outline" tone="on-dark">
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
