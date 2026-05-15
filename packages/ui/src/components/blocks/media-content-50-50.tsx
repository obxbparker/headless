import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";
import { Eyebrow } from "../primitives/eyebrow";

export type MediaContent5050Background = "white" | "frost" | "dark";
export type MediaContent5050Shape = "rectangle" | "circle";
export type MediaContent5050Side = "left" | "right";

export type MediaContent5050Props = {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: { label: string; href: string };
  media?: ReactNode;
  mediaShape?: MediaContent5050Shape;
  mediaSide?: MediaContent5050Side;
  background?: MediaContent5050Background;
  divider?: boolean;
  className?: string;
};

export function MediaContent5050({
  eyebrow,
  heading,
  body,
  cta,
  media,
  mediaShape = "rectangle",
  mediaSide = "left",
  background,
  divider,
  className,
}: MediaContent5050Props) {
  const hasMedia = Boolean(media);
  const bg = background ?? (hasMedia ? "frost" : "white");
  const isOnDark = bg === "dark";
  const showDivider = divider ?? (!hasMedia && bg === "white");

  const bgClasses: Record<MediaContent5050Background, string> = {
    white: "bg-white",
    frost: "bg-frost",
    dark: "bg-dark-blue",
  };

  const textColor = isOnDark ? "text-white" : "text-dark-blue";
  const headingColor = isOnDark ? "text-gold" : "text-dark-blue";

  const mediaWrapper = hasMedia ? (
    <div
      className={cn(
        "relative flex-1 overflow-hidden aspect-square min-w-[240px]",
        mediaShape === "circle" ? "rounded-media" : "rounded-element",
        "[&>*]:absolute [&>*]:inset-0 [&>*]:size-full [&>*]:object-cover",
      )}
    >
      {media}
    </div>
  ) : null;

  return (
    <section
      data-block="media-content-50-50"
      className={cn(
        "relative w-full px-gutter-xl py-section-y",
        bgClasses[bg],
        showDivider && "border-b border-slate/20",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-content flex-wrap items-center gap-xxl",
          !hasMedia && "justify-center",
        )}
      >
        {hasMedia && mediaSide === "left" && mediaWrapper}

        <div
          className={cn(
            "flex flex-1 min-w-[240px] max-w-content flex-col gap-md",
            hasMedia ? "items-start text-left" : "items-center text-center",
          )}
        >
          <div
            className={cn(
              "flex w-full max-w-body flex-col gap-base",
              hasMedia ? "items-start" : "items-center",
            )}
          >
            {(eyebrow || heading) && (
              <div className={cn("flex w-full flex-col gap-xxs", hasMedia ? "items-start" : "items-center")}>
                {eyebrow && <Eyebrow tone={isOnDark ? "on-dark" : "default"}>{eyebrow}</Eyebrow>}
                <h2
                  className={cn(
                    "font-heading text-heading-2 font-bold leading-tight",
                    headingColor,
                  )}
                >
                  {heading}
                </h2>
              </div>
            )}

            {body && (
              <p className={cn("text-base leading-body", textColor)}>{body}</p>
            )}
          </div>

          {cta && (
            <Button
              href={cta.href}
              variant="outline"
              tone={isOnDark ? "on-dark" : "default"}
            >
              {cta.label}
            </Button>
          )}
        </div>

        {hasMedia && mediaSide === "right" && mediaWrapper}
      </div>
    </section>
  );
}
