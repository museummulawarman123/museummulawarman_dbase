export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./_parts/DeleteButton";

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

export default async function AdminKoleksiList(props: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  // ✅ sekarang di-await dulu
  const searchParams = await props.searchParams;
  const q = decodeURIComponent((searchParams.q ?? "").trim());
  const cat = decodeURIComponent((searchParams.cat ?? "").trim());

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
  if (cat) where.category = cat as any;

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
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Data Koleksi</h1>

        {/* FORM SEARCH */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari nama/slug/reg/inv/…"
            className="border rounded px-3 py-2"
          />
          <select name="cat" defaultValue={cat} className="border rounded px-3 py-2">
            <option value="">Semua</option>
            {Object.entries(LABEL).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
          <button className="px-3 py-2 rounded bg-slate-800 text-white">Cari</button>

          <Link
            href="/admin/koleksi/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded ml-2"
          >
            Tambah Koleksi
          </Link>
        </form>
      </div>
      // di /app/(admin)/admin/koleksi/page.tsx – di header halaman
<Link href="/admin/koleksi/import" className="border px-3 py-2 rounded">Import Excel</Link>


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
            {!items.length && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
