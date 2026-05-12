import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonTone = "default" | "on-dark";

type AnchorProps = ComponentProps<"a"> & {
  as?: "a";
  variant?: ButtonVariant;
  tone?: ButtonTone;
  children: ReactNode;
};

type ButtonElementProps = ComponentProps<"button"> & {
  as?: "button";
  variant?: ButtonVariant;
  tone?: ButtonTone;
  children: ReactNode;
};

export type ButtonProps = AnchorProps | ButtonElementProps;

const baseClasses =
  "inline-flex items-center justify-center gap-xs rounded-button px-md py-sm font-bold uppercase tracking-eyebrow text-base leading-body whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantClasses: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    default:
      "bg-obx-blue text-white hover:bg-deep-blue focus-visible:ring-obx-blue",
    "on-dark":
      "bg-orange text-white hover:bg-gold hover:text-dark-blue focus-visible:ring-gold",
  },
  secondary: {
    default:
      "bg-orange text-white hover:bg-obx-blue focus-visible:ring-orange",
    "on-dark":
      "bg-white text-obx-blue hover:bg-frost focus-visible:ring-white",
  },
  outline: {
    default:
      "border-2 border-obx-blue text-obx-blue hover:bg-obx-blue hover:text-white focus-visible:ring-obx-blue",
    "on-dark":
      "border-2 border-white text-white hover:bg-white hover:text-dark-blue focus-visible:ring-white",
  },
  ghost: {
    default:
      "text-obx-blue hover:bg-frost focus-visible:ring-obx-blue",
    "on-dark":
      "text-white hover:bg-white/10 focus-visible:ring-white",
  },
};

export function Button(props: ButtonProps) {
  const {
    as,
    variant = "primary",
    tone = "default",
    className,
    children,
    ...rest
  } = props as ButtonProps & { className?: string };

  const classes = cn(baseClasses, variantClasses[variant][tone], className);

  if (as === "button" || (!as && "type" in rest)) {
    return (
      <button className={classes} {...(rest as ComponentProps<"button">)}>
        {children}
      </button>
    );
  }

  return (
    <a className={classes} {...(rest as ComponentProps<"a">)}>
      {children}
    </a>
  );
}
