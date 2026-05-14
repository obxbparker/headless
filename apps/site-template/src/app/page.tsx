import { renderSanityPage, metadataForSlug } from "@/lib/sanity-page";

export const runtime = "edge";
export const revalidate = 60;

export async function generateMetadata() {
  return metadataForSlug("home");
}

export default async function HomePage() {
  return renderSanityPage("home");
}
