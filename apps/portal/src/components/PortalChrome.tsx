import Link from "next/link";

/**
 * Header + content shell rendered on every portal page except Studio.
 * Studio mounts full-viewport without any chrome (Sanity's UI owns the screen).
 */
export function PortalChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-dark-blue/10 bg-white">
        <div className="mx-auto flex max-w-content items-center justify-between gap-md px-gutter-xl py-sm">
          <Link
            href="/"
            className="flex items-center gap-sm text-dark-blue hover:text-obx-blue transition-colors"
          >
            <span className="font-heading text-heading-4 font-black uppercase tracking-tight">
              OuterBox Portal
            </span>
            <span className="rounded-sm bg-orange px-xs py-xxs text-eyebrow font-bold uppercase tracking-eyebrow text-white">
              Internal
            </span>
          </Link>
          <nav aria-label="Primary">
            <ul className="flex items-center gap-lg list-none p-0 m-0">
              <li>
                <Link
                  href="/intake"
                  className="font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
                >
                  New intake
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  className="font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
                >
                  Studio
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-content px-gutter-xl py-section-y">
        {children}
      </main>
    </>
  );
}
