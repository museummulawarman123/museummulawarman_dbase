// app/api/admin/import/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Route: POST /api/admin/import
 * - menerima multipart/form-data (field "file") atau raw text body CSV
 * - parse CSV (support quoted fields)
 * - build records, normalize fields
 * - bulk insert menggunakan createMany dengan chunking
 *
 * Catatan:
 * - imageUrl diabaikan (upload foto terpisah)
 * - slug dibuat dari normalized name/slug + short random suffix (meminimalkan DB roundtrips)
 * - createMany digunakan dengan skipDuplicates: true
 */

/* ====== allowed enum values (Prisma schema) ====== */
const CATEGORY = new Set([
  "GEOLOGIKA",
  "BIOLOGIKA",
  "ETNOGRAFIKA",
  "ARKEOLOGIKA",
  "HISTORIKA",
  "NUMISMATIKA_HERALDIKA",
  "FILOLOGIKA",
  "KERAMOLOGIKA",
  "SENI_RUPA",
  "TEKNOLOGIKA",
]);

const ACQ = new Set([
  "HADIAH",
  "GANTI_RUGI",
  "BELI",
  "TEMUAN",
  "HIBAH",
  "LAINNYA",
]);

/* ====== util helpers ====== */
const toStr = (v: unknown) => (v == null ? "" : String(v).trim());
const toInt = (v: unknown) => {
  const s = toStr(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

// normalisasi enum input -> uppercase enum key or null
function normalizeEnum(input: string, table: Set<string>): string | null {
  if (!input) return null;
  const up = input
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[&/]+/g, "_");
  const alias: Record<string, string> = {
    "NUMISMATIKA_&_HERALDIKA": "NUMISMATIKA_HERALDIKA",
    "NUMISMATIKA_DAN_HERALDIKA": "NUMISMATIKA_HERALDIKA",
  };
  const candidate = alias[up] ?? up;
  return table.has(candidate) ? candidate : null;
}

// slug quick normalize (no DB calls)
function normalizeSlugBase(s: string) {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function randomSuffix(len = 4) {
  return Math.random().toString(36).slice(2, 2 + len);
}

/* ====== CSV parser (simple but handles quoted fields + CRLF) ====== */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      // handle escaped double quotes inside quoted field ("" -> ")
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (!inQuotes && (ch === "," || ch === "\t")) {
      row.push(cur);
      cur = "";
      i++;
      continue;
    }

    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      // finish row
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      }
      // skip CRLF duo
      if (ch === "\r" && text[i + 1] === "\n") i++;
      i++;
      continue;
    }

    cur += ch;
    i++;
  }

  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }

  // remove totally empty lines
  return rows.filter((r) => r.some((c) => toStr(c) !== ""));
}

/* ====== read incoming body: support multipart file OR raw text ====== */
async function readIncomingCSV(req: Request): Promise<string> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    const file = fd.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error('Field file tidak ditemukan. Gunakan multipart/form-data dengan "file" sebagai name.');
    }
    return await file.text();
  }
  // fallback: raw body text (text/csv)
  return await req.text();
}

/* ====== main handler ====== */
export async function POST(req: Request) {
  try {
    const csvText = await readIncomingCSV(req);
    if (!csvText || !csvText.trim()) {
      return NextResponse.json({ ok: false, error: "CSV kosong." }, { status: 400 });
    }

    const rows = parseCSV(csvText);
    if (!rows.length) {
      return NextResponse.json({ ok: false, error: "Tidak ada baris data pada CSV." }, { status: 400 });
    }

    // header mapping (lowercased)
    const header = rows[0].map((h) => toStr(h).toLowerCase());
    const dataRows = rows.slice(1);

    const idx = (name: string) => header.indexOf(name.toLowerCase());

    const col = {
      name: idx("name"),
      slug: idx("slug"),
      regNumber: idx("regnumber"),
      invNumber: idx("invnumber"),
      description: idx("description"),
      period: idx("period"),
      material: idx("material"),
      imageUrl: idx("imageurl"),
      lengthCm: idx("lengthcm"),
      widthCm: idx("widthcm"),
      heightCm: idx("heightcm"),
      diameterTop: idx("diametertop"),
      diameterMid: idx("diametermid"),
      diameterBot: idx("diameterbot"),
      weightGr: idx("weightgr"),
      originPlace: idx("originplace"),
      foundPlace: idx("foundplace"),
      category: idx("category"),
      acquisitionMethod: idx("acquisitionmethod"),
    };

    const toInsert: any[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (let r = 0; r < dataRows.length; r++) {
      const row = dataRows[r];
      const get = (i: number) => (i >= 0 && i < row.length ? row[i] : "");

      const name = toStr(get(col.name));
      if (!name) {
        errors.push({ row: r + 2, error: 'Kolom "name" wajib diisi.' });
        continue;
      }

      const slugInput = toStr(get(col.slug));
      const base = slugInput || name;
      const normalized = normalizeSlugBase(base) || "item";
      const slug = `${normalized}-${randomSuffix(4)}`;

      const rec: any = {
        name,
        slug,
        regNumber: toStr(get(col.regNumber)) || null,
        invNumber: toStr(get(col.invNumber)) || null,
        description: toStr(get(col.description)) || null,
        period: toStr(get(col.period)) || null,
        material: toStr(get(col.material)) || null,
        imageUrl: null,
        lengthCm: toInt(get(col.lengthCm)),
        widthCm: toInt(get(col.widthCm)),
        heightCm: toInt(get(col.heightCm)),
        diameterTop: toInt(get(col.diameterTop)),
        diameterMid: toInt(get(col.diameterMid)),
        diameterBot: toInt(get(col.diameterBot)),
        weightGr: toInt(get(col.weightGr)),
        originPlace: toStr(get(col.originPlace)) || null,
        foundPlace: toStr(get(col.foundPlace)) || null,
        category: null,
        acquisitionMethod: null,
      };

      const catRaw = toStr(get(col.category));
      const acqRaw = toStr(get(col.acquisitionMethod));
      const cat = normalizeEnum(catRaw, CATEGORY);
      const acq = normalizeEnum(acqRaw, ACQ);
      if (cat) rec.category = cat;
      if (acq) rec.acquisitionMethod = acq;

      toInsert.push(rec);
    }

    // Bulk insert in chunks using createMany
    const CHUNK = 200;
    let inserted = 0;

    for (let i = 0; i < toInsert.length; i += CHUNK) {
      const chunk = toInsert.slice(i, i + CHUNK);
      try {
        // createMany lebih cepat daripada create per-row.
        // skipDuplicates true agar slug unik menyebabkan skip kalau collision.
        const res = await prisma.collectionItem.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        // Prisma createMany biasanya mengembalikan { count: number }
        inserted += (res as any).count ?? 0;
      } catch (e: any) {
        // catat error umum untuk chunk ini
        errors.push({ row: i + 2, error: e?.message ?? "DB chunk error" });
      }
    }

    return NextResponse.json({
      ok: true,
      inserted,
      failed: errors.length,
      errors,
      hint:
        "Kolom dikenali: name, slug, regNumber, invNumber, description, period, material, lengthCm, widthCm, heightCm, diameterTop, diameterMid, diameterBot, weightGr, originPlace, foundPlace, category, acquisitionMethod. Image upload dilakukan terpisah.",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Import gagal" }, { status: 400 });
  }
}
