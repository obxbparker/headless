import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../primitives/button";

export type MainNavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
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
        "sticky top-0 z-40 w-full border-b border-frost bg-white px-gutter-xl",
        className,
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-md py-sm">
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
                <NavItem key={link.label + link.href} link={link} />
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
                className="absolute right-0 top-full mt-xs w-64 rounded-element border border-frost bg-white p-md shadow-lg"
              >
                <ul className="flex flex-col gap-sm list-none p-0 m-0">
                  {links.map((link) => (
                    <li key={"m-" + link.label + link.href} className="flex flex-col gap-xxs">
                      <a
                        href={link.href}
                        className="block font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange"
                      >
                        {link.label}
                      </a>
                      {link.children?.length ? (
                        <ul className="ml-md flex flex-col gap-xxs list-none p-0 m-0 border-l-2 border-frost pl-sm">
                          {link.children.map((c) => (
                            <li key={"mc-" + c.label + c.href}>
                              <a
                                href={c.href}
                                className="block text-small text-slate hover:text-orange"
                              >
                                {c.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
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

function NavItem({ link }: { link: MainNavLink }) {
  const hasChildren = Boolean(link.children?.length);
  if (!hasChildren) {
    return (
      <li>
        <a
          href={link.href}
          className="font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
        >
          {link.label}
        </a>
      </li>
    );
  }

  return (
    <li className="group relative">
      <a
        href={link.href}
        aria-haspopup="true"
        className="inline-flex items-center gap-xxs font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:text-orange transition-colors"
      >
        {link.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-3 transition-transform group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </a>
      <div
        className={cn(
          "invisible absolute left-0 top-full z-50 min-w-[240px] pt-xs opacity-0 transition-opacity",
          "group-hover:visible group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        <ul
          role="menu"
          className="flex flex-col list-none p-xs my-0 rounded-element border border-frost bg-white shadow-md"
        >
          {link.children!.map((child) => (
            <li key={child.label + child.href} role="none">
              <a
                role="menuitem"
                href={child.href}
                className="block rounded-sm px-md py-sm font-bold uppercase tracking-eyebrow text-eyebrow text-dark-blue hover:bg-frost hover:text-orange transition-colors"
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
