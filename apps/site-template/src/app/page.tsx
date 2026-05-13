import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col items-start justify-center gap-md px-gutter-xl py-section-y">
      <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
        OuterBox Platform
      </p>
      <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
        Site template scaffold
      </h1>
      <p className="max-w-body text-base leading-body text-slate">
        Phase 1 site-template. The component library renders on the demo page below.
      </p>
      <Link
        href="/demo"
        className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue"
      >
        View component demo
      </Link>
    </main>
  );
}
