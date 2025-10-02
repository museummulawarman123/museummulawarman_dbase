// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // naikkan sesuai kebutuhan
      bodySizeLimit: "7mb",
      // opsional:
      // allowedOrigins: ["localhost:3000"]
    },
  },
};

export default nextConfig;
