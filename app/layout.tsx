import "./globals.css";
import type { Metadata } from "next";
// app/layout.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Museum Mulawarman",
  description: "Koleksi Museum",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-dvh bg-slate-50 text-slate-900">
     
        

        {children}
      </body>
    </html>
  );
}
