"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Lesson = {
  title: string;
  quarter: string;
  filePath: string;
};

export default function SabbathSchoolPage() {
  // Sample lessons — in production, fetch dynamically from API
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      title: "Lesson 1: Faith and Salvation",
      quarter: "2025-Q1",
      filePath: "/files/lessons/2025-Q1/lesson1.pdf",
    },
    {
      title: "Lesson 2: God’s Plan for Humanity",
      quarter: "2025-Q1",
      filePath: "/files/lessons/2025-Q1/lesson2.pdf",
    },
    {
      title: "Lesson 1: The Promise of the Messiah",
      quarter: "2025-Q2",
      filePath: "/files/lessons/2025-Q2/lesson1.pdf",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(lessons);

  useEffect(() => {
    setFilteredLessons(
      lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(search.toLowerCase()) ||
          lesson.quarter.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, lessons]);

  const quarters = Array.from(new Set(lessons.map((l) => l.quarter)));

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Sabbath School Lessons</h1>
      <p className="max-w-2xl mx-auto text-center text-gray-700 mb-12">
        Browse, read online, download, or share Sabbath School lessons for each quarter.
      </p>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by lesson title or quarter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lessons by Quarter */}
      {quarters.map((q) => (
        <section key={q} className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">{q}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons
              .filter((lesson) => lesson.quarter === q)
              .map((lesson, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                    <p className="text-gray-500 mb-3">{lesson.quarter}</p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <a
                      href={lesson.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                    >
                      Read
                    </a>
                    <a
                      href={lesson.filePath}
                      download
                      className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
                    >
                      Download
                    </a>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.origin + lesson.filePath)
                      }
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Share
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
