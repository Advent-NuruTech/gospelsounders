"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";

interface Lesson {
  id: string;
  title: string;
  lessonDate: string;
  year: number;
  quarter: number;
  pdfUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    lessonDate: "",
    year: new Date().getFullYear(),
    quarter: 1,
    description: "",
  });

  const lessonsRef = collection(db, "sabbath_school_lessons");

  async function fetchLessons() {
    const snap = await getDocs(lessonsRef);
    const data: Lesson[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lesson));
    setLessons(data);
  }

  useEffect(() => {
    fetchLessons();
  }, []);

  async function handleUpload() {
    if (!file && !editingId) return alert("Select a PDF file for the lesson");
    setLoading(true);

    try {
      let pdfUrl = "";
      let thumbnailUrl = "";

      if (file) pdfUrl = await uploadToCloudinary(file);
      if (thumbnail) thumbnailUrl = await uploadToCloudinary(thumbnail);

      if (editingId) {
        const docRef = doc(db, "sabbath_school_lessons", editingId);
        await updateDoc(docRef, {
          ...form,
          ...(pdfUrl && { pdfUrl }),
          ...(thumbnailUrl && { thumbnailUrl }),
        });
        setEditingId(null);
      } else {
        await addDoc(lessonsRef, {
          ...form,
          pdfUrl,
          ...(thumbnailUrl && { thumbnailUrl }),
        });
      }

      setForm({
        title: "",
        lessonDate: "",
        year: new Date().getFullYear(),
        quarter: 1,
        description: "",
      });
      setFile(null);
      setThumbnail(null);
      fetchLessons();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    await deleteDoc(doc(db, "sabbath_school_lessons", id));
    fetchLessons();
  }

  function handleEdit(lesson: Lesson) {
    setForm({
      title: lesson.title,
      lessonDate: lesson.lessonDate,
      year: lesson.year,
      quarter: lesson.quarter,
      description: lesson.description || "",
    });
    setEditingId(lesson.id);
    setFile(null);
    setThumbnail(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin: Sabbath School Lessons</h1>

      {/* Title */}
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      {/* Date */}
      <input
        type="date"
        value={form.lessonDate}
        onChange={(e) => setForm({ ...form, lessonDate: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      {/* Year */}
      <input
        type="number"
        value={form.year}
        onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
        className="border p-2 w-full mb-2"
      />

      {/* Quarter */}
      <input
        type="number"
        min={1}
        max={4}
        value={form.quarter}
        onChange={(e) => setForm({ ...form, quarter: Number(e.target.value) })}
        className="border p-2 w-full mb-2"
      />

      {/* PDF */}
      <label className="block mb-2">
        Lesson PDF {editingId && "(leave empty to keep current)"}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1"
        />
      </label>

      {/* Thumbnail */}
      <label className="block mb-2">
        Lesson Thumbnail (optional)
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
          className="mt-1"
        />
      </label>

      {/* Rich text description */}
      <RichTextEditor
        value={form.description}
        onChange={(desc) => setForm({ ...form, description: desc })}
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded mt-4 mb-4"
      >
        {loading ? "Saving..." : editingId ? "Update Lesson" : "Add Lesson"}
      </button>

      <hr className="my-4" />

      {/* Lessons list */}
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id} className="border p-3 rounded mb-2 flex justify-between items-start">
            <div>
              <strong>{lesson.title}</strong> ({lesson.lessonDate})
              {lesson.thumbnailUrl && (
                <img
                  src={lesson.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-20 h-20 object-cover mt-1 rounded"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: lesson.description || "" }} />
            </div>
            <div className="space-y-1 text-right">
              <button
                onClick={() => handleEdit(lesson)}
                className="text-blue-600 underline block"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="text-red-600 underline block"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
