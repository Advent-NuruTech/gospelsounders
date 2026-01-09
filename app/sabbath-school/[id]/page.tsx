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

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [day, setDay] = useState("all");

  useEffect(() => {
    async function fetchLessons() {
      const snap = await getDocs(collection(db, "sabbath_school_lessons"));
      setLessons(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lesson))
      );
    }
    fetchLessons();
  }, []);

  const years = useMemo(
    () => Array.from(new Set(lessons.map((l) => l.year))).sort(),
    [lessons]
  );

  const hasActiveFilters =
    year !== "all" || month !== "all" || day !== "all";

  const resetFilters = () => {
    setYear("all");
    setMonth("all");
    setDay("all");
    setExpanded(null);
    setShowFilters(false); // optional but great UX
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const date = new Date(lesson.startDate);
      return (
        (year === "all" || date.getFullYear().toString() === year) &&
        (month === "all" || (date.getMonth() + 1).toString() === month) &&
        (day === "all" || date.getDate().toString() === day)
      );
    });
  }, [lessons, year, month, day]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
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
          onClick={() => setShowFilters((v) => !v)}
          className="
            inline-flex items-center gap-2
            rounded-full px-5 py-2 text-sm font-semibold
            bg-[#2F6F4E]/10 text-[#2F6F4E]
            dark:bg-[#4DAA7F]/20 dark:text-[#9FE0B6]
            hover:scale-[1.02] transition
          "
        >
          <Filter size={16} />
          Filter Lessons
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className="
            mb-8 rounded-2xl p-4
            bg-[#FAF7F3] dark:bg-[#1F1A16]
            border border-[#E5D5C3] dark:border-[#4B3A2A]
            space-y-4
          "
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Year */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
            >
              <option value="all">All Months</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            {/* Day */}
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C]"
            >
              <option value="all">All Days</option>
              {Array.from({ length: 31 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="
                  inline-flex items-center gap-2
                  text-sm font-semibold
                  text-[#8B0000] dark:text-[#FF9A9A]
                  hover:underline
                "
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* GRID — ALWAYS 2 COLUMNS */}
      <ul className="grid grid-cols-2 gap-5">
        {filteredLessons.map((lesson) => {
          const isOpen = expanded === lesson.id;

          return (
            <li
              key={lesson.id}
              className="
                flex flex-col rounded-2xl
                border border-[#E5D5C3] dark:border-[#4B3A2A]
                bg-white dark:bg-[#1F1A16]
                shadow-sm hover:shadow-xl transition
              "
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

                {lesson.description && (
                  <div className="mt-3 text-sm">
                    <div
                      className={`overflow-hidden ${
                        isOpen ? "max-h-[600px]" : "max-h-[4.5rem]"
                      }`}
                      dangerouslySetInnerHTML={{ __html: lesson.description }}
                    />

                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() =>
                          setExpanded(isOpen ? null : lesson.id)
                        }
                        className="text-sm font-semibold text-[#2F6F4E]"
                      >
                        {isOpen ? "Read Less" : "Read More"}
                      </button>

                      {isOpen && (
                        <Link
                          href={`/sabbath-school/${lesson.id}`}
                          className="block text-center rounded-full bg-[#2F6F4E] text-white py-2 text-sm"
                        >
                          Read the Lesson →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
