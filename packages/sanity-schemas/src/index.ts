import {
  blockSchemas,
  blockSupportingSchemas,
  blockTypeNames,
} from "./blocks";
import {
  documentSchemas,
  documentSupportingSchemas,
} from "./documents";
import { objectSchemas } from "./objects";

export * from "./blocks";
export * from "./documents";
export * from "./objects";

export { blockTypeNames };

export const schemaTypes = [
  ...objectSchemas,
  ...blockSupportingSchemas,
  ...blockSchemas,
  ...documentSupportingSchemas,
  ...documentSchemas,
];
