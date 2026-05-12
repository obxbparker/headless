import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";
import { Eyebrow } from "../primitives/eyebrow";

export type ThreeColumnContentBackground = "white" | "frost" | "dark";

export type ThreeColumnItem = {
  icon?: ReactNode;
  image?: ReactNode;
  title: string;
  description?: string;
  href?: string;
};

export type ThreeColumnContentProps = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: { label: string; href: string };
  items: [ThreeColumnItem, ThreeColumnItem, ThreeColumnItem];
  background?: ThreeColumnContentBackground;
  className?: string;
};

const bgClasses: Record<ThreeColumnContentBackground, string> = {
  white: "bg-white",
  frost: "bg-frost",
  dark: "bg-dark-blue",
};

export function ThreeColumnContent({
  eyebrow,
  heading,
  body,
  cta,
  items,
  background = "white",
  className,
}: ThreeColumnContentProps) {
  const isOnDark = background === "dark";
  const textColor = isOnDark ? "text-white" : "text-dark-blue";
  const headingColor = isOnDark ? "text-gold" : "text-dark-blue";
  const showHeader = Boolean(eyebrow || heading || body || cta);

  return (
    <section
      data-block="three-column-content"
      className={cn(
        "relative w-full px-gutter-xl py-section-y",
        bgClasses[background],
        className,
      )}
    >
      <div className="mx-auto flex max-w-content flex-col gap-xxl">
        {showHeader && (
          <div className="mx-auto flex w-full max-w-body flex-col items-center gap-md text-center">
            <div className="flex w-full flex-col items-center gap-xxs">
              {eyebrow && <Eyebrow tone={isOnDark ? "on-dark" : "default"}>{eyebrow}</Eyebrow>}
              {heading && (
                <h2 className={cn("font-heading text-heading-2 font-bold leading-tight", headingColor)}>
                  {heading}
                </h2>
              )}
            </div>
            {body && <p className={cn("text-base leading-body", textColor)}>{body}</p>}
            {cta && (
              <Button href={cta.href} variant="outline" tone={isOnDark ? "on-dark" : "default"}>
                {cta.label}
              </Button>
            )}
          </div>
        )}

        <ul className="flex flex-wrap items-stretch gap-lg list-none p-0 m-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex flex-1 min-w-[282px] flex-col gap-md">
              {(item.icon || item.image) && (
                <div className={cn(item.image ? "relative aspect-[4/3] overflow-hidden rounded-element [&>*]:absolute [&>*]:inset-0 [&>*]:size-full [&>*]:object-cover" : "size-xxl")}>
                  {item.image ?? item.icon}
                </div>
              )}
              <div className="flex flex-col gap-base">
                <h3 className={cn("font-heading text-heading-4 font-bold leading-tight", headingColor)}>
                  {item.href ? (
                    <a href={item.href} className="hover:text-orange transition-colors">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                {item.description && (
                  <p className={cn("text-base leading-body", textColor)}>{item.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
