import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, writeToken } from "./env";

/** Read-only client (CDN, public). Safe for browser + server use. */
export const sanityRead = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/**
 * Write client — server-only. Uses the SANITY_WRITE_TOKEN env var.
 * Throws if called without the token set so we fail loudly in CI / prod
 * rather than silently dropping submissions.
 */
export function sanityWriteClient() {
  if (!writeToken) {
    throw new Error(
      "SANITY_WRITE_TOKEN is not set. Add it to apps/portal/.env.local (local) " +
        "or run `wrangler pages secret put SANITY_WRITE_TOKEN --project-name=obx-portal` (prod).",
    );
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
    perspective: "published",
  });
}
