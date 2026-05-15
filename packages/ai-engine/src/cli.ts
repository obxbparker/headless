#!/usr/bin/env node
import { Command } from "commander";
import { loadCliCredentials } from "./config-node.js";
import { generate } from "./orchestrator.js";
import { createPortalClient, listIntakes } from "./portal.js";

const program = new Command();
program
  .name("outerbox-ai")
  .description("OuterBox AI engine — generate Sanity content from a portal intake")
  .version("0.0.0");

program
  .command("generate")
  .description("Generate a full site (pages + settings) from a portal intake and write to a target client Sanity project")
  .requiredOption("--intake <id>", "Portal intake document ID")
  .requiredOption("--target <slug>", "Target client slug (must have clients/<slug>/.env.local)")
  .option("--dry-run", "Generate and print preview without writing to Sanity", false)
  .action(async (opts: { intake: string; target: string; dryRun?: boolean }) => {
    try {
      const report = await generate({
        intakeId: opts.intake,
        targetSlug: opts.target,
        dryRun: opts.dryRun,
        onProgress: (m) => console.log(m),
      });

      console.log("\n===== Report =====");
      console.log(`Target Sanity project : ${report.targetProjectId}`);
      console.log(`Pages generated       : ${report.pagesGenerated}`);
      console.log(`Pages written         : ${report.pagesWritten}${opts.dryRun ? " (dry-run)" : ""}`);
      console.log(`Settings written      : ${report.settingsWritten}${opts.dryRun ? " (dry-run)" : ""}`);
      console.log(`Assets uploaded       : ${report.assetsUploaded}`);
      console.log(`Tokens in / out       : ${report.tokensIn} / ${report.tokensOut}`);
      console.log(`Cache reads           : ${report.cacheReads}`);
      console.log(`Duration              : ${(report.durationMs / 1000).toFixed(1)}s`);

      if (opts.dryRun && report.preview) {
        console.log("\n===== Preview (first page only) =====");
        console.log(JSON.stringify(report.preview.pages[0], null, 2));
      }
    } catch (err) {
      console.error("\n✘", (err as Error).message);
      process.exitCode = 1;
    }
  });

program
  .command("intakes")
  .description("List recent intakes from the portal")
  .option("--limit <n>", "Max number to show", (v) => parseInt(v, 10), 20)
  .action(async (opts: { limit: number }) => {
    try {
      // Reuse the CLI credential loader, but we only need the portal half.
      // Use a placeholder slug to satisfy the loader; we don't read target env here.
      const creds = loadCliCredentials("smoketest-roofing");
      const client = createPortalClient(creds.portal);
      const intakes = await listIntakes(client, opts.limit);
      if (intakes.length === 0) {
        console.log("(no intakes found)");
        return;
      }
      for (const i of intakes) {
        const when = i._createdAt ? new Date(i._createdAt).toISOString().slice(0, 16).replace("T", " ") : "?";
        console.log(`${i._id}  ${when}  [${i.status ?? "—"}]  ${i.businessName}${i.industry ? ` (${i.industry})` : ""}`);
      }
    } catch (err) {
      console.error("\n✘", (err as Error).message);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
