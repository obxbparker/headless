import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Eyebrow } from "../primitives/eyebrow";

export type GalleryBackground = "white" | "frost" | "dark";
export type GalleryLayout = "grid-2" | "grid-3" | "grid-4";

export type GalleryItem = {
  /** Image slot — consumer renders <Image /> or an <img>. */
  image: ReactNode;
  caption?: string;
};

export type GalleryProps = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  items: GalleryItem[];
  layout?: GalleryLayout;
  background?: GalleryBackground;
  className?: string;
};

const bgClasses: Record<GalleryBackground, string> = {
  white: "bg-white",
  frost: "bg-frost",
  dark: "bg-dark-blue",
};

const layoutClasses: Record<GalleryLayout, string> = {
  "grid-2": "sm:grid-cols-2",
  "grid-3": "sm:grid-cols-2 lg:grid-cols-3",
  "grid-4": "sm:grid-cols-2 lg:grid-cols-4",
};

export function Gallery({
  eyebrow,
  heading,
  body,
  items,
  layout = "grid-3",
  background = "white",
  className,
}: GalleryProps) {
  const isOnDark = background === "dark";
  const textColor = isOnDark ? "text-white" : "text-dark-blue";
  const subColor = isOnDark ? "text-frost" : "text-slate";
  const headingColor = isOnDark ? "text-gold" : "text-dark-blue";
  const captionColor = isOnDark ? "text-frost" : "text-slate";
  const showHeader = Boolean(eyebrow || heading || body);

  return (
    <section
      data-block="gallery"
      className={cn(
        "relative w-full px-gutter-xl py-section-y",
        bgClasses[background],
        className,
      )}
    >
      <div className="mx-auto flex max-w-content flex-col gap-xxl">
        {showHeader && (
          <header className="mx-auto flex w-full max-w-body flex-col items-center gap-md text-center">
            <div className="flex w-full flex-col items-center gap-xxs">
              {eyebrow && (
                <Eyebrow tone={isOnDark ? "on-dark" : "default"}>{eyebrow}</Eyebrow>
              )}
              {heading && (
                <h2 className={cn("font-heading text-heading-2 font-bold leading-tight", headingColor)}>
                  {heading}
                </h2>
              )}
            </div>
            {body && <p className={cn("text-base leading-body", subColor)}>{body}</p>}
          </header>
        )}

        <ul
          className={cn(
            "grid gap-md list-none p-0 m-0",
            layoutClasses[layout],
          )}
        >
          {items.map((item, idx) => (
            <li key={idx} className="flex flex-col gap-xs">
              <figure className={cn("flex flex-col gap-xs", textColor)}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-element [&>*]:absolute [&>*]:inset-0 [&>*]:size-full [&>*]:object-cover">
                  {item.image}
                </div>
                {item.caption && (
                  <figcaption className={cn("text-small leading-body", captionColor)}>
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
