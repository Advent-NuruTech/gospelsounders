"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import PdfImageReader from "@/components/PdfImageReader";

interface Lesson {
  id: string;
  title?: string;
  pdfUrl: string;
}

export default function LessonPage() {
  const params = useParams(); // expects /sabbath-school/[id]
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    async function fetchLesson() {
      setLoading(true);
      const docRef = doc(db, "sabbath_school_lessons", lessonId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Lesson;
        setLesson({
          id: docSnap.id,
          title: data.title,
          pdfUrl: data.pdfUrl,
        });
      }
      setLoading(false);
    }

    fetchLesson();
  }, [lessonId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-[#1F1A16]">
        <p className="text-gray-500">Loading Lesson...</p>
      </div>
    );

  if (!lesson || !lesson.pdfUrl)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-[#1F1A16]">
        <p className="text-red-500">Lesson not found.</p>
      </div>
    );

  return (
    <PdfImageReader
      fileUrl={lesson.pdfUrl}
      title={lesson.title || "Sabbath School Lesson"}
      backHref="/sabbath-school"
      backLabel="Lessons"
    />
  );
}
