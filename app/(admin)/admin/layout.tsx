// app/(admin)/admin/layout.tsx
import Link from "next/link";
// app/(admin)/admin/layout.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { ReactNode } from "react";
import {
  Home,
  BarChart3,
  FolderOpen,
  PlusCircle,
  LogOut,
  Landmark,
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-indigo-100/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Admin Panel</p>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                Museum Mulawarman
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-50"
          >
            Lihat Situs
          </Link>
        </div>
      </header>

      {/* Body grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="h-max rounded-2xl border border-indigo-100/70 bg-white/80 p-3 shadow-sm backdrop-blur">
          <nav className="space-y-1">
            <SidebarItem href="/" icon={<Home className="h-4 w-4" />}>
              Home
            </SidebarItem>
            <SidebarItem
              href="/admin"
              icon={<BarChart3 className="h-4 w-4" />}
            >
              Dashboard
            </SidebarItem>
            <SidebarItem
              href="/admin/koleksi"
              icon={<FolderOpen className="h-4 w-4" />}
            >
              Data Koleksi
            </SidebarItem>
            <SidebarItem
              href="/admin/koleksi/new"
              icon={<PlusCircle className="h-4 w-4" />}
            >
              Tambah Koleksi
            </SidebarItem>

            <div className="my-3 border-t border-dashed border-indigo-100/70" />

            <SidebarItem
              href="/api/logout"
              icon={<LogOut className="h-4 w-4" />}
            >
              Keluar
            </SidebarItem>
          </nav>
        </aside>

        {/* Content */}
        <main className="rounded-2xl border border-indigo-100/70 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
    >
      <span className="grid h-7 w-7 place-items-center rounded-lg border border-indigo-100 bg-white text-indigo-600 transition group-hover:border-indigo-200 group-hover:bg-indigo-100">
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}
