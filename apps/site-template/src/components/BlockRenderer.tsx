import Image from "next/image";
import {
  Callout,
  FormBlock,
  HeroBanner,
  MediaContent5050,
  ThreeColumnContent,
  type FormField,
  type HeroBannerProps,
  type MediaContent5050Props,
  type ThreeColumnContentProps,
  type CalloutProps,
  type FormBlockProps,
} from "@outerbox/ui";
import { imageSrc, type SanityImageWithAlt } from "@/sanity/image";

type SanityBlock = {
  _type: string;
  _key: string;
  [k: string]: unknown;
};

function SanityImg({
  image,
  width = 1200,
  height,
  priority = false,
}: {
  image: SanityImageWithAlt | undefined;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const src = imageSrc(image, width);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={image?.alt ?? ""}
      width={width}
      height={height ?? Math.round(width * 0.66)}
      priority={priority}
      sizes="(min-width: 1024px) 1200px, 100vw"
    />
  );
}

export function BlockRenderer({ blocks }: { blocks: SanityBlock[] }) {
  return (
    <>
      {blocks.map((block, idx) => {
        const isHero = block._type === "hero-banner";
        switch (block._type) {
          case "hero-banner": {
            const b = block as unknown as HeroBannerProps & {
              media?: SanityImageWithAlt;
            };
            return (
              <HeroBanner
                key={block._key}
                eyebrow={b.eyebrow}
                heading={b.heading}
                body={b.body}
                primaryCta={b.primaryCta}
                secondaryCta={b.secondaryCta}
                backgroundTreatment={b.backgroundTreatment}
                align={b.align}
                media={
                  b.media ? (
                    <SanityImg image={b.media} width={1920} priority={isHero && idx === 0} />
                  ) : undefined
                }
              />
            );
          }
          case "media-content-50-50": {
            const b = block as unknown as MediaContent5050Props & {
              media?: SanityImageWithAlt;
            };
            return (
              <MediaContent5050
                key={block._key}
                eyebrow={b.eyebrow}
                heading={b.heading}
                body={b.body}
                cta={b.cta}
                mediaShape={b.mediaShape}
                mediaSide={b.mediaSide}
                background={b.background}
                divider={b.divider}
                media={b.media ? <SanityImg image={b.media} width={800} /> : undefined}
              />
            );
          }
          case "three-column-content": {
            const b = block as unknown as Omit<ThreeColumnContentProps, "items"> & {
              items: Array<{
                title: string;
                description?: string;
                href?: string;
                image?: SanityImageWithAlt;
                icon?: SanityImageWithAlt;
              }>;
            };
            const items = b.items.slice(0, 3).map((item) => ({
              title: item.title,
              description: item.description,
              href: item.href,
              image: item.image ? <SanityImg image={item.image} width={600} /> : undefined,
              icon: item.icon ? <SanityImg image={item.icon} width={64} height={64} /> : undefined,
            }));
            if (items.length < 3) return null;
            return (
              <ThreeColumnContent
                key={block._key}
                eyebrow={b.eyebrow}
                heading={b.heading}
                body={b.body}
                cta={b.cta}
                background={b.background}
                items={items as ThreeColumnContentProps["items"]}
              />
            );
          }
          case "callout": {
            const b = block as unknown as CalloutProps;
            return (
              <Callout
                key={block._key}
                eyebrow={b.eyebrow}
                heading={b.heading}
                body={b.body}
                cta={b.cta}
                secondaryCta={b.secondaryCta}
                background={b.background}
                headingLevel={b.headingLevel}
              />
            );
          }
          case "form": {
            const b = block as unknown as FormBlockProps & {
              fields: FormField[];
            };
            return (
              <FormBlock
                key={block._key}
                eyebrow={b.eyebrow}
                heading={b.heading}
                body={b.body}
                contactInfo={b.contactInfo}
                formType={b.formType}
                fields={b.fields}
                submitLabel={b.submitLabel}
                destinationEmail={b.destinationEmail}
                subjectLine={b.subjectLine}
              />
            );
          }
          default:
            if (process.env.NODE_ENV !== "production") {
              return (
                <div
                  key={block._key}
                  className="mx-auto my-md max-w-content rounded-element border-2 border-dashed border-orange p-md text-orange"
                >
                  Unknown block type: <code>{block._type}</code>
                </div>
              );
            }
            return null;
        }
      })}
    </>
  );
}
