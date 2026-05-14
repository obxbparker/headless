import Link from "next/link";
import { PortalChrome } from "@/components/PortalChrome";

export default function PortalHome() {
  return (
    <PortalChrome>
    <div className="flex flex-col gap-xl">
      <header className="flex max-w-body flex-col gap-sm">
        <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
          OuterBox Platform — Phase 1
        </p>
        <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
          PM Portal
        </h1>
        <p className="text-base leading-body text-slate">
          Start a new client project. Fill in the intake form — submissions are
          stored in Sanity under the platform project. Browse submissions in
          Studio. They become input for the AI engine in Phase 2.
        </p>
      </header>

      <section className="grid gap-lg sm:grid-cols-2">
        <Link
          href="/intake"
          className="group flex flex-col gap-md rounded-element bg-white p-xl shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-heading-3 font-bold leading-tight text-dark-blue group-hover:text-obx-blue">
              New client intake →
            </h2>
          </div>
          <p className="text-base leading-body text-slate">
            Capture business name, services, audience, tone, existing copy, and
            assets. Becomes the AI engine&apos;s primary input.
          </p>
        </Link>

        <Link
          href="/studio"
          className="group flex flex-col gap-md rounded-element bg-white p-xl shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-heading-3 font-bold leading-tight text-dark-blue group-hover:text-obx-blue">
              Browse submissions →
            </h2>
          </div>
          <p className="text-base leading-body text-slate">
            Open Sanity Studio to review intake submissions, change status, or
            edit fields before they go to the AI engine.
          </p>
        </Link>
      </section>
    </div>
    </PortalChrome>
  );
}
