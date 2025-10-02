export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const TARGET_TOTAL =
    Number(process.env.TOTAL_KOLEKSI) > 0 ? Number(process.env.TOTAL_KOLEKSI) : 5039;

  const totalInput = await prisma.collectionItem.count();

  const grouped = await prisma.collectionItem.groupBy({
  by: ['category'],
  _count: { _all: true },
});

// tipe aman untuk hasil groupBy
type GroupRow = { category: string | null; _count: { _all: number } };

const data = (grouped as GroupRow[]).map((g: GroupRow) => ({
  category: g.category ?? 'Tanpa Kategori',
  count: g._count._all,
}));


  const progress = Math.min(100, Math.round((totalInput / TARGET_TOTAL) * 100));

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Target Koleksi" value={TARGET_TOTAL.toLocaleString()} />
        <Card title="Sudah Terinput" value={totalInput.toLocaleString()} />
        <Card title="Progress" value={`${progress}%`} />
      </section>

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
            {data.length ? data.map(r => (
              <tr key={r.category} className="border-b last:border-0">
                <td className="py-2 pr-4">{r.category}</td>
                <td className="py-2">{r.count}</td>
              </tr>
            )) : (
              <tr><td className="py-4 text-gray-500 italic" colSpan={2}>Belum ada data.</td></tr>
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
