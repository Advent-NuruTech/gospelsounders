"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

interface Lesson {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function EditLessonClient() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");

  const [lesson, setLesson] = useState<Lesson>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        const ref = doc(db, "sabbathSchoolLessons", lessonId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setLesson(snap.data() as Lesson);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleSave = async () => {
    if (!lessonId) return;

    setSaving(true);
    try {
      const ref = doc(db, "sabbathSchoolLessons", lessonId);
      await updateDoc(ref, {
        ...lesson,
        updatedAt: serverTimestamp(),
      });

      alert("Lesson updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading lesson...</div>;
  }

  if (!lessonId) {
    return <div className="p-6 text-red-600">Missing lesson ID</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>

      <label className="block mb-1">Title</label>
      <input
        className="border p-2 w-full mb-4"
        value={lesson.title}
        onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
      />

      <label className="block mb-1">Description</label>
      <textarea
        className="border p-2 w-full mb-4"
        value={lesson.description}
        onChange={(e) =>
          setLesson({ ...lesson, description: e.target.value })
        }
      />

      <label className="block mb-1">Start Date</label>
      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={lesson.startDate}
        onChange={(e) =>
          setLesson({ ...lesson, startDate: e.target.value })
        }
      />

      <label className="block mb-1">End Date</label>
      <input
        type="date"
        className="border p-2 w-full mb-6"
        value={lesson.endDate}
        onChange={(e) => setLesson({ ...lesson, endDate: e.target.value })}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Lesson"}
      </button>
    </div>
  );
}
