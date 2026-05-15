// Edge-safe entrypoint — import this from Cloudflare Pages / Workers.
// (Do NOT import from orchestrator / config-node / cli — those pull in Node APIs.)
export { runGeneration } from "./engine.js";
export type { GenerateReport, RunGenerationOptions } from "./engine.js";
export { createPortalClient, fetchIntake, listIntakes } from "./portal.js";
export type {
  EngineCredentials,
  PortalEnv,
  TargetClientEnv,
  AnthropicEnv,
} from "./config.js";
export type {
  Intake,
  GeneratedPage,
  GeneratedSite,
  GeneratedSiteSettings,
  SiteContext,
  PageIntent,
} from "./types.js";
