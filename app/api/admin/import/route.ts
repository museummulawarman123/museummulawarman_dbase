// app/api/admin/import/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uniqueSlug } from '@/lib/slug'; // <-- pakai fungsi kamu sendiri

// ====== enum valid dari schema Prisma (harus uppercase persis) ======
const CATEGORY = new Set([
  'GEOLOGIKA',
  'BIOLOGIKA',
  'ETNOGRAFIKA',
  'ARKEOLOGIKA',
  'HISTORIKA',
  'NUMISMATIKA_HERALDIKA',
  'FILOLOGIKA',
  'KERAMOLOGIKA',
  'SENI_RUPA',
  'TEKNOLOGIKA',
]);

const ACQ = new Set([
  'HADIAH',
  'GANTI_RUGI',
  'BELI',
  'TEMUAN',
  'HIBAH',
  'LAINNYA',
]);

// ====== util kecil ======
const toStr = (v: unknown) => (v == null ? '' : String(v).trim());
const toInt = (v: unknown) => {
  const s = toStr(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

// Konversi kategori / akuisisi input bebas ke enum DB (toleran)
function normalizeEnum(input: string, table: Set<string>): string | null {
  if (!input) return null;
  const up = input.toUpperCase().replace(/\s+/g, '_').replace(/[&/]+/g, '_');
  // beberapa alias umum
  const alias: Record<string, string> = {
    'NUMISMATIKA_&_HERALDIKA': 'NUMISMATIKA_HERALDIKA',
    'NUMISMATIKA_DAN_HERALDIKA': 'NUMISMATIKA_HERALDIKA',
  };
  const candidate = alias[up] ?? up;
  return table.has(candidate) ? candidate : null;
}

// Parser CSV sederhana (tahan tanda kutip)
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur = '';
  let row: string[] = [];
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      // escape double quotes ("") di dalam quoted field
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (!inQuotes && (ch === ',' || ch === '\t')) {
      // dukung CSV/TSV (koma atau tab)
      row.push(cur);
      cur = '';
      i++;
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      // akhiri baris
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = '';
      }
      // lewati CRLF
      if (ch === '\r' && text[i + 1] === '\n') i++;
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

  // buang baris kosong total
  return rows.filter(r => r.some(c => toStr(c) !== ''));
}

// Baca payload: multipart(file) ATAU raw text
async function readIncomingCSV(req: Request): Promise<string> {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const file = fd.get('file');
    if (!file || !(file instanceof File)) {
      throw new Error('Field file tidak ditemukan. Kirim sebagai multipart dengan name="file".');
    }
    return await file.text();
  }
  // fallback: raw text
  return await req.text();
}

// ====== ROUTE POST: import CSV ======
export async function POST(req: Request) {
  try {
    const csvText = await readIncomingCSV(req);
    if (!csvText || !csvText.trim()) {
      return NextResponse.json(
        { ok: false, error: 'CSV kosong.' },
        { status: 400 }
      );
    }

    const rows = parseCSV(csvText);
    if (!rows.length) {
      return NextResponse.json(
        { ok: false, error: 'Tidak ada baris data pada CSV.' },
        { status: 400 }
      );
    }

    // header → key map (lowercase)
    const header = rows[0].map(h => toStr(h).toLowerCase());
    const dataRows = rows.slice(1);

    // kolom yang didukung
    // (bebas urutan, nama kolom tidak case-sensitive)
    // name (wajib), slug (opsional), sisanya sesuai schema
    const idx = (name: string) => header.indexOf(name.toLowerCase());

    const col = {
      name: idx('name'),
      slug: idx('slug'),
      regNumber: idx('regnumber'),
      invNumber: idx('invnumber'),
      description: idx('description'),
      period: idx('period'),
      material: idx('material'),
      imageUrl: idx('imageurl'), // diabaikan (kamu bilang upload belakangan)
      lengthCm: idx('lengthcm'),
      widthCm: idx('widthcm'),
      heightCm: idx('heightcm'),
      diameterTop: idx('diametertop'),
      diameterMid: idx('diametermid'),
      diameterBot: idx('diameterbot'),
      weightGr: idx('weightgr'),
      originPlace: idx('originplace'),
      foundPlace: idx('foundplace'),
      category: idx('category'),
      acquisitionMethod: idx('acquisitionmethod'),
    };

    let inserted = 0;
    const errors: Array<{ row: number; error: string }> = [];

    for (let r = 0; r < dataRows.length; r++) {
      const row = dataRows[r];

      // ambil helper nilai kolom dg aman
      const get = (i: number) => (i >= 0 && i < row.length ? row[i] : '');

      const name = toStr(get(col.name));
      if (!name) {
        errors.push({ row: r + 2, error: 'Kolom "name" wajib diisi.' });
        continue;
      }

      let slugInput = toStr(get(col.slug));
      // slug final → pastikan unik
      const slug = await uniqueSlug(slugInput || name);

      // parse & normalisasi
      const payload = {
        name,
        slug,
        regNumber: toStr(get(col.regNumber)) || null,
        invNumber: toStr(get(col.invNumber)) || null,
        description: toStr(get(col.description)) || null,
        period: toStr(get(col.period)) || null,
        material: toStr(get(col.material)) || null,
        // imageUrl diabaikan (kamu bilang upload foto nanti)
        imageUrl: null as string | null,

        lengthCm: toInt(get(col.lengthCm)),
        widthCm: toInt(get(col.widthCm)),
        heightCm: toInt(get(col.heightCm)),
        diameterTop: toInt(get(col.diameterTop)),
        diameterMid: toInt(get(col.diameterMid)),
        diameterBot: toInt(get(col.diameterBot)),
        weightGr: toInt(get(col.weightGr)),

        originPlace: toStr(get(col.originPlace)) || null,
        foundPlace: toStr(get(col.foundPlace)) || null,

        category: null as any,
        acquisitionMethod: null as any,
      };

      // enum mapping
      const catRaw = toStr(get(col.category));
      const acqRaw = toStr(get(col.acquisitionMethod));
      const cat = normalizeEnum(catRaw, CATEGORY);
      const acq = normalizeEnum(acqRaw, ACQ);

      if (cat) payload.category = cat as any;
      if (acq) payload.acquisitionMethod = acq as any;

      try {
        await prisma.collectionItem.create({ data: payload });
        inserted++;
      } catch (e: any) {
        errors.push({
          row: r + 2,
          error: e?.message || 'DB error',
        });
      }
    }

    return NextResponse.json({
      ok: true,
      inserted,
      failed: errors.length,
      errors, // kalau ada, kasih row CSV (mulai dari 2 = baris pertama data)
      hint: 'Kolom yang dikenali: name, slug, regNumber, invNumber, description, period, material, lengthCm, widthCm, heightCm, diameterTop, diameterMid, diameterBot, weightGr, originPlace, foundPlace, category, acquisitionMethod.',
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'Import gagal' },
      { status: 400 }
    );
  }
}
