import { groq } from "next-sanity";

const ctaProjection = `{ label, href }`;
const imageProjection = `{ ..., asset->{ _id, _ref, metadata { dimensions, lqip } } }`;

const blockProjection = `
  ...,
  _type,
  _key,
  primaryCta ${ctaProjection},
  secondaryCta ${ctaProjection},
  cta ${ctaProjection},
  media ${imageProjection},
  items[]{
    ...,
    image ${imageProjection},
    icon ${imageProjection}
  },
  contactInfo,
  fields[]
`;

export const pageBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  seo,
  blocks[]{
    ${blockProjection}
  }
}
`;

export const allPageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`;

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  ...,
  logo ${imageProjection},
  logoOnDark ${imageProjection},
  defaultSeo
}
`;
