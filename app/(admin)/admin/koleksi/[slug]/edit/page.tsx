import { prisma } from "@/lib/prisma";
import { updateCollection, deleteCollection } from "@/app/api/admin/koleksi/action";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

const categories = [
  { value: "GEOLOGIKA", label: "Geologika" },
  { value: "BIOLOGIKA", label: "Biologika" },
  { value: "ETNOGRAFIKA", label: "Etnografika" },
  { value: "ARKEOLOGIKA", label: "Arkeologika" },
  { value: "HISTORIKA", label: "Historika" },
  { value: "NUMISMATIKA_HERALDIKA", label: "Numismatika / Heraldika" },
  { value: "FILOLOGIKA", label: "Filologika" },
  { value: "KERAMOLOGIKA", label: "Keramologika" },
  { value: "SENI_RUPA", label: "Seni Rupa" },
  { value: "TEKNOLOGIKA", label: "Teknologika" },
];

const acquisitions = [
  { value: "", label: "-- Cara Perolehan --" },
  { value: "HADIAH", label: "Hadiah" },
  { value: "GANTI_RUGI", label: "Ganti Rugi" },
  { value: "BELI", label: "Beli" },
  { value: "TEMUAN", label: "Temuan" },
  { value: "HIBAH", label: "Hibah" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // wajib di-await
  const decoded = decodeURIComponent(slug);

  const item =
    (await prisma.collectionItem.findFirst({ where: { slug: decoded } })) ||
    (await prisma.collectionItem.findUnique({ where: { id: decoded } }));

  if (!item) notFound();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Koleksi</h1>

      {/* UPDATE */}
      <form action={async (formData) => {
  "use server";
 const res = await updateCollection(item.id, formData);
if (res.ok) redirect("/admin/koleksi");
 // biar balik ke listsi
        }}
        className="grid grid-cols-1 gap-4"
      >
        {/* Identitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input name="name" defaultValue={item.name} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug (unik)</label>
            <input name="slug" defaultValue={item.slug} className="border p-2 rounded w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              name="category"
              defaultValue={item.category ?? ""}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. Registrasi</label>
            <input name="regNumber" defaultValue={item.regNumber ?? ""} className="border p-2 rounded w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. Inventaris</label>
            <input name="invNumber" defaultValue={item.invNumber ?? ""} className="border p-2 rounded w-full" />
          </div>
        </div>

        {/* Info tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Periode</label>
            <input name="period" defaultValue={item.period ?? ""} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input name="material" defaultValue={item.material ?? ""} className="border p-2 rounded w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            defaultValue={item.description ?? ""}
            className="border p-2 rounded w-full min-h-[100px]"
          />
        </div>

        {/* Dimensi */}
        <div>
          <h2 className="text-sm font-medium mb-2">Dimensi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input name="lengthCm" defaultValue={item.lengthCm ?? ""} placeholder="Panjang (cm)" className="border p-2 rounded" />
            <input name="widthCm" defaultValue={item.widthCm ?? ""} placeholder="Lebar (cm)" className="border p-2 rounded" />
            <input name="heightCm" defaultValue={item.heightCm ?? ""} placeholder="Tinggi (cm)" className="border p-2 rounded" />
            <input name="diameterTop" defaultValue={item.diameterTop ?? ""} placeholder="Diameter Atas (cm)" className="border p-2 rounded" />
            <input name="diameterMid" defaultValue={item.diameterMid ?? ""} placeholder="Diameter Tengah (cm)" className="border p-2 rounded" />
            <input name="diameterBot" defaultValue={item.diameterBot ?? ""} placeholder="Diameter Bawah (cm)" className="border p-2 rounded" />
            <input name="weightGr" defaultValue={item.weightGr ?? ""} placeholder="Berat (gram)" className="border p-2 rounded" />
          </div>
        </div>

        {/* Asal-Usul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tempat Pembuatan</label>
            <input name="originPlace" defaultValue={item.originPlace ?? ""} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tempat Perolehan</label>
            <input name="foundPlace" defaultValue={item.foundPlace ?? ""} className="border p-2 rounded w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cara Perolehan</label>
          <select
            name="acquisitionMethod"
            defaultValue={item.acquisitionMethod ?? ""}
            className="border p-2 rounded w-full"
          >
            {acquisitions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Gambar */}
        <div>
          <label className="block text-sm font-medium mb-1">Ganti Foto (opsional)</label>
          <input type="file" name="image" accept="image/*" className="border p-2 rounded w-full" />
          {item.imageUrl ? (
            <p className="text-xs text-gray-500 mt-1">Foto saat ini: {item.imageUrl}</p>
          ) : null}
        </div>

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        </div>
      </form>

      {/* DELETE */}
      <form
        action={async () => {
          "use server";
          await deleteCollection(item.id);
          // deleteCollection sudah revalidate; redirect manual:
          // (tanpa import redirect di file ini)
        }}
        className="mt-4"
      >
        <button className="bg-red-600 text-white px-4 py-2 rounded">Hapus Koleksi</button>
      </form>
    </div>
  );
}
