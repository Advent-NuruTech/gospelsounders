"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";

export default function AddLessonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    year: new Date().getFullYear(),
    quarter: 1,
    description: "",
  });

  async function handleSubmit() {
    if (!file) return alert("PDF is required");
    setLoading(true);

    try {
      const pdfUrl = await uploadToCloudinary(file);
      const thumbnailUrl = thumbnail
        ? await uploadToCloudinary(thumbnail)
        : "";

      await addDoc(collection(db, "sabbath_school_lessons"), {
        ...form,
        pdfUrl,
        ...(thumbnailUrl && { thumbnailUrl }),
        createdAt: new Date(),
      });

      router.push("/admin/sabbath-school");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Add Lesson</h1>

      <input
        placeholder="Lesson Title"
        className="border p-2 w-full mb-2"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="date"
          className="border p-2"
          value={form.startDate}
          onChange={e => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          value={form.endDate}
          onChange={e => setForm({ ...form, endDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="number"
          className="border p-2"
          value={form.year}
          onChange={e => setForm({ ...form, year: Number(e.target.value) })}
        />
        <input
          type="number"
          min={1}
          max={4}
          className="border p-2"
          value={form.quarter}
          onChange={e => setForm({ ...form, quarter: Number(e.target.value) })}
        />
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        className="mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={e => setThumbnail(e.target.files?.[0] ?? null)}
        className="mb-2"
      />

      <RichTextEditor
        value={form.description}
        onChange={desc => setForm({ ...form, description: desc })}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded mt-4"
      >
        {loading ? "Saving..." : "Add Lesson"}
      </button>
    </div>
  );
}
