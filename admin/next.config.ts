import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages "Next.js (Static HTML Export)" → /out
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
