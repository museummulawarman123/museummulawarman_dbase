export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

/* ===== Label kategori rapi ===== */
const LABEL: Record<string, string> = {
  GEOLOGIKA: "Geologika",
  BIOLOGIKA: "Biologika",
  ETNOGRAFIKA: "Etnografika",
  ARKEOLOGIKA: "Arkeologika",
  HISTORIKA: "Historika",
  NUMISMATIKA_HERALDIKA: "Numismatika & Heraldika",
  FILOLOGIKA: "Filologika",
  KERAMOLOGIKA: "Keramologika",
  SENI_RUPA: "Seni Rupa",
  TEKNOLOGIKA: "Teknologika",
};

/* ===== Dummy kalau DB kosong ===== */
const DUMMY: Record<string, {
  name: string;
  imageUrl?: string;
  category?: string;
  regNumber?: string;
  invNumber?: string;
  material?: string;
  period?: string;
  manufacturePlace?: string;
  acquisitionPlace?: string;
  acquisitionMethod?: string;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  diameterTop?: number;
  diameterMid?: number;
  diameterBot?: number;
  weightKg?: number;
  description?: string;
}> = {
  "patung-arca-kuno": {
    name: "Patung Arca Kuno",
    imageUrl: "/dummy-arca.jpg",
    category: "ARKEOLOGIKA",
    regNumber: "NR-001",
    invNumber: "INV-1001",
    material: "Batu",
    period: "Klasik",
    manufacturePlace: "Kutai",
    acquisitionPlace: "Kalimantan Timur",
    acquisitionMethod: "Ekskavasi",
    heightCm: 45,
    widthCm: 20,
    lengthCm: 18,
    weightKg: 3.4,
    description:
      "Contoh deskripsi patung arca kuno sebagai placeholder ketika basis data masih kosong.",
  },
};

/* ===== helpers ===== */
const v = (x: unknown) =>
  x === null || x === undefined || x === "" ? "-" : String(x);

const num = (n?: number | null, unit?: string) =>
  n == null
    ? "-"
    : `${Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 })}${
        unit ? ` ${unit}` : ""
      }`;

/* ===== Page ===== */
export default async function DetailPage({ params }: { params: { slug: string } }) {
  const raw = params.slug;
  const slug = decodeURIComponent(raw);

  // Cari pakai slug ATAU id (kalau link masih pakai id, tetap ketemu)
  let item: any = null;
  try {
    item = await prisma.collectionItem.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });
  } catch {
    item = null;
  }

  // Fallback dummy jika tidak ada di DB
  if (!item && DUMMY[slug]) {
    const d = DUMMY[slug]!;
    const label = d.category ? LABEL[d.category] ?? d.category : "-";
    return (
      <main className="container py-10">
        <HeaderAndInfo
          name={d.name}
          imageUrl={d.imageUrl}
          regNumber={d.regNumber}
          invNumber={d.invNumber}
          categoryLabel={label}
          lengthCm={d.lengthCm}
          widthCm={d.widthCm}
          heightCm={d.heightCm}
          diameterTop={d.diameterTop}
          diameterMid={d.diameterMid}
          diameterBot={d.diameterBot}
          weightKg={d.weightKg}
          material={d.material}
          manufacturePlace={d.manufacturePlace}
          acquisitionPlace={d.acquisitionPlace}
          acquisitionMethod={d.acquisitionMethod}
        />
        <Description content={d.description} />
      </main>
    );
  }

  // Tidak ada data sama sekali → 404
  if (!item) notFound();

  // Map field schema → UI
  const categoryLabel =
    item.category && LABEL[item.category as keyof typeof LABEL]
      ? LABEL[item.category as keyof typeof LABEL]
      : item.category ?? "-";

  const mapped = {
    name: item.name as string,
    imageUrl: item.imageUrl as string | null,
    regNumber: item.regNumber as string | null,
    invNumber: item.invNumber as string | null,
    categoryLabel,
    lengthCm: item.lengthCm as number | null,
    widthCm: item.widthCm as number | null,
    heightCm: item.heightCm as number | null,
    diameterTop: item.diameterTop as number | null,
    diameterMid: item.diameterMid as number | null,
    diameterBot: item.diameterBot as number | null,
    // schema kita pakai weightGr: int? → tampilkan kg
    weightKg: item.weightGr != null ? Number(item.weightGr) / 1000 : null,
    material: item.material as string | null,
    // schema: originPlace & foundPlace
    manufacturePlace: item.originPlace as string | null,
    acquisitionPlace: item.foundPlace as string | null,
    acquisitionMethod: item.acquisitionMethod as string | null,
    description: item.description as string | null,
  };

  return (
    <main className="container py-10">
      <HeaderAndInfo {...mapped} />
      <Description content={mapped.description} />
    </main>
  );
}

