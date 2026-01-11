"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";

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

// ---------- UTILITY FUNCTIONS ----------

// Strip HTML for previews
function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

// Truncate text by words
function truncateText(text: string, wordLimit = 60) {
  const words = text.split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}

// Extract headings for TOC
function extractHeadings(html?: string) {
  if (!html) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const headings = Array.from(div.querySelectorAll("h1, h2, h3")).map(h => ({
    text: h.textContent || "",
    tag: h.tagName,
    id: h.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
  }));
  return headings;
}

// Highlight Bible verses
function highlightVerses(html?: string) {
  if (!html) return "";
  const verseRegex = /\b([1-3]?\s?[A-Za-z]+)\s(\d+):(\d+)\b/g;
  return html.replace(verseRegex, (match) => {
    return `<span class="text-blue-600 font-semibold cursor-pointer hover:underline">${match}</span>`;
  });
}

// ---------- COMPONENT ----------
export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("all");

  // Fetch lessons
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

  const hasActiveFilters = year !== "all" || month !== "all" || day !== "all";

  const resetFilters = () => {
    setYear("all");
    setMonth("all");
    setDay("all");
    setExpanded(null);
    setShowFilters(false);
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const date = new Date(lesson.startDate);
      return (
        (year === "all" || date.getFullYear().toString() === year) &&
        (month === "all" || (date.getMonth() + 1).toString() === month) &&
        (day === "all" || date.getDate().toString() === day)
      );
    });
  }, [lessons, year, month, day]);

  // Sorted lessons for navigation
  const sortedLessons = useMemo(() => {
    return [...filteredLessons].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [filteredLessons]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 relative">

      {/* ---------- NORMAL VIEW ---------- */}
      {!expanded && (
        <>
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3B2414] dark:text-[#F6F1EA]">
              Sabbath School Lessons
            </h1>
            <p className="mt-2 text-sm text-[#6B4A2E] dark:text-[#D8C9B4]">
              Quarterly Bible study lessons for faithful living.
            </p>
          </header>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold
              bg-[#2F6F4E]/10 text-[#2F6F4E] dark:bg-[#4DAA7F]/20 dark:text-[#9FE0B6] hover:scale-[1.02] transition"
            >
              <Filter size={16} />
              Filter Lessons
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 rounded-2xl p-4 bg-[#FAF7F3] dark:bg-[#1F1A16] border border-[#E5D5C3] dark:border-[#4B3A2A] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
                >
                  <option value="all">All Years</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
                >
                  <option value="all">All Months</option>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i+1} value={i+1}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>

                <select
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
                >
                  <option value="all">All Days</option>
                  {Array.from({ length: 31 }).map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B0000] dark:text-[#FF9A9A] hover:underline"
                  >
                    <RotateCcw size={14} />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Lessons Grid */}
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map(lesson => {
              const plainText = stripHtml(lesson.description);
              const truncated = truncateText(plainText);

              return (
                <li
                  key={lesson.id}
                  className="flex flex-col rounded-2xl border border-[#E5D5C3] dark:border-[#4B3A2A] bg-white dark:bg-[#1F1A16] shadow-sm hover:shadow-xl transition"
                >
                  {lesson.thumbnailUrl && (
                    <div className="flex justify-center p-4">
                      <img
                        src={lesson.thumbnailUrl}
                        alt={lesson.title}
                        className="max-h-40 w-auto object-contain rounded-xl p-2"
                      />
                    </div>
                  )}

                  <div className="flex-1 px-4 pb-4">
                    <span className="text-xs font-bold text-[#2F6F4E] dark:text-[#9FE0B6]">
                      Q{lesson.quarter} • {lesson.year}
                    </span>

                    <h2 className="mt-1 font-bold text-[#3B2414] dark:text-[#F6F1EA]">
                      {lesson.title}
                    </h2>

                    <p className="text-xs text-[#6B4A2E] dark:text-[#D8C9B4]">
                      {lesson.startDate} — {lesson.endDate}
                    </p>

                    <p className="text-gray-700 dark:text-[#D8C9B4] text-sm mt-2 min-h-[6rem]">
                      {truncated}
                    </p>

                    {lesson.description && lesson.description.split(" ").length > 60 && (
                      <span
                        onClick={() => setExpanded(lesson.id)}
                        className="cursor-pointer text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black dark:text-black px-3 py-1 rounded-full hover:opacity-90 transition inline-block mt-3"
                      >
                        Read More
                      </span>
                    )}

                    {lesson.description && lesson.description.split(" ").length <= 60 && lesson.pdfUrl && (
                      <Link
                        href={`/sabbath-school/${lesson.id}`}
                        className="block text-center rounded-full bg-[#2F6F4E] text-white py-2 text-sm mt-3"
                      >
                        Read the Lesson →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ---------- EXPANDED FULL VIEW ---------- */}
      {expanded && (() => {
        const currentIndex = sortedLessons.findIndex(l => l.id === expanded);
        const lesson = sortedLessons[currentIndex];
        const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
        const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
        const highlightedHtml = highlightVerses(lesson.description);

        return (
          <div className="fixed inset-0 z-50 bg-white dark:bg-[#1F1A16] overflow-auto p-8 flex flex-col">
            <button
              onClick={() => setExpanded(null)}
              className="self-end mb-6 text-black dark:text-white font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 rounded-full hover:opacity-90 transition"
            >
              Close
            </button>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-[#F6F1EA]">{lesson.title}</h2>
              <p className="text-gray-500 dark:text-[#9FE0B6] mb-6">
                Q{lesson.quarter} • {lesson.year} • {lesson.startDate} — {lesson.endDate}
              </p>

              {/* Table of Contents */}
              <ul className="mb-4 text-sm font-medium space-y-1">
                {extractHeadings(lesson.description).map(h => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Full Lesson HTML with verse highlighting */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-[#D8C9B4]"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                {prevLesson && (
                  <button
                    onClick={() => setExpanded(prevLesson.id)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    ← Previous
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => setExpanded(nextLesson.id)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next →
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}
    </main>
  );
}
