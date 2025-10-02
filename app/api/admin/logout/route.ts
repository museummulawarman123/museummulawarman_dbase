// app/api/admin/logout/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.set("mm_token", "", { path: "/", maxAge: 0 });
  return res;
}