/* ========= sub-komponen presentational ========= */

function HeaderAndInfo(props: {
  name: string;
  imageUrl?: string | null;
  regNumber?: string | null;
  invNumber?: string | null;
  categoryLabel?: string | null;
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  diameterTop?: number | null;
  diameterMid?: number | null;
  diameterBot?: number | null;
  weightKg?: number | null;
  material?: string | null;
  manufacturePlace?: string | null;
  acquisitionPlace?: string | null;
  acquisitionMethod?: string | null;
}) {
  const hasAnySize =
    props.lengthCm ||
    props.widthCm ||
    props.heightCm ||
    props.diameterTop ||
    props.diameterMid ||
    props.diameterBot ||
    props.weightKg;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Foto (no-crop / letterbox) */}
<div className="rounded-xl border bg-slate-100 w-full max-w-2xl mx-auto h-[420px] flex items-center justify-center overflow-hidden">
  {props.imageUrl ? (
    <img
      src={props.imageUrl}
      alt={props.name}
      className="max-h-full max-w-full object-contain"
      loading="lazy"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-gray-500">
      Tidak ada foto
    </div>
  )}
</div>
      {/* Info kanan */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-700">
        <Field label="Nomor Registrasi" value={v(props.regNumber)} />
        <Field label="Nomor Inventaris" value={v(props.invNumber)} />

        <div className="col-span-2">
          <span className="block text-xs uppercase text-slate-500">
            Nama Koleksi
          </span>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-snug">
            {props.name}
          </h1>
        </div>

        <div>
          <span className="block text-xs uppercase text-slate-500">
            Kategori
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-sm">
            {v(props.categoryLabel)}
          </span>
        </div>

        {hasAnySize && (
          <div className="col-span-2">
            <span className="block text-xs uppercase text-slate-500">
              Ukuran
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>Panjang: <b>{num(props.lengthCm, "cm")}</b></div>
              <div>Lebar: <b>{num(props.widthCm, "cm")}</b></div>
              <div>Tinggi: <b>{num(props.heightCm, "cm")}</b></div>
              <div>Diameter Atas: <b>{num(props.diameterTop, "cm")}</b></div>
              <div>Diameter Tengah: <b>{num(props.diameterMid, "cm")}</b></div>
              <div>Diameter Bawah: <b>{num(props.diameterBot, "cm")}</b></div>
              <div>Berat: <b>{num(props.weightKg, "kg")}</b></div>
            </div>
          </div>
        )}

        <Field label="Bahan" value={v(props.material)} />
        <Field label="Tempat Pembuatan" value={v(props.manufacturePlace)} />
        <Field label="Tempat Perolehan" value={v(props.acquisitionPlace)} />
        <Field label="Cara Perolehan" value={v(props.acquisitionMethod)} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-xs uppercase text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Description({ content }: { content?: string | null }) {
  return (
    <section className="mt-6 border border-slate-300 rounded-xl p-4 col-span-2 bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Deskripsi</h2>
      <div className="mt-2 whitespace-pre-line text-slate-700 leading-relaxed text-justify min-h-[5rem]">
        {content ?? "Belum ada deskripsi."}
      </div>
    </section>
  );
}
