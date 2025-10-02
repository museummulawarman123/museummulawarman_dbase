// lib/upload.ts
export async function uploadImage(file: File) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const fd = new FormData();
  fd.set("file", file);
  fd.set("upload_preset", uploadPreset);

  const res = await fetch(endpoint, { method: "POST", body: fd });
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  }

  const json = (await res.json()) as { secure_url: string };
  return { imageUrl: json.secure_url as string };
}
