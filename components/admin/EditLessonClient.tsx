"use client";

import { useParams, useRouter } from "next/navigation";
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
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = id;

  const [lesson, setLesson] = useState<Lesson>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchLesson() {
      try {
        const ref = doc(db, "sabbath_school_lessons", lessonId);
        const snap = await getDoc(ref);

        if (!mounted) return;

        if (snap.exists()) {
          setLesson(snap.data() as Lesson);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLesson();

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  async function handleSave() {
    if (!lessonId) return;

    setSaving(true);
    try {
      const ref = doc(db, "sabbath_school_lessons", lessonId);
      await updateDoc(ref, {
        ...lesson,
        updatedAt: serverTimestamp(),
      });

      alert("Lesson updated successfully");
      router.push("/admin/sabbath-school");
    } catch (err) {
      console.error(err);
      alert("Failed to update lesson");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading lesson...</div>;

  if (notFound) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Lesson not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>

      <input
        className="border p-2 w-full mb-4"
        value={lesson.title}
        onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
      />

      <textarea
        className="border p-2 w-full mb-4"
        value={lesson.description}
        onChange={(e) =>
          setLesson({ ...lesson, description: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={lesson.startDate}
        onChange={(e) =>
          setLesson({ ...lesson, startDate: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-6"
        value={lesson.endDate}
        onChange={(e) =>
          setLesson({ ...lesson, endDate: e.target.value })
        }
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Lesson"}
      </button>
    </div>
  );
}
