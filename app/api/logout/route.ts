import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // ⬇️ tambahkan await
  const c = await cookies();
  c.set("admin_session", "", { expires: new Date(0), path: "/" });
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
}