// app/(admin)/admin/koleksi/import/page.tsx
"use client";

import { useState } from "react";

export default function ImportPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Import gagal.");
      }

      setResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Import Koleksi dari File CSV
      </h1>

      <p className="text-slate-600 text-sm">
        Unggah file <code>.csv</code> berisi data koleksi. Pastikan kolom utama{" "}
        <b>name</b> terisi. Kolom lain (seperti category, regNumber, dll) opsional. <br />
        <span className="text-slate-500">
          Contoh kolom: name, category, regNumber, invNumber, description,
          period, material, lengthCm, widthCm, heightCm, diameterTop, diameterMid,
          diameterBot, weightGr, originPlace, foundPlace, acquisitionMethod
        </span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-4 bg-white shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pilih File CSV
          </label>
          <input
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="block w-full border border-slate-300 rounded-md p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Mengunggah..." : "Mulai Import"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 rounded-md p-3 text-sm">
          <b>Gagal:</b> {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Hasil Import:</h2>
          <pre className="text-xs bg-gray-900 text-green-200 p-3 rounded-md overflow-auto max-h-[400px] whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </main>
  );
}
