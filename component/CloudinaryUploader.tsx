"use client";

import { useState } from "react";

type Props = {
  /** nama input hidden yang akan dikirim ke server action */
  name?: string;
  /** folder di Cloudinary (opsional) */
  folder?: string;
  /** label di form */
  label?: string;
};

export default function CloudinaryUploader({
  name = "imageUrl",
  folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "koleksi",
  label = "Foto",
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);

    // Validasi ringan (opsional)
    const okMime = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!okMime.includes(file.type)) {
      setErr("Tipe gambar tidak didukung");
      return;
    }

    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    if (!cloud || !preset) {
      setErr("Env Cloudinary (NEXT_PUBLIC_*) belum diset");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", preset);
    fd.append("folder", folder);

    setUploading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json?.error?.message || "Upload gagal");
      }

      setPreview(json.secure_url);

      // isi hidden input di form dengan URL gambar
      const hidden = document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
      if (hidden) hidden.value = json.secure_url;
    } catch (e: any) {
      setErr(e?.message || "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {/* input file yang upload langsung ke Cloudinary */}
      <input type="file" accept="image/*" onChange={onChange} className="border rounded p-2 w-full" />
      {/* hidden field yang ikut terkirim ke server action */}
      <input type="hidden" name={name} />
      {uploading && <p className="text-xs text-slate-500">Mengunggah...</p>}
      {err && <p className="text-xs text-red-600">{err}</p>}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="preview"
            className="h-36 w-auto rounded border object-contain bg-slate-50"
          />
          <p className="text-xs text-slate-500 truncate">{preview}</p>
        </div>
      )}
    </div>
  );
}
