import { renderSanityPage, metadataForSlug } from "@/lib/sanity-page";

export const runtime = "edge";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return metadataForSlug(slug.join("/"));
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return renderSanityPage(slug.join("/"));
}
