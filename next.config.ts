import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    webpackBuildWorker: false,
    parallelServerCompiles: false,
  },
};

export default nextConfig;