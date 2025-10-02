import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({ select: { email: true } });
    return NextResponse.json({
      db: process.env.DATABASE_URL,
      count: users.length,
      users,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "unknown", db: process.env.DATABASE_URL },
      { status: 500 }
    );
  }
}
