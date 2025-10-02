import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // ⬇️ tambahkan await
  const c = await cookies();
  c.set("admin_session", "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
