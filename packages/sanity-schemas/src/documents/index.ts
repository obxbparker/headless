import { pageSchema } from "./page";
import { seoSchema } from "./seo";
import { siteSettingsSchema } from "./siteSettings";

export { pageSchema, seoSchema, siteSettingsSchema };

export const documentSchemas = [pageSchema, siteSettingsSchema];
export const documentSupportingSchemas = [seoSchema];
