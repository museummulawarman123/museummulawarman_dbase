"use server";

import { prisma } from "@/lib/prisma";

function ensureUnsignedEnv() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Set CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET di .env.local lalu restart dev server.");
  }
}

/* ================== Upload Guard ================== */
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const MAX_UPLOAD_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 4 * 1024 * 1024); // 4MB default

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

/* Upload ke Cloudinary dari File browser (dengan validasi & log) */
async function uploadImageFromFormFile(file: File): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET!;
  const folder = process.env.CLOUDINARY_FOLDER || "koleksi";

  if (!cloud || !preset) {
    throw new Error("CLOUDINARY_CLOUD_NAME & CLOUDINARY_UPLOAD_PRESET wajib di .env.local");
  }

  const fd = new FormData();
  fd.append("upload_preset", preset);  // unsigned preset
  fd.append("folder", folder);
  fd.append("file", file);             // langsung kirim File dari form

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[cloudinary unsigned upload] failed:", res.status, text);
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

    let imageUrl: string | null = null;
    const file = formData.get("image");
    if (file && file instanceof File && file.size > 0) {
      imageUrl = await uploadImageFromFormFile(file);
    } else {
      console.log("[create] no image uploaded.");
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
    // Log supaya tahu FormData-nya punya file atau tidak
    const probe = formData.get("image");
    console.log("[update] image field:", probe ? typeof probe : probe);

    // Identitas
    const name = pickStr(formData.get("name"));
    const slug = pickStr(formData.get("slug"));
    const category = pickStr(formData.get("category"));
    const regNumber = pickStr(formData.get("regNumber"));
    const invNumber = pickStr(formData.get("invNumber"));

    // Info tambahan
    const period = pickStr(formData.get("period"));
    const material = pickStr(formData.get("material"));
    const description = pickStr(formData.get("description"));

    // Dimensi
    const lengthCm = pickInt(formData.get("lengthCm"));
    const widthCm = pickInt(formData.get("widthCm"));
    const heightCm = pickInt(formData.get("heightCm"));
    const diameterTop = pickInt(formData.get("diameterTop"));
    const diameterMid = pickInt(formData.get("diameterMid"));
    const diameterBot = pickInt(formData.get("diameterBot"));
    const weightGr = pickInt(formData.get("weightGr"));

    // Asal-usul
    const originPlace = pickStr(formData.get("originPlace"));
    const foundPlace = pickStr(formData.get("foundPlace"));
    const acquisitionMethod = pickStr(formData.get("acquisitionMethod"));

    // Gambar (opsional)
    let imageUrl: string | undefined;
    const img = formData.get("image");
    if (img && img instanceof File && img.size > 0) {
      imageUrl = await uploadImageFromFormFile(img);
    } else {
      console.log("[update] no new image uploaded.");
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
        ...(acquisitionMethod !== null && {
          acquisitionMethod: acquisitionMethod as any,
        }),
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
