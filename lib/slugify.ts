// lib/slugify.ts
export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // spasi => -
    .replace(/[^\w\-]+/g, "") // buang karakter aneh
    .replace(/\-\-+/g, "-");  // duplikat - jadi satu
}

/** Tambah akhiran -2, -3, ... jika sudah ada di DB */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
  excludeId?: string
): Promise<string> {
  let s = slugify(base);
  if (!(await exists(s))) return s;

  let i = 2;
  while (await exists(`${s}-${i}`)) i++;
  return `${s}-${i}`;
}
