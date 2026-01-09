"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

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
  const [filteredDocs, setFilteredDocs] = useState<LibraryDoc[]>([]);

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

  useEffect(() => {
    setFilteredDocs(
      documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(search.toLowerCase()) ||
          doc.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, documents]);

  const truncateText = (text: string, wordLimit = 60) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Library</h1>
      <p className="text-center max-w-2xl mx-auto text-gray-700 mb-8">
        Explore our categorized study materials. Search, read online, or download.
      </p>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">{doc.title}</h3>
              <p className="text-gray-500 mb-2">{doc.category}</p>
              <p className="text-gray-700 text-sm mb-4">
                {truncateText(doc.description, 60)}
              </p>
              <Link
                href={`/library/${doc.id}`}
                className="text-blue-900 font-medium hover:underline"
              >
                Read More
              </Link>
            </div>

            <div className="flex justify-between mt-4">
              <a
                href={doc.filePath}
                target="_blank"
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
