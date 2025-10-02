
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import Link from "next/link";

import { prisma } from "@/lib/prisma";

// bikin tipe sederhana untuk item koleksi
type ItemLite = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  category?: string | null;
};

export default async function KoleksiPage() {
  let items: ItemLite[] = await prisma.collectionItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      category: true,
    },
  });

  // kalau kosong, pakai dummy contoh
  if (items.length === 0) {
    items = [
      {
        id: "dummy-1",
        slug: "patung-arca-kuno",
        name: "Patung Arca Kuno",
        imageUrl: "/dummy-arca.jpg",
        category: "ARKEOLOGIKA",
      },
      {
        id: "dummy-2",
        slug: "naskah-lontar",
        name: "Naskah Lontar Kuno",
        imageUrl: "/dummy-naskah.jpg",
        category: "FILOLOGIKA",
      },
      {
        id: "dummy-3",
        slug: "lukisan-tradisional",
        name: "Lukisan Tradisional",
        imageUrl: "/dummy-lukisan.jpg",
        category: "SENI_RUPA",
      },
    ];
  }

  return (
    <main className="px-6 md:px-12 py-12">
      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-slate-800">
        Koleksi Museum
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/koleksi/${item.slug}`}
            className="group bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
          >
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Tidak ada gambar
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-medium text-slate-800 group-hover:text-amber-600 line-clamp-2">
                {item.name}
              </h2>
              {item.category && (
                <p className="text-xs text-slate-500 mt-1">{item.category}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
