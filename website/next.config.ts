import type { NextConfig } from "next";

// Static export for GitHub Pages (see .github/workflows/deploy-website.yml).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // The repo root contains a pnpm extension project, so Next would otherwise
  // infer the workspace root one level up. Pin Turbopack's root to this folder.
  turbopack: { root: __dirname },
};

export default nextConfig;
