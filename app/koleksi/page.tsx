export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Search = { q?: string; cat?: string };

const CAT_LABEL: Record<string, string> = {
  GEOLOGIKA: "Geologika",
  BIOLOGIKA: "Biologika",
  ETNOGRAFIKA: "Etnografika",
  ARKEOLOGIKA: "Arkeologika",
  HISTORIKA: "Historika",
  NUMISMATIKA_HERALDIKA: "Numismatika / Heraldika",
  FILOLOGIKA: "Filologika",
  KERAMOLOGIKA: "Keramologika",
  SENI_RUPA: "Seni Rupa",
  TEKNOLOGIKA: "Teknologika",
};

export default async function KoleksiPage(props: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = decodeURIComponent((searchParams.q ?? "").trim());
  const cat = decodeURIComponent((searchParams.cat ?? "").trim());

  // bangun where secara bertahap (lebih “kebaca” oleh Prisma)
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { regNumber: { contains: q, mode: "insensitive" } },
      { invNumber: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { material: { contains: q, mode: "insensitive" } },
      { originPlace: { contains: q, mode: "insensitive" } },
      { foundPlace: { contains: q, mode: "insensitive" } },
    ];
  }
  if (cat) {
    // jika schema pakai enum, cast saja ke any
    where.category = cat as any;
  }

  const items = await prisma.collectionItem.findMany({
    where,
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

  return (
    <main className="px-6 md:px-12 py-12 space-y-6">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">
        Koleksi Museum
      </h1>

      {/* SEARCH BAR */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari nama, nomor reg/inv, bahan, tempat…"
          className="border rounded px-3 py-2 w-full sm:max-w-xl"
        />
        <select name="cat" defaultValue={cat} className="border rounded px-3 py-2">
          <option value="">Semua Kategori</option>
          {Object.entries(CAT_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <button className="px-4 py-2 rounded bg-amber-600 text-white">Cari</button>
      </form>

      {(q || cat) && (
        <p className="text-sm text-slate-500">
          Menampilkan <b>{items.length}</b> hasil
          {q ? <> untuk "<b>{q}</b>"</> : null}
          {cat ? <> dalam <b>{CAT_LABEL[cat] ?? cat}</b></> : null}.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/koleksi/${encodeURIComponent(item.slug)}`}
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
                <p className="text-xs text-slate-500 mt-1">
                  {CAT_LABEL[item.category] ?? item.category}
                </p>
              )}
            </div>
          </Link>
        ))}
        {!items.length && (
          <div className="col-span-full text-slate-500">Tidak ada hasil.</div>
        )}
      </div>
    </main>
  );
}
