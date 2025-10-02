export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('HEALTHZ ERROR:', e);
    return NextResponse.json({ ok: false, message: e?.message }, { status: 500 });
  }
}
