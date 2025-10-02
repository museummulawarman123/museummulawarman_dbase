// app/(admin)/admin/_parts/DeleteButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, start] = useTransition();

  const onDelete = () => {
    if (!confirm("Yakin menghapus data ini?")) return;

    start(async () => {
      const res = await fetch(`/api/admin/koleksi/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Gagal menghapus.");
        return;
      }
      // refresh tabel
      router.refresh();
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
