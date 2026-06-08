import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root contains a pnpm extension project, so Next would otherwise
  // infer the workspace root one level up. Pin Turbopack's root to this folder
  // for local builds. NOTE: do NOT set `outputFileTracingRoot` here — on Vercel
  // it re-bases the @vercel/next builder and makes it look for `.next` at the
  // repo root (/vercel/path0/.next) instead of website/.next, failing the deploy.
  turbopack: { root: __dirname },
};

export default nextConfig;
