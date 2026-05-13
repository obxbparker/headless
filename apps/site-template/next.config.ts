import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@outerbox/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
