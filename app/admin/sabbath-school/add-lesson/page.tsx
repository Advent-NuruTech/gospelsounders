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
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Add Sabbath School Lesson
      </h1>

      {/* FORM CARD */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow p-5 space-y-4">
        <input
          placeholder="Lesson Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full p-2 rounded border bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            border-gray-300 dark:border-gray-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className="p-2 rounded border bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border-gray-300 dark:border-gray-600"
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className="p-2 rounded border bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="number"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: Number(e.target.value) })
            }
            className="p-2 rounded border bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border-gray-300 dark:border-gray-600"
          />

          <input
            type="number"
            min={1}
            max={4}
            value={form.quarter}
            onChange={(e) =>
              setForm({ ...form, quarter: Number(e.target.value) })
            }
            className="p-2 rounded border bg-white dark:bg-gray-800
              text-gray-800 dark:text-gray-200
              border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Lesson PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
            className="text-sm text-gray-600 dark:text-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Thumbnail (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbnail(e.target.files?.[0] ?? null)
            }
            className="text-sm text-gray-600 dark:text-gray-300"
          />
        </div>

        <RichTextEditor
          value={form.description}
          onChange={(desc) =>
            setForm({ ...form, description: desc })
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700
            text-white py-2 rounded transition"
        >
          {loading ? "Saving Lesson..." : "Add Lesson"}
        </button>
      </div>
    </div>
  );
}
