// lib/slug.ts
import { prisma } from "./prisma";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function uniqueSlug(name: string) {
  const base = normalize(name || "item");
  let s = base, i = 1;
  while (await prisma.collectionItem.findUnique({ where: { slug: s } })) {
    s = `${base}-${i++}`;
  }
  return s;
}
