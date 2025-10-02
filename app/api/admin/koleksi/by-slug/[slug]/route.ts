
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  const item = await prisma.collectionItem.findUnique({
    where: { slug: params.slug },
  });
  if (!item) return new NextResponse("Tidak ditemukan", { status: 404 });
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: Request, { params }: Params) {
  const ct = req.headers.get("content-type") || "";
  let body: Record<string, any> = {};
  if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
    const fd = await req.formData();
    fd.forEach((v, k) => (body[k] = typeof v === "string" ? v : undefined));
  } else {
    body = await req.json().catch(() => ({}));
  }

  const item = await prisma.collectionItem.update({
    where: { slug: params.slug },
    data: {
      name: body.name ?? undefined,
      regNumber: body.regNumber ?? undefined,
      invNumber: body.invNumber ?? undefined,
      category: body.category ?? undefined,
      description: body.description ?? undefined,
      material: body.material ?? undefined,
      imageUrl: body.imageUrl ?? undefined,
    },
  });

  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.collectionItem.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new NextResponse("Gagal menghapus.", { status: 400 });
  }
}
