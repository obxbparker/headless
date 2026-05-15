import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type FooterLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

export type FooterAProps = {
  logo?: ReactNode;
  businessName?: string;
  tagline?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  columns?: FooterColumn[];
  socialLinks?: Array<{ platform: string; href: string }>;
  legalText?: string;
  className?: string;
};

export function FooterA({
  logo,
  businessName,
  tagline,
  contact,
  columns,
  socialLinks,
  legalText,
  className,
}: FooterAProps) {
  const year = new Date().getFullYear();
  const legalLine =
    legalText ??
    `© ${year} ${businessName ?? "OuterBox"}. All rights reserved.`;

  return (
    <footer
      data-block="footer-a"
      className={cn("w-full bg-dark-blue text-white px-gutter-xl", className)}
    >
      <div className="mx-auto flex max-w-content flex-col gap-xxl py-section-y">
        <div className="grid grid-cols-1 gap-xl md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-md">
            <div className="text-white">
              {logo ?? (
                <span className="font-heading text-heading-3 font-black uppercase tracking-tight text-white">
                  {businessName ?? "OuterBox"}
                </span>
              )}
            </div>
            {tagline && (
              <p className="max-w-body text-base leading-body text-frost">
                {tagline}
              </p>
            )}
            {contact && (
              <ul className="flex flex-col gap-xs list-none p-0 m-0 text-base text-frost">
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-gold transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-gold transition-colors"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="whitespace-pre-line">{contact.address}</li>
                )}
              </ul>
            )}
          </div>

          {columns?.length ? (
            <div className="grid grid-cols-2 gap-xl sm:grid-cols-3">
              {columns.map((col) => (
                <nav key={col.heading} aria-label={col.heading}>
                  <h3 className="font-heading text-heading-5 font-bold uppercase tracking-eyebrow text-gold">
                    {col.heading}
                  </h3>
                  <ul className="mt-md flex flex-col gap-xs list-none p-0">
                    {col.links.map((link) => (
                      <li key={link.label + link.href}>
                        <a
                          href={link.href}
                          className="text-base text-frost hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-md border-t border-slate/40 pt-lg text-small text-frost md:flex-row md:items-center">
          <p>{legalLine}</p>
          {socialLinks?.length ? (
            <ul className="flex items-center gap-md list-none p-0 m-0">
              {socialLinks.map((s) => (
                <li key={s.platform + s.href}>
                  <a
                    href={s.href}
                    aria-label={s.platform}
                    className="font-bold uppercase tracking-eyebrow text-gold hover:text-white transition-colors"
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
