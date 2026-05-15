import { createClient, type SanityClient } from "@sanity/client";
import type { PortalEnv } from "./config.js";
import type { Intake } from "./types.js";

export function createPortalClient(env: PortalEnv): SanityClient {
  return createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    token: env.token,
    useCdn: false,
  });
}

export async function fetchIntake(
  client: SanityClient,
  intakeId: string,
): Promise<Intake> {
  const doc = await client.getDocument(intakeId);
  if (!doc || doc._type !== "intake") {
    throw new Error(`No intake doc found for id "${intakeId}" in portal Sanity.`);
  }
  return doc as unknown as Intake;
}

export type IntakeSummary = {
  _id: string;
  businessName: string;
  industry?: string;
  status?: string;
  _createdAt?: string;
};

export async function listIntakes(
  client: SanityClient,
  limit = 20,
): Promise<IntakeSummary[]> {
  const query = `*[_type == "intake"] | order(_createdAt desc)[0...$limit]{
    _id, businessName, industry, status, _createdAt
  }`;
  return client.fetch<IntakeSummary[]>(query, { limit });
}
