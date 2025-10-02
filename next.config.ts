// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lewati lint saat build produksi (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // kalau nanti pakai <Image/> dari Cloudinary
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
