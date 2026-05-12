export type ImageRef = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type CtaRef = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
};

export type SurfaceTone = "light" | "frost" | "dark" | "obx-blue" | "deep-blue";
