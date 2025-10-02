import Link from "next/link";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { Merriweather, Inter } from "next/font/google";

const headingFont = Merriweather({ subsets: ["latin"], weight: ["700"] });
const bodyFont = Inter({ subsets: ["latin"], weight: ["300", "400"] });

export default async function HomePage() {
  const total = await prisma.collectionItem.count().catch(() => 0);

  return (
    <main
      className="relative min-h-[90vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/museumm.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="bg-white/80 backdrop-blur border-b">
          <div className="container h-14 flex items-center justify-between">
            <div className="text-lg font-semibold"></div>
            <a
              href="/admin/login"
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Masuk
            </a>
          </div>
        </div>

      {/* konten kiri dengan garis vertikal */}
      <section className="relative z-10 flex min-h-[90vh] items-center px-8 md:px-16">
        <div className="max-w-2xl text-left flex gap-5">
          {/* garis vertikal */}
          <div className="hidden md:block w-[3px] bg-gradient-to-b from-amber-300/70 to-yellow-500/70 rounded-full" />

          {/* teks utama */}
          <div>
            {/* Judul */}
            <h1
              className={`${headingFont.className} text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow`}
            >
              Selamat Datang
              <br /> di Museum Mulawarman
            </h1>

            {/* Tagline */}
            <p
              className={`${bodyFont.className} mt-4 text-base md:text-lg text-white/85 leading-relaxed`}
            >
              Jelajahi kekayaan warisan budaya dan temukan koleksi bersejarah
              yang penuh makna dan cerita.
            </p>

            {/* Tombol */}
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/koleksi"
                className="inline-block rounded-full bg-amber-400 px-8 py-3 text-base md:text-lg font-semibold text-slate-900 shadow-lg hover:bg-amber-300 hover:shadow-xl transition"
              >
                Jelajahi Koleksi
              </Link>
              

              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
