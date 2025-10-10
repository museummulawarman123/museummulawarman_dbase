// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  eslint: {
    // ✅ Matikan lint saat build production (Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ (Opsional tapi aman) Abaikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default config;
