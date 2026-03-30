import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
