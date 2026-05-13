import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@outerbox/sanity-schemas";
import { apiVersion, dataset, projectId } from "./env";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "OuterBox Site Template",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
