export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DetailKoleksiPage({ params }: { params: { slug: string } }) {
  const item = await prisma.collectionItem.findFirst({ where: { slug: params.slug } });
  if (!item) return notFound();

  return (
    <main className="p-6 max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.name}</h1>
        <Link href={`/admin/koleksi/${item.slug}/edit`} className="rounded border px-3 py-2 text-sm">Edit</Link>
      </div>

      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="rounded-xl border max-h-72 object-cover" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Slug" value={item.slug} />
        <Info label="Kategori" value={item.category ?? '-'} />
        <Info label="No. Registrasi" value={item.regNumber ?? '-'} />
        <Info label="No. Inventaris" value={item.invNumber ?? '-'} />
        <Info label="Bahan / Material" value={item.material ?? '-'} />
        <Info label="Periode" value={item.period ?? '-'} />
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
