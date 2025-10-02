export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export default async function DebugPrismaPage() {
  const count = await prisma.collectionItem.count().catch((e) => `ERR: ${e?.message}`);
  return <pre style={{padding:16}}>{JSON.stringify({ collectionItem_count: count }, null, 2)}</pre>;
}
