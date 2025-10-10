import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import DeleteButton from "./_parts/DeleteButton";

// Label tampilan
const LABEL: Record<string, string> = {
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

export default async function AdminKoleksiList({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim();
  const ql = q.toLowerCase();

  const matchedCategories = q
    ? Object.entries(LABEL)
        .filter(([enumKey, label]) => {
          const ek = enumKey.toLowerCase();
          const lb = label.toLowerCase();
          return ek.includes(ql) || lb.includes(ql);
        })
        .map(([enumKey]) => enumKey)
    : [];

  const where: Prisma.CollectionItemWhereInput | undefined = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { regNumber: { contains: q, mode: "insensitive" } },
          { invNumber: { contains: q, mode: "insensitive" } },
          { material: { contains: q, mode: "insensitive" } },
          { originPlace: { contains: q, mode: "insensitive" } },
          { foundPlace: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          ...matchedCategories.map((c) => ({
            category: { equals: c as any },
          })),
        ],
      }
    : undefined;

  const items = await prisma.collectionItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      regNumber: true,
      invNumber: true,
      category: true,
      imageUrl: true,
    },
    take: 80,
  });

  const total = await prisma.collectionItem.count({ where });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Data Koleksi</h1>

        <div className="flex gap-2">
          {/* Search form: GET /admin/koleksi?q=... */}
          <form action="/admin/koleksi" method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              placeholder="Cari di admin…"
              defaultValue={q}
              className="border rounded px-3 py-2 w-64"
            />
            <button className="px-3 py-2 rounded bg-slate-700 text-white">
              Cari
            </button>
          </form>

          <Link
            href="/admin/koleksi/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Tambah Koleksi
          </Link>
        </div>
      </div>

      {q && (
        <p className="text-sm text-slate-600">
          Hasil admin untuk <span className="font-medium">“{q}”</span> —{" "}
          {total.toLocaleString("id-ID")} item
        </p>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Foto</th>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Reg.</th>
              <th className="p-2 text-left">Inv.</th>
              <th className="p-2 text-left">Kategori</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="p-2">
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="h-12 w-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="p-2 font-medium">{it.name}</td>
                <td className="p-2">{it.regNumber ?? "-"}</td>
                <td className="p-2">{it.invNumber ?? "-"}</td>
                <td className="p-2">
                  {it.category ? LABEL[it.category] ?? it.category : "-"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/koleksi/${encodeURIComponent(it.slug)}`}
                      className="px-2 py-1 border rounded"
                    >
                      Lihat
                    </Link>
                    <Link
                      href={`/admin/koleksi/${it.slug ?? it.id}/edit`}
                      className="px-2 py-1 border rounded"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={it.id} />
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  {q ? "Tidak ada hasil." : "Belum ada data."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
