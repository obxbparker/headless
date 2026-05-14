import type { Config } from "tailwindcss";
import preset from "@outerbox/ui/tailwind.preset";

const config: Config = {
  presets: [preset as Config],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-roboto)",
          "Roboto",
          "Helvetica",
          "Arial",
          "Open Sans",
          "sans-serif",
        ],
        heading: [
          "var(--font-roboto)",
          "Roboto",
          "Helvetica",
          "Arial",
          "Open Sans",
          "sans-serif",
        ],
      },
    },
  },
};

export default config;
