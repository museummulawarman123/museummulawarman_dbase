// app/api/admin/koleksi/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

/** Enum versi string-union, aman untuk Prisma versi berapa pun */
type Category =
  | "GEOLOGIKA"
  | "BIOLOGIKA"
  | "ETNOGRAFIKA"
  | "ARKEOLOGIKA"
  | "HISTORIKA"
  | "NUMISMATIKA_HERALDIKA"
  | "FILOLOGIKA"
  | "KERAMOLOGIKA"
  | "SENI_RUPA"
  | "TEKNOLOGIKA";

type AcquisitionMethod = "HADIAH" | "GANTI_RUGI" | "BELI";

function intOrNull(v: FormDataEntryValue | null) {
  if (!v) return null;
  const n = parseInt(String(v), 10);
  return Number.isNaN(n) ? null : n;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // upload image jika ada
    let imageUrl: string | null = null;
    const file = form.get("image");
    if (file && file instanceof File && file.size > 0) {
      const up = await uploadImage(file);
      imageUrl = up.imageUrl;
    }

    const name = String(form.get("name") ?? "");
    if (!name) return NextResponse.json({ ok: false, error: "Nama wajib" }, { status: 400 });

    const rawSlug = String(form.get("slug") ?? "");
    const slug = rawSlug ? slugify(rawSlug) : slugify(name);

    const category = (form.get("category") as Category | null) ?? null;
    const acquisitionMethod = (form.get("acquisitionMethod") as AcquisitionMethod | null) ?? null;

    const data = {
      name,
      slug,
      category,
      acquisitionMethod,
      regNumber: String(form.get("regNumber") ?? "") || null,
      invNumber: String(form.get("invNumber") ?? "") || null,
      description: String(form.get("description") ?? "") || null,
      period: String(form.get("period") ?? "") || null,
      material: String(form.get("material") ?? "") || null,
      lengthCm: intOrNull(form.get("lengthCm")),
      widthCm: intOrNull(form.get("widthCm")),
      heightCm: intOrNull(form.get("heightCm")),
      diameterTop: intOrNull(form.get("diameterTop")),
      diameterMid: intOrNull(form.get("diameterMid")),
      diameterBot: intOrNull(form.get("diameterBot")),
      weightGr: intOrNull(form.get("weightGr")),
      originPlace: String(form.get("originPlace") ?? "") || null,
      foundPlace: String(form.get("foundPlace") ?? "") || null,
      imageUrl,
    };

    await prisma.collectionItem.create({ data });

    // redirect balik ke daftar admin
    return NextResponse.redirect(new URL("/admin/koleksi", req.url), 303);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
