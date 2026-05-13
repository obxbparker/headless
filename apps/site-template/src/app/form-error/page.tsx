import Link from "next/link";

export const metadata = {
  title: "Submission error",
  robots: { index: false, follow: false },
};

export default function FormErrorPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col items-start justify-center gap-md px-gutter-xl py-section-y">
      <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
        Something went wrong
      </p>
      <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
        We couldn&apos;t process your submission.
      </h1>
      <p className="max-w-body text-base leading-body text-slate">
        Please try again. If the problem persists, get in touch with us directly
        and we&apos;ll help you out.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-button bg-obx-blue px-md py-sm font-bold uppercase tracking-eyebrow text-white hover:bg-deep-blue"
      >
        Back to home
      </Link>
    </main>
  );
}
