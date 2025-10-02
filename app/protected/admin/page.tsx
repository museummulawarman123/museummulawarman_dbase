// app/(protected)/admin/page.tsx
export default async function AdminDashboard() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      {/* contoh kartu ringkasan */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Koleksi Terinput</p>
          <p className="mt-1 text-3xl font-semibold">0</p>
          <p className="mt-1 text-sm text-slate-500">dari total 5.039 koleksi</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Kategori Terisi</p>
          <p className="mt-1 text-3xl font-semibold">0 / 10</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Rata-rata / Kategori</p>
          <p className="mt-1 text-3xl font-semibold">0</p>
          <p className="mt-1 text-sm text-slate-500">Estimasi sebaran</p>
        </div>
      </div>

      {/* Pembagian koleksi per kategori – contoh grid */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold">Pembagian Koleksi per Kategori</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Geologika","Biologika","Etnografika",
            "Arkeologika","Historika","Numismatika & Heraldika",
            "Filologika","Keramologika","Seni Rupa",
          ].map((k) => (
            <div key={k} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span>{k}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm">0</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
