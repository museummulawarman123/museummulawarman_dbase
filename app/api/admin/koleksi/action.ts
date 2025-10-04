"use server";

import { prisma } from "@/lib/prisma";

/* ================== Helpers ================== */
function pickStr(v: FormDataEntryValue | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}
function pickInt(v: FormDataEntryValue | null): number | null {
  const s = pickStr(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/* ================== (Opsional) Upload via server fallback ==================
   Tetap disediakan kalau suatu saat kamu kirim "image" kecil lewat server. */
async function uploadImageFromFormFile(file: File): Promise<string> {
  // Jalur unsigned (aman untuk server juga)
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || process.env.CLOUDINARY_FOLDER || "koleksi";

  if (!cloud || !preset) {
    throw new Error("Cloudinary env belum di-set (CLOUDINARY_* atau NEXT_PUBLIC_*).");
  }

  const fd = new FormData();
  fd.append("upload_preset", preset);
  fd.append("folder", folder);
  fd.append("file", file);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("[cloudinary upload fallback] failed:", res.status, t);
    throw new Error(`Cloudinary upload failed: ${res.status}`);
  }
  const json = await res.json();
  return json.secure_url as string;
}

/* ================== CREATE ================== */
export async function createKoleksi(formData: FormData) {
  try {
    const name = pickStr(formData.get("name"));
    const slug = pickStr(formData.get("slug"));
    const category = pickStr(formData.get("category"));
    const regNumber = pickStr(formData.get("regNumber"));
    const invNumber = pickStr(formData.get("invNumber"));
    const period = pickStr(formData.get("period"));
    const material = pickStr(formData.get("material"));
    const description = pickStr(formData.get("description"));

    const lengthCm = pickInt(formData.get("lengthCm"));
    const widthCm = pickInt(formData.get("widthCm"));
    const heightCm = pickInt(formData.get("heightCm"));
    const diameterTop = pickInt(formData.get("diameterTop"));
    const diameterMid = pickInt(formData.get("diameterMid"));
    const diameterBot = pickInt(formData.get("diameterBot"));
    const weightGr = pickInt(formData.get("weightGr"));

    const originPlace = pickStr(formData.get("originPlace"));
    const foundPlace = pickStr(formData.get("foundPlace"));
    const acquisitionMethod = pickStr(formData.get("acquisitionMethod"));

    // ⬇️ UTAMAKAN URL dari client uploader
    let imageUrl: string | null = pickStr(formData.get("imageUrl"));

    // fallback: kalau masih ada file (dev lokal kecil) → upload via server
    if (!imageUrl) {
      const file = formData.get("image");
      if (file && file instanceof File && file.size > 0) {
        imageUrl = await uploadImageFromFormFile(file);
      }
    }

    if (!name || !slug) throw new Error("Nama dan slug wajib diisi.");

    await prisma.collectionItem.create({
      data: {
        name,
        slug,
        category: category as any,
        regNumber,
        invNumber,
        period,
        material,
        description,
        lengthCm,
        widthCm,
        heightCm,
        diameterTop,
        diameterMid,
        diameterBot,
        weightGr,
        originPlace,
        foundPlace,
        acquisitionMethod: acquisitionMethod as any,
        imageUrl,
      },
    });

    return { ok: true } as const;
  } catch (e: any) {
    console.error("[createKoleksi] failed:", e);
    return { ok: false, error: e?.message ?? "UNKNOWN" } as const;
  }
}

/* ================== UPDATE ================== */
export async function updateCollection(id: string, formData: FormData) {
  try {
    const name = pickStr(formData.get("name"));
    const slug = pickStr(formData.get("slug"));
    const category = pickStr(formData.get("category"));
    const regNumber = pickStr(formData.get("regNumber"));
    const invNumber = pickStr(formData.get("invNumber"));

    const period = pickStr(formData.get("period"));
    const material = pickStr(formData.get("material"));
    const description = pickStr(formData.get("description"));

    const lengthCm = pickInt(formData.get("lengthCm"));
    const widthCm = pickInt(formData.get("widthCm"));
    const heightCm = pickInt(formData.get("heightCm"));
    const diameterTop = pickInt(formData.get("diameterTop"));
    const diameterMid = pickInt(formData.get("diameterMid"));
    const diameterBot = pickInt(formData.get("diameterBot"));
    const weightGr = pickInt(formData.get("weightGr"));

    const originPlace = pickStr(formData.get("originPlace"));
    const foundPlace = pickStr(formData.get("foundPlace"));
    const acquisitionMethod = pickStr(formData.get("acquisitionMethod"));

    // ⬇️ UTAMAKAN imageUrl dari client uploader
    let imageUrl: string | undefined = pickStr(formData.get("imageUrl")) ?? undefined;

    // fallback: kalau masih ada file → upload via server
    if (!imageUrl) {
      const img = formData.get("image");
      if (img && img instanceof File && img.size > 0) {
        imageUrl = await uploadImageFromFormFile(img);
      }
    }

    await prisma.collectionItem.update({
      where: { id },
      data: {
        ...(name !== null && { name }),
        ...(slug !== null && { slug }),
        ...(category !== null && { category: category as any }),
        regNumber,
        invNumber,
        period,
        material,
        description,
        lengthCm,
        widthCm,
        heightCm,
        diameterTop,
        diameterMid,
        diameterBot,
        weightGr,
        originPlace,
        foundPlace,
        ...(acquisitionMethod !== null && { acquisitionMethod: acquisitionMethod as any }),
        ...(imageUrl && { imageUrl }),
      },
    });

    return { ok: true } as const;
  } catch (e: any) {
    console.error("[updateCollection] failed:", e);
    return { ok: false, error: e?.message ?? "UNKNOWN" } as const;
  }
}

/* ================== DELETE ================== */
export async function deleteCollection(id: string) {
  try {
    await prisma.collectionItem.delete({ where: { id } });
    return { ok: true } as const;
  } catch (e: any) {
    console.error("[deleteCollection] failed:", e);
    return { ok: false, error: e?.message ?? "UNKNOWN" } as const;
  }
}
