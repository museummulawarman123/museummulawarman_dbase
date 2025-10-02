// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_DEFAULT_EMAIL ?? "");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      // sukses -> ke dashboard
      window.location.href = "/admin";
    } else {
      const msg = await res.text();
      alert(msg || "Login gagal");
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center bg-slate-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold">Login Admin</h1>

        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          className="mb-4 w-full rounded-md border px-3 py-2"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mb-2 block text-sm font-medium">Kata Sandi</label>
        <input
          className="mb-6 w-full rounded-md border px-3 py-2"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          type="submit"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
