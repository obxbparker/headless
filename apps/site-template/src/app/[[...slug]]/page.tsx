import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/client";
import { pageBySlugQuery } from "@/sanity/queries";
import { BlockRenderer } from "@/components/BlockRenderer";

export const revalidate = 60;

type PageDoc = {
  _id: string;
  title: string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks?: Array<{ _type: string; _key: string; [k: string]: unknown }>;
};

async function getPage(slug: string): Promise<PageDoc | null> {
  try {
    return await sanityClient.fetch<PageDoc | null>(pageBySlugQuery, { slug });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[getPage] Sanity fetch failed:", err);
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug?.join("/") || "home";
  const page = await getPage(slugString);
  if (!page) {
    return slugString === "home"
      ? { title: "OuterBox Site Template" }
      : { title: "Not found" };
  }
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugString = slug?.join("/") || "home";
  const page = await getPage(slugString);

  if (!page) {
    if (slugString === "home") return <EmptyHome />;
    notFound();
  }

  return <BlockRenderer blocks={page.blocks ?? []} />;
}

function EmptyHome() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col items-start justify-center gap-md px-gutter-xl py-section-y">
      <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
        OuterBox Platform
      </p>
      <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
        No home page yet
      </h1>
      <p className="max-w-body text-base leading-body text-slate">
        Create a page in Sanity Studio with the slug{" "}
        <code className="rounded-sm bg-frost px-xs py-xxs font-bold">home</code>{" "}
        to start rendering content here.
      </p>
      <div className="flex flex-wrap gap-md">
        <Link
          href="/studio"
          className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue"
        >
          Open Studio
        </Link>
        <Link
          href="/demo"
          className="inline-flex items-center justify-center rounded-button border-2 border-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-obx-blue hover:bg-obx-blue hover:text-white"
        >
          View static demo
        </Link>
      </div>
    </main>
  );
}
