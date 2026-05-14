import { heroBannerSchema } from "./heroBanner";
import { mediaContent5050Schema } from "./mediaContent5050";
import {
  threeColumnContentSchema,
  threeColumnItemSchema,
} from "./threeColumnContent";
import { calloutSchema } from "./callout";
import {
  formSchema,
  formFieldSchema,
  formContactInfoSchema,
} from "./form";
import { valuePropBarSchema, valuePropItemSchema } from "./valuePropBar";
import { faqSchema, faqItemSchema } from "./faq";
import {
  contentCarousel4ColumnSchema,
  contentCarouselItemSchema,
} from "./contentCarousel4Column";
import { gallerySchema, galleryItemSchema } from "./gallery";

export {
  heroBannerSchema,
  mediaContent5050Schema,
  threeColumnContentSchema,
  threeColumnItemSchema,
  calloutSchema,
  formSchema,
  formFieldSchema,
  formContactInfoSchema,
  valuePropBarSchema,
  valuePropItemSchema,
  faqSchema,
  faqItemSchema,
  contentCarousel4ColumnSchema,
  contentCarouselItemSchema,
  gallerySchema,
  galleryItemSchema,
};

export const blockSchemas = [
  heroBannerSchema,
  valuePropBarSchema,
  mediaContent5050Schema,
  threeColumnContentSchema,
  contentCarousel4ColumnSchema,
  gallerySchema,
  calloutSchema,
  faqSchema,
  formSchema,
];

export const blockSupportingSchemas = [
  threeColumnItemSchema,
  formFieldSchema,
  formContactInfoSchema,
  valuePropItemSchema,
  faqItemSchema,
  contentCarouselItemSchema,
  galleryItemSchema,
];

export const blockTypeNames = blockSchemas.map((s) => s.name);
