// components/admin/AdminShell.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Folder,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

type Props = { children: React.ReactNode };

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/koleksi', label: 'Data Koleksi', icon: Folder },
  { href: '/admin/koleksi/new', label: 'Tambah Koleksi', icon: PlusCircle },
];

export default function AdminShell({ children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 w-72 md:w-64 md:static inset-y-0 left-0 
        bg-gradient-to-b from-indigo-600 to-violet-600 text-white 
        shadow-xl transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-14 flex items-center px-5 font-semibold tracking-wide">
          Admin Panel
        </div>
        <nav className="px-3 pb-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm
                ${active ? 'bg-white/15' : 'hover:bg-white/10'}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <form action="/api/logout" method="post" className="pt-2">
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-white/70 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <button
            className="md:hidden rounded-md border px-2.5 py-1.5 text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="font-medium text-slate-700">Museum Mulawarman</div>
          <div className="text-xs text-slate-500 hidden md:block">
            v1.0
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
