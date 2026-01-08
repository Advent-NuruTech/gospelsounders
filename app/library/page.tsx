// app/library/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Document = {
  title: string;
  category: string;
  filePath: string;
};

export default function LibraryPage() {
  // Categories (can expand)
  const categories = ["Prophecy", "Health", "Sanctuary", "Current Events"];

  // Documents — In production, fetch from API / database
  const [documents, setDocuments] = useState<Document[]>([
    {
      title: "Prophecy Study Q1",
      category: "Prophecy",
      filePath: "/files/library/prophecy/prophecy-q1.pdf",
    },
    {
      title: "Health Tips 2025",
      category: "Health",
      filePath: "/files/library/health/health-tips-2025.pdf",
    },
    {
      title: "Sanctuary Message 2025",
      category: "Sanctuary",
      filePath: "https://pdfhost.io/v/YfAGahcbCP_TOPIC-_THE_FIRST_AND_SECOND_ADVENT_EXPERIENCE",
    },
    {
      title: "Current Events Insights",
      category: "Current Events",
      filePath: "/files/library/current-events/current-events.pdf",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filteredDocs, setFilteredDocs] = useState<Document[]>(documents);

  useEffect(() => {
    setFilteredDocs(
      documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          doc.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, documents]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Library</h1>
      <p className="text-center max-w-2xl mx-auto text-gray-700 mb-12">
        Explore our categorized study materials. You can read online, download, or share these resources with others.
      </p>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">{doc.title}</h3>
              <p className="text-gray-500 mb-3">{doc.category}</p>
            </div>
            <div className="flex justify-between mt-4">
              <a
                href={doc.filePath}
                target="_blank"
                rel="https://pdfhost.io/v/YfAGahcbCP_TOPIC-_THE_FIRST_AND_SECOND_ADVENT_EXPERIENCE"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Read
              </a>
              <a
                href={doc.filePath}
                download
                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
              >
                Download
              </a>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.origin + doc.filePath)
                }
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


