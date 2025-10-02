export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    let ok = false;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user?.password) ok = await bcrypt.compare(password, user.password);
    } catch {}

    if (!ok) {
      ok =
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASS;
    }

    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Email/Password salah" },
        { status: 401 }
      );
    }

    // ⬇️ tambahkan await
    const c = await cookies();
    c.set("admin_session", "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
