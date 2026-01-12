"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

// ---------- UTILITY ----------
const truncateText = (text?: string, wordLimit = 20) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
};

// ---------- COMPONENT ----------
export default function SabbathSchool({ maxLessons = 2 }: { maxLessons?: number }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const q = query(
          collection(db, "sabbath_school_lessons"),
          orderBy("startDate", "desc"),
          limit(maxLessons)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [maxLessons]);

  if (loading) return <p className="text-center text-[#5A3A23]">Loading lessons...</p>;
  if (lessons.length === 0) return <p className="text-center text-[#5A3A23]">No lessons available.</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {lessons.map(lesson => (
        <div
          key={lesson.id}
          className="bg-white dark:bg-[#1F1A16] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
        >
          {lesson.thumbnailUrl && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <span className="text-xs font-bold text-[#2F6F4E] dark:text-[#9FE0B6]">
              Q{lesson.quarter} • {lesson.year}
            </span>
            <h3 className="mt-1 font-bold text-[#3B2414] dark:text-[#F6F1EA] text-lg">
              {lesson.title}
            </h3>
            <p className="text-xs text-[#6B4A2E] dark:text-[#D8C9B4] mb-2">
              {lesson.startDate} — {lesson.endDate}
            </p>
            <p className="text-gray-700 dark:text-[#D8C9B4] text-sm mb-3">
              {truncateText(lesson.description, 20)}
            </p>
            {lesson.pdfUrl && (
              <Link
                href={`/sabbath-school/${lesson.id}`}
                className="inline-block bg-[#2F6F4E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#247147] transition"
              >
                Read Lesson →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
