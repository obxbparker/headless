export const fontFamilies = {
  body: ["Roboto", "Helvetica", "Arial", "Open Sans", "sans-serif"],
  heading: ["Roboto", "Helvetica", "Arial", "Open Sans", "sans-serif"],
} as const;

export const fontWeights = {
  regular: 400,
  bold: 700,
  black: 900,
} as const;

export const fontSizes = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  md: "20px",
  lg: "24px",
  xl: "32px",
  "2xl": "40px",
  "3xl": "48px",
} as const;

export const headingSizes = {
  h1: fontSizes["3xl"],
  h2: fontSizes["2xl"],
  h3: fontSizes.xl,
  h4: fontSizes.lg,
  h5: fontSizes.md,
  h6: fontSizes.base,
  eyebrow: fontSizes.base,
} as const;

export const lineHeights = {
  tight: 1.25,
  body: 1.5,
  none: 1,
} as const;

export const letterSpacings = {
  normal: "0",
  eyebrow: "1px",
} as const;
