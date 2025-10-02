"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Login gagal");
      } else {
        // cookie dibuat oleh /api/login → redirect ke dashboard
        window.location.href = "/admin";
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-xl font-semibold mb-4">Login Admin</h1>
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-3"
          value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="block text-sm mb-1">Kata Sandi</label>
        <input className="w-full border rounded px-3 py-2 mb-4"
          type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading}
          className="w-full rounded bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-500 disabled:opacity-60">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
