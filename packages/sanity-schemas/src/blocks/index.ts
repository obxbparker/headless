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

export {
  heroBannerSchema,
  mediaContent5050Schema,
  threeColumnContentSchema,
  threeColumnItemSchema,
  calloutSchema,
  formSchema,
  formFieldSchema,
  formContactInfoSchema,
};

export const blockSchemas = [
  heroBannerSchema,
  mediaContent5050Schema,
  threeColumnContentSchema,
  calloutSchema,
  formSchema,
];

export const blockSupportingSchemas = [
  threeColumnItemSchema,
  formFieldSchema,
  formContactInfoSchema,
];

export const blockTypeNames = blockSchemas.map((s) => s.name);
