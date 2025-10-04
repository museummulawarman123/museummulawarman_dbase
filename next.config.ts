// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // <-- kuncinya di bawah 'experimental'
    serverActions: {
      // bentuk string '10mb' aman di Next 15.x
      bodySizeLimit: "15mb", // atau "20mb"
    },
  },
};

export default nextConfig;
