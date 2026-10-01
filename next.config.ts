import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    LOCAL_API_HOST: process.env.LOCAL_API_HOST ?? "",
  },
};

export default nextConfig;
