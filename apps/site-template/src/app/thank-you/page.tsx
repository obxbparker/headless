import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const runtime = "edge";

type SearchParams = Promise<{ ref?: string }>;

const formTypeLabels: Record<string, string> = {
  contact: "your message",
  "quote-request": "your quote request",
  consultation: "your consultation request",
  newsletter: "your subscription",
};

export const metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { ref } = await searchParams;
  const what = (ref && formTypeLabels[ref]) || "your message";

  return (
    <SiteChrome>
      <div className="mx-auto flex min-h-[60vh] max-w-content flex-col items-start justify-center gap-md px-gutter-xl py-section-y">
        <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
          Thank you
        </p>
        <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
          We&apos;ve received {what}.
        </h1>
        <p className="max-w-body text-base leading-body text-slate">
          We&apos;ll be in touch within one business day. If your request is urgent,
          please call us directly.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue"
        >
          Back to home
        </Link>
      </div>
    </SiteChrome>
  );
}
