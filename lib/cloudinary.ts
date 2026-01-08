export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/cloudinary", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Cloudinary API error:", errorText);
    throw new Error("Cloudinary upload failed");
  }

  const data: { secure_url: string } = await res.json();
  return data.secure_url;
}
