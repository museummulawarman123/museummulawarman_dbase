// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  eslint: {
    // ⛳️ lewati ESLint waktu build production (biar Vercel nggak fail)
    ignoreDuringBuilds: true,
  },
  // (opsional) kalau mau longgar banget:
//  typescript: { ignoreBuildErrors: true },

  experimental: {
    serverActions: { bodySizeLimit: "10mb" }, // amanin upload form
  },
};

export default config;
