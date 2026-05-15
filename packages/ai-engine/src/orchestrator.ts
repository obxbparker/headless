/**
 * CLI-facing wrapper around runGeneration(). Resolves Node-only credentials
 * (.env + clients/<slug>/.env.local) before delegating to the pure engine.
 * Do NOT import this from the portal — use engine.ts directly there.
 */
import { loadCliCredentials } from "./config-node.js";
import { runGeneration, type GenerateReport } from "./engine.js";

export type GenerateOptions = {
  intakeId: string;
  targetSlug: string;
  dryRun?: boolean;
  onProgress?: (msg: string) => void;
};

export type { GenerateReport };

export async function generate(opts: GenerateOptions): Promise<GenerateReport> {
  const log = opts.onProgress;
  log?.(`Loading target client env for "${opts.targetSlug}"…`);
  const credentials = loadCliCredentials(opts.targetSlug);
  return runGeneration({
    credentials,
    intakeId: opts.intakeId,
    targetSlug: opts.targetSlug,
    dryRun: opts.dryRun,
    onProgress: opts.onProgress,
  });
}
