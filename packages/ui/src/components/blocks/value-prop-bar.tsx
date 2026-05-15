import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ValuePropBarBackground = "white" | "frost" | "dark";

export type ValuePropItem = {
  icon?: ReactNode;
  title: string;
  body?: string;
};

export type ValuePropBarProps = {
  items: ValuePropItem[];
  background?: ValuePropBarBackground;
  className?: string;
};

const bgClasses: Record<ValuePropBarBackground, string> = {
  white: "bg-white",
  frost: "bg-frost",
  dark: "bg-dark-blue",
};

export function ValuePropBar({
  items,
  background = "frost",
  className,
}: ValuePropBarProps) {
  const isOnDark = background === "dark";
  const textColor = isOnDark ? "text-white" : "text-dark-blue";
  const subColor = isOnDark ? "text-frost" : "text-slate";
  const iconColor = isOnDark ? "text-gold" : "text-orange";
  const borderColor = isOnDark ? "border-slate/40" : "border-dark-blue/10";

  return (
    <section
      data-block="value-prop-bar"
      className={cn(
        "relative w-full px-gutter-xl py-xl",
        bgClasses[background],
        className,
      )}
    >
      <ul
        className={cn(
          "mx-auto grid max-w-content list-none gap-lg p-0 my-0",
          items.length >= 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : items.length === 3
              ? "sm:grid-cols-3"
              : "sm:grid-cols-2",
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-start gap-md py-xs",
              idx > 0 && "border-t pt-md sm:border-t-0 sm:pt-xs sm:border-l sm:pl-md",
              borderColor,
            )}
          >
            {item.icon && (
              <div className={cn("flex size-xl items-center justify-center", iconColor)}>
                {item.icon}
              </div>
            )}
            <div className="flex flex-col gap-xxs">
              <p className={cn("font-heading text-heading-5 font-bold leading-tight", textColor)}>
                {item.title}
              </p>
              {item.body && (
                <p className={cn("text-small leading-body", subColor)}>
                  {item.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
