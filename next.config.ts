import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "nvidia-fe-stock-checker",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;