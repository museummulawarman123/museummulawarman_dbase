// app/(admin)/admin/koleksi/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "./_parts/DeleteButton";

// Label kategori rapi untuk tampilan tabel
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

export default async function AdminKoleksiList() {
  const items = await prisma.collectionItem.findMany({
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Data Koleksi</h1>
        <Link
          href="/admin/koleksi/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Tambah Koleksi
        </Link>
      </div>

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
                    {/* Detail publik */}
                    <Link
                      href={`/koleksi/${encodeURIComponent(it.slug)}`}
                      className="px-2 py-1 border rounded"
                    >
                      Lihat
                    </Link>

                    {/* Edit admin (pakai slug sesuai rute kamu) */}
                    <Link href={`/admin/koleksi/${it.slug ?? it.id}/edit`} className="px-2 py-1 border rounded">
  Edit
</Link>


                    {/* Hapus via API DELETE /api/admin/koleksi/[id] */}
                    <DeleteButton id={it.id} />
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
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
