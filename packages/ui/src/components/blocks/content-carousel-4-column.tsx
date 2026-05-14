import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";
import { Eyebrow } from "../primitives/eyebrow";

export type ContentCarouselBackground = "white" | "frost" | "dark";

export type ContentCarouselItem = {
  media?: ReactNode;
  title: string;
  description?: string;
  href?: string;
};

export type ContentCarousel4ColumnProps = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  cta?: { label: string; href: string };
  items: ContentCarouselItem[];
  background?: ContentCarouselBackground;
  className?: string;
};

const bgClasses: Record<ContentCarouselBackground, string> = {
  white: "bg-white",
  frost: "bg-frost",
  dark: "bg-dark-blue",
};

export function ContentCarousel4Column({
  eyebrow,
  heading,
  body,
  cta,
  items,
  background = "white",
  className,
}: ContentCarousel4ColumnProps) {
  const isOnDark = background === "dark";
  const textColor = isOnDark ? "text-white" : "text-dark-blue";
  const subColor = isOnDark ? "text-frost" : "text-slate";
  const headingColor = isOnDark ? "text-gold" : "text-dark-blue";
  const cardBg = isOnDark ? "bg-deep-blue" : "bg-white";
  const cardBorder = isOnDark ? "border-slate/40" : "border-dark-blue/10";
  const showHeader = Boolean(eyebrow || heading || body || cta);

  return (
    <section
      data-block="content-carousel-4-column"
      className={cn(
        "relative w-full py-section-y",
        bgClasses[background],
        className,
      )}
    >
      {showHeader && (
        <div className="mx-auto mb-xxl flex max-w-content flex-col gap-md px-gutter-xl lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-body flex-col gap-xxs">
            {eyebrow && (
              <Eyebrow tone={isOnDark ? "on-dark" : "default"}>{eyebrow}</Eyebrow>
            )}
            {heading && (
              <h2 className={cn("font-heading text-heading-2 font-bold leading-tight", headingColor)}>
                {heading}
              </h2>
            )}
            {body && <p className={cn("text-base leading-body", subColor)}>{body}</p>}
          </div>
          {cta && (
            <Button href={cta.href} variant="outline" tone={isOnDark ? "on-dark" : "default"}>
              {cta.label}
            </Button>
          )}
        </div>
      )}

      {/*
       * Mobile: horizontal scroll with snap. Desktop: 4-column grid.
       * Pure CSS — no client-side JS needed for MVP.
       */}
      <div
        className={cn(
          "mx-auto max-w-content overflow-x-auto px-gutter-xl pb-xs",
          "scroll-px-gutter-xl snap-x snap-mandatory lg:overflow-x-visible",
        )}
      >
        <ul
          className={cn(
            "grid auto-cols-[80%] grid-flow-col gap-md list-none p-0 m-0",
            "sm:auto-cols-[45%]",
            "lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-lg",
          )}
        >
          {items.map((item, idx) => {
            const cardInner = (
              <>
                {item.media && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-element [&>*]:absolute [&>*]:inset-0 [&>*]:size-full [&>*]:object-cover">
                    {item.media}
                  </div>
                )}
                <div className="flex flex-col gap-xxs">
                  <h3 className={cn("font-heading text-heading-5 font-bold leading-tight", headingColor)}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className={cn("text-base leading-body", subColor)}>
                      {item.description}
                    </p>
                  )}
                </div>
              </>
            );
            return (
              <li
                key={idx}
                className={cn(
                  "snap-start rounded-element border p-md",
                  cardBg,
                  cardBorder,
                  textColor,
                )}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex h-full flex-col gap-md hover:text-orange transition-colors"
                  >
                    {cardInner}
                  </a>
                ) : (
                  <div className="flex h-full flex-col gap-md">{cardInner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
