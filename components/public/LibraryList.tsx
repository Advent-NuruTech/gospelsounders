"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export interface LibraryDoc {
  id: string;
  title: string;
  category?: string;
  description?: string;
  filePath?: string;
  createdAt?: any;
}

// ---------- UTILITY ----------
const truncateText = (text?: string, wordLimit = 40) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "…" : text;
};

const formatDate = (date?: any) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date.toDate ? date.toDate() : new Date(date);
  const day = d.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `Published on ${day}${daySuffix} ${d.toLocaleString("default", { month: "long", year: "numeric" })}`;
};

// ---------- COMPONENT ----------
export default function LibraryList({ maxDocs = 2 }: { maxDocs?: number }) {
  const [docs, setDocs] = useState<LibraryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const q = query(
          collection(db, "library"),
          orderBy("createdAt", "desc"),
          limit(maxDocs)
        );
        const snap = await getDocs(q);
        const docList: LibraryDoc[] = snap.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          category: doc.data().category ?? "General",
          description: doc.data().description ?? "",
          filePath: doc.data().filePath,
          createdAt: doc.data().createdAt ?? null,
        }));
        setDocs(docList);
      } catch (err) {
        console.error("Failed to fetch library docs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [maxDocs]);

  if (loading) return <p className="text-center text-[#5A3A23]">Loading study notes...</p>;
  if (docs.length === 0) return <p className="text-center text-[#5A3A23]">No study notes available.</p>;

  return (
    <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
      {docs.map(doc => (
        <li
          key={doc.id}
          className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-md hover:shadow-xl transition p-5"
        >
          <h3 className="text-xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-1">{doc.title}</h3>
          <p className="text-xs text-[#6B4A2E] dark:text-[#D9A441] mb-2">{doc.category}</p>
          <p className="text-gray-700 dark:text-[#D8C9B4] text-sm mb-4">{truncateText(doc.description)}</p>

          <Link
            href={`/library/${doc.id}`}
            className="mt-auto inline-block w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-black dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
          >
            View / Download →
          </Link>
        </li>
      ))}
    </ul>
  );
}
