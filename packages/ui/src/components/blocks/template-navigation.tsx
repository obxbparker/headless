import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TemplateNavigationProps = {
  phone?: string;
  email?: string;
  secondaryCta?: { label: string; href: string };
  socialLinks?: Array<{ platform: string; href: string }>;
  className?: string;
  /**
   * Optional slot for a small icon (used when `socialLinks` is supplied).
   * Rendered as a fallback when no icon library is wired up yet.
   */
  renderSocialIcon?: (platform: string) => ReactNode;
};

export function TemplateNavigation({
  phone,
  email,
  secondaryCta,
  socialLinks,
  className,
  renderSocialIcon,
}: TemplateNavigationProps) {
  const hasContact = Boolean(phone || email);
  const hasRight = Boolean(secondaryCta || socialLinks?.length);
  if (!hasContact && !hasRight) return null;

  return (
    <div
      data-block="template-navigation"
      className={cn(
        "hidden w-full bg-dark-blue text-white md:block",
        className,
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-md px-gutter-xl py-xs text-small">
        <ul className="flex flex-wrap items-center gap-md list-none p-0 m-0">
          {phone && (
            <li>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="font-bold hover:text-gold transition-colors"
              >
                {phone}
              </a>
            </li>
          )}
          {email && (
            <li>
              <a
                href={`mailto:${email}`}
                className="hover:text-gold transition-colors"
              >
                {email}
              </a>
            </li>
          )}
        </ul>
        <div className="flex items-center gap-md">
          {socialLinks?.length ? (
            <ul className="flex items-center gap-sm list-none p-0 m-0">
              {socialLinks.map((s) => (
                <li key={s.platform + s.href}>
                  <a
                    href={s.href}
                    aria-label={s.platform}
                    className="inline-flex size-md items-center justify-center rounded-sm text-white hover:text-gold transition-colors"
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {renderSocialIcon ? (
                      renderSocialIcon(s.platform)
                    ) : (
                      <span className="text-eyebrow font-bold uppercase tracking-eyebrow">
                        {s.platform.charAt(0)}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="font-bold uppercase tracking-eyebrow text-gold hover:text-white transition-colors"
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
