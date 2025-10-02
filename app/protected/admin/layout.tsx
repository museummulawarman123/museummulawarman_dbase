// app/(protected)/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mm_token")?.value;

  // jika belum login, lempar ke /login (bukan /admin/login)
  if (!token) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar Admin sederhana */}
      <header className="sticky top-0 z-10 bg-indigo-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">Admin Panel</h1>
          <a
            href="/api/admin/logout"
            className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
          >
            Logout
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
