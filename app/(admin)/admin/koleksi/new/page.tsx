export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createKoleksi } from "@/app/api/admin/koleksi/action";

const CATEGORY_OPTIONS = [
  ["GEOLOGIKA", "Geologika"],
  ["BIOLOGIKA", "Biologika"],
  ["ETNOGRAFIKA", "Etnografika"],
  ["ARKEOLOGIKA", "Arkeologika"],
  ["HISTORIKA", "Historika"],
  ["NUMISMATIKA_HERALDIKA", "Numismatika / Heraldika"],
  ["FILOLOGIKA", "Filologika"],
  ["KERAMOLOGIKA", "Keramologika"],
  ["SENI_RUPA", "Seni Rupa"],
  ["TEKNOLOGIKA", "Teknologika"],
] as const;

const ACQ_OPTIONS = [
  ["", "-"],
  ["TEMUAN", "Temuan"],
  ["HADIAH", "Hadiah"],
  ["GANTI_RUGI", "Ganti Rugi"],
  ["BELI", "Beli"],
  ["HIBAH", "Hibah"],
  ["LAINNYA", "Lainnya"],
] as const;

export default async function NewCollectionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header: title kiri, tombol kanan */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Tambah Koleksi</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/koleksi/import"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Import Excel
          </Link>
          <Link
            href="/admin/koleksi"
            className="inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Kembali ke List
          </Link>
        </div>
      </div>

      {/* Form Tambah (Server Action) */}
      <form
        action={async (formData) => {
          "use server";
          const res = await createKoleksi(formData);
          if (res?.ok) {
            redirect("/admin/koleksi");
          }
          // (opsional) kalau mau, bisa tampilkan error pakai redirect ke ?error=...
        }}
        className="space-y-4"
      >
        {/* Identitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nama*</label>
            <input
              name="name"
              required
              className="border rounded p-2 w-full"
              placeholder="Nama koleksi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              className="border rounded p-2 w-full"
              placeholder="Boleh dikosongkan jika sudah auto-generate di server"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori*</label>
            <select name="category" required className="border rounded p-2 w-full">
              {CATEGORY_OPTIONS.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cara Perolehan</label>
            <select name="acquisitionMethod" className="border rounded p-2 w-full">
              {ACQ_OPTIONS.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. Registrasi</label>
            <input name="regNumber" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">No. Inventaris</label>
            <input name="invNumber" className="border rounded p-2 w-full" />
          </div>
        </div>

        {/* Info tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Periode</label>
            <input name="period" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bahan / Material</label>
            <input name="material" className="border rounded p-2 w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            className="border rounded p-2 w-full min-h-[120px]"
            placeholder="Deskripsi singkat koleksi"
          />
        </div>

        {/* Dimensi */}
        <fieldset className="border rounded p-4">
          <legend className="text-sm font-medium">Dimensi (cm / gr)</legend>
          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm">Panjang (cm)</label>
              <input name="lengthCm" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Lebar (cm)</label>
              <input name="widthCm" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Tinggi (cm)</label>
              <input name="heightCm" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Diameter Atas (cm)</label>
              <input name="diameterTop" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Diameter Tengah (cm)</label>
              <input name="diameterMid" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Diameter Bawah (cm)</label>
              <input name="diameterBot" type="number" className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Berat (gram)</label>
              <input name="weightGr" type="number" className="border rounded p-2 w-full" />
            </div>
          </div>
        </fieldset>

        {/* Lokasi/Asal-usul */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tempat Pembuatan</label>
            <input name="originPlace" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tempat Perolehan</label>
            <input name="foundPlace" className="border rounded p-2 w-full" />
          </div>
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-medium mb-1">Foto</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="border rounded p-2 w-full"
          />
          <p className="text-xs text-slate-500 mt-1">
            Untuk file &gt; 1MB pertimbangkan kompres dulu agar unggah lebih lancar.
          </p>
        </div>

        {/* Aksi */}
        <div className="flex gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
          <Link href="/admin/koleksi" className="px-4 py-2 rounded border">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
