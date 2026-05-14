import Link from "next/link";

export default function PortalHome() {
  return (
    <div className="flex flex-col gap-xl">
      <header className="flex max-w-body flex-col gap-sm">
        <p className="text-eyebrow font-bold uppercase tracking-eyebrow text-orange">
          OuterBox Platform — Phase 1
        </p>
        <h1 className="font-heading text-heading-1 font-bold leading-tight text-dark-blue">
          PM Portal
        </h1>
        <p className="text-base leading-body text-slate">
          Start a new client project. Fill in the intake form below — the
          response is saved as a JSON file in{" "}
          <code className="rounded-sm bg-white px-xs py-xxs font-bold">
            apps/portal/data/intake/
          </code>{" "}
          and becomes the input for the AI engine in Phase 2.
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

        <div className="flex flex-col gap-md rounded-element border-2 border-dashed border-dark-blue/15 p-xl text-slate">
          <h2 className="font-heading text-heading-3 font-bold leading-tight text-dark-blue/40">
            Project list (Phase 2)
          </h2>
          <p className="text-base leading-body">
            Pending intakes, AI-staged content review, and approve-to-deploy
            controls land here when the AI engine ships.
          </p>
        </div>
      </section>
    </div>
  );
}
