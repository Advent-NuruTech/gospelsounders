"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  filePath: string;
  createdAt: any;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<LibraryDoc[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "library"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LibraryDoc[];
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(documents.map((d) => d.category))),
    [documents]
  );

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || doc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  const truncateText = (text: string, wordLimit = 60) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ")
      : text;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#1F1A16] px-6 py-12 relative">
      {/* Only show normal view if nothing is expanded */}
      {!expanded && (
        <>
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-[#F6F1EA]">
            Library
          </h1>
          <p className="text-center max-w-2xl mx-auto text-gray-700 dark:text-[#D8C9B4] mb-8">
            Explore our categorized study materials. Search, read online, or download.
          </p>

          {/* Search & Category Filter */}
          <div className="max-w-2xl mx-auto mb-6 space-y-3">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-[#4B3A2A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2A221C] dark:text-[#F6F1EA]"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2A221C] dark:text-[#F6F1EA]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Documents Grid */}
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredDocs.map((doc) => {
              const exceedsLimit = doc.description.split(" ").length > 60;

              return (
                <li
                  key={doc.id}
                  className="flex flex-col rounded-2xl border border-[#E5D5C3] dark:border-[#4B3A2A] bg-white dark:bg-[#1F1A16] shadow-sm hover:shadow-xl transition p-6"
                >
                  <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-[#F6F1EA]">
                    {doc.title}
                  </h3>
                  <p className="text-gray-500 dark:text-[#9FE0B6] mb-2">{doc.category}</p>

                  <p className="text-gray-700 dark:text-[#D8C9B4] text-sm mb-4">
                    {truncateText(doc.description)}
                  </p>

                  {exceedsLimit && (
                    <span
                      onClick={() => setExpanded(doc.id)}
                       className="cursor-pointer text-sm font-semibold bg-gradient-to-r from-yellow-400 to-white-600 text-black dark:text-black px-3 py-1 rounded-full hover:opacity-90 transition inline-block mt-3"
                      >
                      Read More
                    </span>


 






                  )}

                  <Link
                    href={`/library/${doc.id}`}
                    className="inline-block mt-2 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black dark:text-black px-6 py-2 rounded-full hover:opacity-90 transition"
                  >
                    Study or Download →
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Full Page Expanded View */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#1F1A16] overflow-auto p-8 flex flex-col">
          <button
            onClick={() => setExpanded(null)}
            className="self-end mb-6 text-black dark:text-white font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 rounded-full hover:opacity-90 transition"
          >
            Close
          </button>

          {filteredDocs
            .filter((doc) => doc.id === expanded)
            .map((doc) => (
              <div key={doc.id} className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-[#F6F1EA]">
                  {doc.title}
                </h2>
                <p className="text-gray-500 dark:text-[#9FE0B6] mb-6">{doc.category}</p>
                <p className="text-gray-700 dark:text-[#D8C9B4] whitespace-pre-line">
                  {doc.description}
                </p>

                <Link
                  href={`/library/${doc.id}`}
                  className="text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black dark:text-black px-4 py-2 rounded-full hover:opacity-90 transition mt-4 inline-block"
                >
                  view or download the whole document →
                </Link>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
