"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Filter, RotateCcw } from "lucide-react";
import Link from "next/link";

/* ================= TYPES ================= */
interface Lesson {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  year: number;
  quarter: number;
  pdfUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

/* ================= UTILS ================= */
function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

function truncateText(text: string, limit = 60) {
  const words = text.split(/\s+/);
  return {
    truncated: words.length > limit,
    text:
      words.length > limit
        ? words.slice(0, limit).join(" ") + "…"
        : text,
  };
}

function highlightVerses(html?: string) {
  if (!html) return "";
  const regex = /\b([1-3]?\s?[A-Za-z]+)\s\d+:\d+\b/g;
  return html.replace(
    regex,
    m =>
      `<span class="text-[#9FE0B6] font-semibold underline underline-offset-4 cursor-pointer">${m}</span>`
  );
}

/* ================= COMPONENT ================= */
export default function SabbathSchoolPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("all");

  /* ---------- FETCH ---------- */
  useEffect(() => {
    async function fetchLessons() {
      const snap = await getDocs(collection(db, "sabbath_school_lessons"));
      setLessons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson)));
    }
    fetchLessons();
  }, []);

  const years = useMemo(
    () => Array.from(new Set(lessons.map(l => l.year))).sort(),
    [lessons]
  );

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const d = new Date(l.startDate);
      return (
        (year === "all" || d.getFullYear().toString() === year) &&
        (month === "all" || (d.getMonth() + 1).toString() === month) &&
        (day === "all" || d.getDate().toString() === day)
      );
    });
  }, [lessons, year, month, day]);

  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );
  }, [filteredLessons]);

  const currentIndex = sortedLessons.findIndex(l => l.id === expandedId);
  const currentLesson = currentIndex >= 0 ? sortedLessons[currentIndex] : null;
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < sortedLessons.length - 1
      ? sortedLessons[currentIndex + 1]
      : null;

  const resetFilters = () => {
    setYear("all");
    setMonth("all");
    setDay("all");
    setShowFilters(false);
  };

  /* ================= LIST VIEW ================= */
  if (!expandedId) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16] px-6 py-12">
        {/* ===== HEADER ===== */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F6F1EA]">
            Sabbath School Lessons
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-gray-700 dark:text-[#D8C9B4]">
            Quarterly Bible study guides for systematic, spirit-filled study.
          </p>
        </header>

        {/* ===== FILTER TOGGLE ===== */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-6 py-2 rounded-full
              bg-gradient-to-r from-yellow-400 to-yellow-600
              text-black font-semibold hover:opacity-90 transition"
          >
            <Filter size={16} />
            Filter Lessons
          </button>
        </div>

        {/* ===== FILTER PANEL ===== */}
        {showFilters && (
          <div className="max-w-4xl mx-auto mb-10 rounded-2xl p-6
            bg-white dark:bg-[#1F1A16]
            border border-[#E5D5C3] dark:border-[#4B3A2A]">
            <div className="grid sm:grid-cols-3 gap-4">
              {[year, month, day].map((_, i) => (
                <select
                  key={i}
                  value={i === 0 ? year : i === 1 ? month : day}
                  onChange={e =>
                    i === 0
                      ? setYear(e.target.value)
                      : i === 1
                      ? setMonth(e.target.value)
                      : setDay(e.target.value)
                  }
                  className="w-full rounded-lg px-4 py-2
                    bg-white dark:bg-[#2A221C]
                    border border-[#E5D5C3] dark:border-[#4B3A2A]
                    text-sm dark:text-[#F6F1EA]"
                >
                  {i === 0 && (
                    <>
                      <option value="all">All Years</option>
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <option value="all">All Months</option>
                      {Array.from({ length: 12 }).map((_, m) => (
                        <option key={m} value={m + 1}>
                          {new Date(0, m).toLocaleString("default", { month: "long" })}
                        </option>
                      ))}
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <option value="all">All Days</option>
                      {Array.from({ length: 31 }).map((_, d) => (
                        <option key={d} value={d + 1}>{d + 1}</option>
                      ))}
                    </>
                  )}
                </select>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-sm font-semibold
                  text-gray-700 dark:text-[#D8C9B4]"
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* ===== LESSON CARDS ===== */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedLessons.map(lesson => {
            const plain = stripHtml(lesson.description);
            const { truncated, text } = truncateText(plain);

            return (
              <li
                key={lesson.id}
                className="flex flex-col rounded-2xl p-6
                  bg-white dark:bg-[#1F1A16]
                  border border-[#E5D5C3] dark:border-[#4B3A2A]
                  shadow-sm hover:shadow-xl transition"
              >
                {lesson.thumbnailUrl && (
                  <img
                    src={lesson.thumbnailUrl}
                    className="h-40 object-contain mx-auto mb-4"
                    alt={lesson.title}
                  />
                )}

                <span className="text-sm font-semibold text-gray-500 dark:text-[#9FE0B6]">
                  Quarter {lesson.quarter} • {lesson.year}
                </span>

                <h2 className="text-xl font-semibold mt-2 text-gray-900 dark:text-[#F6F1EA]">
                  {lesson.title}
                </h2>

                <p className="text-sm mt-3 text-gray-700 dark:text-[#D8C9B4]">
                  {text}
                </p>

                <div className="mt-auto pt-4">
                  <button
                    onClick={() => setExpandedId(lesson.id)}
                    className="w-full px-6 py-2 rounded-full
                      bg-gradient-to-r from-yellow-400 to-yellow-600
                      text-black font-semibold hover:opacity-90 transition"
                  >
                    {truncated ? "Read More" : "Open Lesson"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    );
  }

  /* ================= FULL VIEW ================= */
  if (!currentLesson) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto
      bg-white dark:bg-[#1F1A16] p-6 md:p-10">
      <button
        onClick={() => setExpandedId(null)}
        className="mb-6 px-6 py-2 rounded-full
          bg-gradient-to-r from-yellow-400 to-yellow-600
          text-black font-semibold hover:opacity-90 transition"
      >
        Close
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-[#F6F1EA]">
          {currentLesson.title}
        </h1>

        <div
          className="text-gray-700 dark:text-[#D8C9B4] leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: highlightVerses(currentLesson.description),
          }}
        />

        <div className="mt-10 flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-3">
            {prevLesson && (
              <button
                onClick={() => setExpandedId(prevLesson.id)}
                className="px-5 py-2 rounded-full
                  border border-[#E5D5C3] dark:border-[#4B3A2A]
                  text-gray-700 dark:text-[#D8C9B4]"
              >
                ← Previous
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => setExpandedId(nextLesson.id)}
                className="px-5 py-2 rounded-full
                  border border-[#E5D5C3] dark:border-[#4B3A2A]
                  text-gray-700 dark:text-[#D8C9B4]"
              >
                Next →
              </button>
            )}
          </div>

          <Link
            href={`/sabbath-school/${currentLesson.id}`}
            className="px-6 py-2 rounded-full
              bg-gradient-to-r from-yellow-400 to-yellow-600
              text-black font-semibold hover:opacity-90 transition"
          >
            View Full Lesson
          </Link>
        </div>
      </div>
    </div>
  );
}
