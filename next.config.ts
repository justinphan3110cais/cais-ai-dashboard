import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mov)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
