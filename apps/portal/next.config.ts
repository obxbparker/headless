import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@outerbox/ui", "@outerbox/ai-engine"],
  // @outerbox/ai-engine uses ESM-style `.js` imports that reference `.ts`
  // source files. Tell webpack to resolve `.js` to `.ts` first when bundling.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
      ".jsx": [".tsx", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
};

export default nextConfig;
