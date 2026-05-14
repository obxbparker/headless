import { HeroBanner } from "./hero-banner";
import { MediaContent5050 } from "./media-content-50-50";
import { ThreeColumnContent } from "./three-column-content";
import { Callout } from "./callout";
import { FormBlock } from "./form";
import { ValuePropBar } from "./value-prop-bar";
import { Faq } from "./faq";
import { ContentCarousel4Column } from "./content-carousel-4-column";
import { Gallery } from "./gallery";

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
export {
  ValuePropBar,
  type ValuePropBarProps,
  type ValuePropItem,
  type ValuePropBarBackground,
} from "./value-prop-bar";
export {
  Faq,
  buildFaqJsonLd,
  type FaqProps,
  type FaqItem,
  type FaqBackground,
} from "./faq";
export {
  ContentCarousel4Column,
  type ContentCarousel4ColumnProps,
  type ContentCarouselItem,
  type ContentCarouselBackground,
} from "./content-carousel-4-column";
export {
  Gallery,
  type GalleryProps,
  type GalleryItem,
  type GalleryLayout,
  type GalleryBackground,
} from "./gallery";

// Layout chrome — not page blocks; rendered by the site template's root layout from siteSettings.
export {
  TemplateNavigation,
  type TemplateNavigationProps,
} from "./template-navigation";
export {
  MainNavigation,
  type MainNavigationProps,
  type MainNavLink,
} from "./main-navigation";
export {
  FooterA,
  type FooterAProps,
  type FooterLink,
  type FooterColumn,
} from "./footer-a";

export const BlockRegistry = {
  "hero-banner": HeroBanner,
  "media-content-50-50": MediaContent5050,
  "three-column-content": ThreeColumnContent,
  callout: Callout,
  form: FormBlock,
  "value-prop-bar": ValuePropBar,
  faq: Faq,
  "content-carousel-4-column": ContentCarousel4Column,
  gallery: Gallery,
} as const;

export type BlockSlug = keyof typeof BlockRegistry;
