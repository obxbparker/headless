import { HeroBanner } from "./hero-banner";
import { MediaContent5050 } from "./media-content-50-50";
import { ThreeColumnContent } from "./three-column-content";
import { Callout } from "./callout";
import { FormBlock } from "./form";

export { HeroBanner, type HeroBannerProps } from "./hero-banner";
export {
  MediaContent5050,
  type MediaContent5050Props,
} from "./media-content-50-50";
export {
  ThreeColumnContent,
  type ThreeColumnContentProps,
  type ThreeColumnItem,
} from "./three-column-content";
export { Callout, type CalloutProps } from "./callout";
export {
  FormBlock,
  type FormBlockProps,
  type FormField,
  type FormFieldType,
  type FormContactInfo,
} from "./form";

export const BlockRegistry = {
  "hero-banner": HeroBanner,
  "media-content-50-50": MediaContent5050,
  "three-column-content": ThreeColumnContent,
  callout: Callout,
  form: FormBlock,
} as const;

export type BlockSlug = keyof typeof BlockRegistry;
