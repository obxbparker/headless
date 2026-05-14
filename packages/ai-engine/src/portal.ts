import { createClient, type SanityClient } from "@sanity/client";
import { config } from "./config.js";
import type { Intake } from "./types.js";

let _client: SanityClient | null = null;

export function portalClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: config.portal.projectId(),
      dataset: config.portal.dataset(),
      apiVersion: config.portal.apiVersion(),
      token: config.portal.token(),
      useCdn: false,
    });
  }
  return _client;
}

export async function fetchIntake(intakeId: string): Promise<Intake> {
  const client = portalClient();
  const doc = await client.getDocument(intakeId);
  if (!doc || doc._type !== "intake") {
    throw new Error(`No intake doc found for id "${intakeId}" in portal Sanity (${config.portal.projectId()}).`);
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

export async function listIntakes(limit = 20): Promise<IntakeSummary[]> {
  const client = portalClient();
  const query = `*[_type == "intake"] | order(_createdAt desc)[0...$limit]{
    _id, businessName, industry, status, _createdAt
  }`;
  const results = await client.fetch<IntakeSummary[]>(query, { limit });
  return results;
}
