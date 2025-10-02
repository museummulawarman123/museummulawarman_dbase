// app/admin/koleksi/tambah/page.tsx
import { redirect } from "next/navigation";
import { createKoleksi } from "@/app/api/admin/koleksi/action";
import Link from "next/link";

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
] as const;

export default async function TambahKoleksiPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Tambah Koleksi</h1>

      {/* PENTING: JANGAN set method / encType kalau pakai server action */}
      <form
        action={async (formData) => {
          "use server";
          const res = await createKoleksi(formData);
          if (res.ok) {
            redirect("/admin/koleksi");
          }
          // kalau gagal, biarkan tetap di halaman ini (Next akan re-render)
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Nama*</label>
          <input
            name="name"
            required
            className="border rounded p-2 w-full"
            placeholder="Nama koleksi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            name="slug"
            className="border rounded p-2 w-full"
            placeholder="(boleh dikosongkan jika server-mu sudah auto-generate)"
          />
          <p className="text-xs text-slate-500 mt-1">
            Jika dikosongkan dan server belum auto generate, isi manual.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Kategori*</label>
          <select name="category" required className="border rounded p-2 w-full">
            {CATEGORY_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Metode Perolehan</label>
          <select name="acquisitionMethod" className="border rounded p-2 w-full">
            {ACQ_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">No. Registrasi</label>
            <input name="regNumber" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">No. Inventaris</label>
            <input name="invNumber" className="border rounded p-2 w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea name="description" className="border rounded p-2 w-full" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Periode</label>
            <input name="period" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bahan</label>
            <input name="material" className="border rounded p-2 w-full" />
          </div>
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
              <label className="block text-sm">Berat (gr)</label>
              <input name="weightGr" type="number" className="border rounded p-2 w-full" />
            </div>
          </div>
        </fieldset>

        {/* Lokasi */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Tempat Pembuatan</label>
            <input name="originPlace" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Tempat Perolehan</label>
            <input name="foundPlace" className="border rounded p-2 w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Foto</label>
          {/* file input tetap biasa saja; Next akan kirim sebagai multipart untuk server action */}
          <input name="image" type="file" accept="image/*" className="border rounded p-2 w-full" />
        </div>

       <div className="flex gap-3">
  <button className="bg-indigo-600 text-white px-4 py-2 rounded">Simpan</button>
  {/* dulu pakai <a href="/admin/koleksi">Batal</a> */}
  <Link href="/admin/koleksi" className="px-4 py-2 rounded border">
    Batal
  </Link>
</div>
      </form>
    </div>
  );
}
