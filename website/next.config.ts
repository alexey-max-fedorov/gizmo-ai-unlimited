import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root contains a pnpm extension project; pin tracing to this folder
  // so Next does not walk up into the extension's node_modules.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
