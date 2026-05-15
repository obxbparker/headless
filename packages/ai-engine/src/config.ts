/**
 * Pure credential types — no fs, no dotenv, no Node APIs. Safe to import
 * from edge runtimes. The CLI builds these via config-node.ts; the portal
 * API route builds them from request body + Cloudflare Pages secrets.
 */
export type TargetClientEnv = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  writeToken: string;
};

export type PortalEnv = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token: string;
};

export type AnthropicEnv = {
  apiKey: string;
  model: string;
};

export type EngineCredentials = {
  anthropic: AnthropicEnv;
  portal: PortalEnv;
  target: TargetClientEnv;
};
