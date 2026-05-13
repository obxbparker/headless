import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export type SanityImageWithAlt = {
  _type?: "imageWithAlt" | "image";
  asset?: { _ref?: string; _type?: string };
  alt?: string;
};

export function imageSrc(image: SanityImageWithAlt | undefined, width = 1600) {
  if (!image?.asset) return null;
  return urlForImage(image as SanityImageSource).width(width).auto("format").url();
}
