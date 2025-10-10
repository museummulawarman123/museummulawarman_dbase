export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

const CATEGORY_ORDER = [
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

type GroupRow = { category: string | null; _count: { _all: number } };

export default async function AdminDashboardPage() {
  const TARGET_TOTAL =
    Number(process.env.TOTAL_KOLEKSI) > 0 ? Number(process.env.TOTAL_KOLEKSI) : 5309;

  // Hitung jumlah total & per kategori
  const totalInput = await prisma.collectionItem.count();

  const grouped = (await prisma.collectionItem.groupBy({
    by: ["category"],
    _count: { _all: true },
  })) as any; // 👈 fix error type groupBy()

  const countMap = new Map<string, number>();
  for (const g of grouped as GroupRow[]) {
    const key = g.category ?? "TANPA_KATEGORI";
    countMap.set(key, g._count._all);
  }

  // Gabungkan semua kategori, termasuk 0 & tanpa kategori
  const data: { label: string; count: number }[] = CATEGORY_ORDER.map(([val, label]) => ({
    label,
    count: countMap.get(val) ?? 0,
  }));

  const nullCount = countMap.get("TANPA_KATEGORI") ?? 0;
  if (nullCount > 0) {
    data.push({ label: "Tanpa Kategori", count: nullCount });
  }

  const progress =
    TARGET_TOTAL > 0 ? Math.min(100, Math.round((totalInput / TARGET_TOTAL) * 100)) : 0;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Kartu Ringkasan */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Target Koleksi" value={TARGET_TOTAL.toLocaleString("id-ID")} />
        <Card title="Sudah Terinput" value={totalInput.toLocaleString("id-ID")} />
        <Card title="Progress" value={`${progress}%`} />
      </section>

      {/* Progress Bar */}
      <section className="rounded-xl border p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress Input</span>
          <span>
            {totalInput.toLocaleString("id-ID")} / {TARGET_TOTAL.toLocaleString("id-ID")} (
            {progress}%)
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Tabel Kategori */}
      <section className="rounded-xl border p-4">
        <div className="text-sm text-gray-500 mb-2">Koleksi per Kategori</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Kategori</th>
              <th className="py-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((r) => (
                <tr key={r.label} className="border-b last:border-0">
                  <td className="py-2 pr-4">{r.label}</td>
                  <td className="py-2">{r.count.toLocaleString("id-ID")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 text-gray-500 italic" colSpan={2}>
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
