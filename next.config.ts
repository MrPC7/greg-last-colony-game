import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repo-name>. Set via NEXT_PUBLIC_BASE_PATH
// (see .env.production and .github/workflows/deploy.yml). Empty in `next dev`.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // cacheComponents/partialPrefetching are disabled: Next 16 fails the build with
  // "Invariant: PPR cannot be enabled in export mode" when combined with output: 'export'.
  cacheComponents: false,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
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
