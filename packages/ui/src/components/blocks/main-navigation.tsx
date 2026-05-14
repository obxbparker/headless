import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";

export type MainNavLink = {
  label: string;
  href: string;
};

export type MainNavigationProps = {
  /** Logo slot — consumer renders <Image /> or an <img>. Falls back to the business name. */
  logo?: ReactNode;
  businessName?: string;
  homeHref?: string;
  links?: MainNavLink[];
  primaryCta?: { label: string; href: string };
  className?: string;
};

export function MainNavigation({
  logo,
  businessName,
  homeHref = "/",
  links,
  primaryCta,
  className,
}: MainNavigationProps) {
  return (
    <header
      data-block="main-navigation"
      className={cn(
        "sticky top-0 z-40 w-full border-b border-frost bg-white",
        className,
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-md px-gutter-xl py-sm">
        <a
          href={homeHref}
          className="flex items-center gap-sm text-dark-blue hover:text-obx-blue transition-colors"
        >
          {logo ?? (
            <span className="font-heading text-heading-4 font-black uppercase tracking-tight">
              {businessName ?? "OuterBox"}
            </span>
          )}
        </a>

        {links?.length ? (
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-lg list-none p-0 m-0">
              {links.map((link) => (
                <li key={link.label + link.href}>
                  <a
                    href={link.href}
                    className="font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="flex items-center gap-sm">
          {primaryCta && (
            <Button href={primaryCta.href} variant="primary" className="hidden sm:inline-flex">
              {primaryCta.label}
            </Button>
          )}
          {links?.length ? (
            <details className="relative lg:hidden">
              <summary className="inline-flex size-xl cursor-pointer items-center justify-center rounded-button border-2 border-dark-blue text-dark-blue marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Open menu</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-md"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <nav
                aria-label="Mobile"
                className="absolute right-0 top-full mt-xs w-56 rounded-element border border-frost bg-white p-md shadow-lg"
              >
                <ul className="flex flex-col gap-sm list-none p-0 m-0">
                  {links.map((link) => (
                    <li key={"m-" + link.label + link.href}>
                      <a
                        href={link.href}
                        className="block font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  {primaryCta && (
                    <li className="pt-xs">
                      <Button href={primaryCta.href} variant="primary" className="w-full">
                        {primaryCta.label}
                      </Button>
                    </li>
                  )}
                </ul>
              </nav>
            </details>
          ) : null}
        </div>
      </div>
    </header>
  );
}
