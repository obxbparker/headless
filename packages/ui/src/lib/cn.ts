import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge that our custom heading/eyebrow utilities live in the
// font-size class group. Without this, twMerge treats e.g. `text-heading-1`
// as a `text-{color}` and drops it when combined with `text-white` — so every
// heading silently inherits 16px body size.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6", "eyebrow"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
