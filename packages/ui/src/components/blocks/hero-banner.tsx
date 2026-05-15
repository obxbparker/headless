import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";
import { Eyebrow } from "../primitives/eyebrow";

export type HeroBannerBackgroundTreatment =
  | "image"
  | "image-dark-overlay"
  | "solid-dark";

export type HeroBannerProps = {
  eyebrow?: string;
  heading: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  media?: ReactNode;
  backgroundTreatment?: HeroBannerBackgroundTreatment;
  align?: "center" | "left";
  className?: string;
};

export function HeroBanner({
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
  media,
  backgroundTreatment = "image-dark-overlay",
  align = "center",
  className,
}: HeroBannerProps) {
  const hasMedia = backgroundTreatment !== "solid-dark" && Boolean(media);
  const showOverlay = backgroundTreatment === "image-dark-overlay" && hasMedia;
  const isSolid = backgroundTreatment === "solid-dark";
  const isOnDark = backgroundTreatment !== "image";

  return (
    <section
      data-block="hero-banner"
      className={cn(
        "relative isolate flex min-h-[600px] w-full items-center justify-center overflow-hidden px-gutter-xl py-section-y",
        isSolid && "bg-dark-blue",
        className,
      )}
    >
      {hasMedia && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 [&>*]:absolute [&>*]:inset-0 [&>*]:size-full [&>*]:object-cover">
            {media}
          </div>
          {showOverlay && (
            <div className="absolute inset-0 bg-dark-blue/60" />
          )}
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-content flex-col gap-md",
          align === "center" ? "items-center text-center" : "items-start text-left",
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-body flex-col gap-base",
            align === "center" ? "items-center" : "items-start",
          )}
        >
          {eyebrow && <Eyebrow tone={isOnDark ? "on-dark" : "default"}>{eyebrow}</Eyebrow>}

          <h1
            className={cn(
              "font-heading text-heading-1 font-bold leading-tight",
              isOnDark ? "text-white" : "text-dark-blue",
              isSolid && "text-gold",
            )}
          >
            {heading}
          </h1>

          {body && (
            <p
              className={cn(
                "text-base leading-body",
                isOnDark ? "text-white" : "text-dark-blue",
              )}
            >
              {body}
            </p>
          )}
        </div>

        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "flex flex-wrap gap-md",
              align === "center" ? "justify-center" : "justify-start",
            )}
          >
            {primaryCta && (
              <Button
                href={primaryCta.href}
                variant="primary"
                tone={isOnDark ? "on-dark" : "default"}
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="outline"
                tone={isOnDark ? "on-dark" : "default"}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
