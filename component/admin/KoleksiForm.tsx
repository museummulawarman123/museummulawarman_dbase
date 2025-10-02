"use client";

import { useState } from "react";

type Props = {
  action: string;               // endpoint POST
  method?: "POST" | "PATCH";
  defaults?: Record<string, any>;
  categories: string[];
};

export default function KoleksiForm({ action, method = "POST", defaults = {}, categories }: Props) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={action}
      method="POST"
      encType="multipart/form-data"
      className="space-y-3"
      onSubmit={(e) => {
        // biarkan HTML submit langsung ke endpoint server (no fetch)
        setSubmitting(true);
      }}
    >
      {method === "PATCH" && <input type="hidden" name="_method" value="PATCH" />}

      <Input name="name" label="Nama" defaultValue={defaults.name} required />
      <Input name="slug" label="Slug" defaultValue={defaults.slug} required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input name="regNumber" label="No. Registrasi" defaultValue={defaults.regNumber} />
        <Input name="invNumber" label="No. Inventaris" defaultValue={defaults.invNumber} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select name="category" label="Kategori" required defaultValue={defaults.category}
          options={categories.length ? categories : ["GEOLOGIKA", "BIOLOGIKA", "ETNOGRAFIKA", "ARKEOLOGIKA", "HISTORIKA",  "NUMISMATIKA", "FILOLOGIKA", "KERAMOLOGIKA", "SENI RUPA", "TEKNOLOGIKA",]} />
        <Input name="period" label="Periode/Zaman" defaultValue={defaults.period} />
      </div>

      <Input name="material" label="Bahan/Material" defaultValue={defaults.material} />
      <TextArea name="description" label="Deskripsi" defaultValue={defaults.description} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
  <Input type="number" name="lengthCm" label="Panjang (cm)" defaultValue={defaults.lengthCm} />
  <Input type="number" name="widthCm" label="Lebar (cm)" defaultValue={defaults.widthCm} />
  <Input type="number" name="heightCm" label="Tinggi (cm)" defaultValue={defaults.heightCm} />
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
  <Input type="number" name="diameterTop" label="Diameter Atas (cm)" defaultValue={defaults.diameterTop} />
  <Input type="number" name="diameterMid" label="Diameter Tengah (cm)" defaultValue={defaults.diameterMid} />
  <Input type="number" name="diameterBot" label="Diameter Bawah (cm)" defaultValue={defaults.diameterBot} />
</div>

<Input type="number" name="weightGr" label="Berat (gram)" defaultValue={defaults.weightGr} />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input name="originPlace" label="Tempat Pembuatan" defaultValue={defaults.originPlace} />
        <Input name="foundPlace" label="Tempat Perolehan" defaultValue={defaults.foundPlace} />
      </div>

      <Select
        name="acquisitionMethod"
        label="Cara Perolehan"
        defaultValue={defaults.acquisitionMethod}
        options={["HADIAH","GANTI RUGI", "BELI", "TEMUAN", "HIBAH", "LAINNYA"]}
      />

      <div>
        <div className="text-sm text-gray-600">Foto (jpg/png/webp)</div>
        <input type="file" name="image" accept="image/*" className="mt-1 w-full rounded border p-2" />
        {defaults.imageUrl && (
          <img src={defaults.imageUrl} alt="" className="mt-2 h-32 rounded border object-cover" />
        )}
      </div>

      <button
        disabled={submitting}
        className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}

function Input(p: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = p;
  return (
    <label className="block">
      <div className="text-sm text-gray-600">{label}</div>
      <input {...rest} className="mt-1 w-full rounded border px-3 py-2" />
    </label>
  );
}
function TextArea(p: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = p;
  return (
    <label className="block">
      <div className="text-sm text-gray-600">{label}</div>
      <textarea {...rest} className="mt-1 w-full rounded border px-3 py-2 min-h-28" />
    </label>
  );
}
function Select({ name, label, options, defaultValue, required }:{
  name: string; label: string; options: string[]; defaultValue?: string; required?: boolean
}) {
  return (
    <label className="block">
      <div className="text-sm text-gray-600">{label}</div>
      <select name={name} defaultValue={defaultValue} required={required} className="mt-1 w-full rounded border px-3 py-2">
        <option value="">-- pilih --</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
  );
}
