"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import RichTextEditor from "@/components/RichTextEditor";

interface Lesson {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl?: string;
  thumbnailUrl?: string;
}

export default function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [fileInputs, setFileInputs] = useState<Record<string, File | null>>({});
  const [thumbInputs, setThumbInputs] = useState<Record<string, File | null>>({});

  useEffect(() => {
    async function fetchLessons() {
      try {
        const q = query(
          collection(db, "sabbath_school_lessons"),
          orderBy("startDate", "asc")
        );
        const snapshot = await getDocs(q);
        const lessonData: Lesson[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Lesson, "id">),
        }));
        setLessons(lessonData);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  const handleUpdate = async (lesson: Lesson) => {
    setSavingId(lesson.id);
    try {
      let pdfUrl = lesson.pdfUrl;
      let thumbnailUrl = lesson.thumbnailUrl;

      // Upload new files if selected
      if (fileInputs[lesson.id]) {
        pdfUrl = await uploadToCloudinary(fileInputs[lesson.id]!);
      }
      if (thumbInputs[lesson.id]) {
        thumbnailUrl = await uploadToCloudinary(thumbInputs[lesson.id]!);
      }

      const ref = doc(db, "sabbath_school_lessons", lesson.id);
      await updateDoc(ref, {
        ...lesson,
        pdfUrl,
        thumbnailUrl,
        updatedAt: serverTimestamp(),
      });

      // Update state with new URLs
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lesson.id ? { ...lesson, pdfUrl, thumbnailUrl } : l
        )
      );

      alert("Lesson updated successfully");
      // Clear file inputs for this lesson
      setFileInputs((prev) => ({ ...prev, [lesson.id]: null }));
      setThumbInputs((prev) => ({ ...prev, [lesson.id]: null }));
    } catch (err) {
      console.error(err);
      alert("Failed to update lesson");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await deleteDoc(doc(db, "sabbath_school_lessons", lessonId));
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      alert("Lesson deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete lesson");
    }
  };

  if (loading) return <div className="p-6">Loading lessons...</div>;
  if (lessons.length === 0)
    return <div className="p-6 text-gray-600">No lessons found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Sabbath School Lessons</h1>

      <ul className="space-y-8">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="p-6 border rounded shadow-sm hover:shadow-md transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                className="border p-2 w-full"
                value={lesson.title}
                onChange={(e) =>
                  setLessons((prev) =>
                    prev.map((l) =>
                      l.id === lesson.id ? { ...l, title: e.target.value } : l
                    )
                  )
                }
                placeholder="Title"
              />

              {/* Rich Text Editor for description */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold">Description</label>
                <RichTextEditor
                  value={lesson.description}
                  onChange={(desc) =>
                    setLessons((prev) =>
                      prev.map((l) =>
                        l.id === lesson.id ? { ...l, description: desc } : l
                      )
                    )
                  }
                />
              </div>

              <input
                type="date"
                className="border p-2 w-full"
                value={lesson.startDate}
                onChange={(e) =>
                  setLessons((prev) =>
                    prev.map((l) =>
                      l.id === lesson.id
                        ? { ...l, startDate: e.target.value }
                        : l
                    )
                  )
                }
              />
              <input
                type="date"
                className="border p-2 w-full"
                value={lesson.endDate}
                onChange={(e) =>
                  setLessons((prev) =>
                    prev.map((l) =>
                      l.id === lesson.id
                        ? { ...l, endDate: e.target.value }
                        : l
                    )
                  )
                }
              />
              <input
                type="number"
                className="border p-2 w-full"
                value={lesson.year}
                onChange={(e) =>
                  setLessons((prev) =>
                    prev.map((l) =>
                      l.id === lesson.id
                        ? { ...l, year: Number(e.target.value) }
                        : l
                    )
                  )
                }
                placeholder="Year"
              />
              <input
                type="number"
                min={1}
                max={4}
                className="border p-2 w-full"
                value={lesson.quarter}
                onChange={(e) =>
                  setLessons((prev) =>
                    prev.map((l) =>
                      l.id === lesson.id
                        ? { ...l, quarter: Number(e.target.value) }
                        : l
                    )
                  )
                }
                placeholder="Quarter"
              />

              {/* PDF upload */}
              <div>
                <label className="block text-sm mb-1">PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFileInputs((prev) => ({
                      ...prev,
                      [lesson.id]: e.target.files?.[0] ?? null,
                    }))
                  }
                />
                {lesson.pdfUrl && (
                  <a
                    href={lesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm mt-1 block"
                  >
                    View current PDF
                  </a>
                )}
              </div>

              {/* Thumbnail upload */}
              <div>
                <label className="block text-sm mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbInputs((prev) => ({
                      ...prev,
                      [lesson.id]: e.target.files?.[0] ?? null,
                    }))
                  }
                />
                {lesson.thumbnailUrl && (
                  <img
                    src={lesson.thumbnailUrl}
                    alt="Thumbnail"
                    className="mt-2 w-24 h-24 object-cover border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => handleUpdate(lesson)}
                disabled={savingId === lesson.id}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {savingId === lesson.id ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
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
