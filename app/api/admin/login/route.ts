// app/api/admin/login/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new NextResponse("User tidak ditemukan", { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return new NextResponse("Password salah", { status: 401 });

    // set cookie sederhana
    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("mm_token", "ok", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
