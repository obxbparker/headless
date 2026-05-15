import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./env";
import { schemaTypes } from "./schema";
import { structure } from "./structure";
import { GenerateAction } from "./actions/generateAction";

export default defineConfig({
  name: "default",
  title: "OuterBox Platform",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      context.schemaType === "intake" ? [GenerateAction, ...prev] : prev,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
