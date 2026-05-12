import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type EyebrowProps = {
  children: ReactNode;
  tone?: "default" | "on-dark";
  className?: string;
};

export function Eyebrow({
  children,
  tone = "default",
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-eyebrow font-bold uppercase tracking-eyebrow leading-body",
        tone === "on-dark" ? "text-gold" : "text-orange",
        className,
      )}
    >
      {children}
    </p>
  );
}
