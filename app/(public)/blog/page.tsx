"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import Link from "next/link";

// Blog type
export type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

// Format date professionally: Published 1st January 2026
function formatProfessionalDate(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);

  const day = d.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `Published on ${day}${daySuffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
}

// Strip HTML and extra whitespace
function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Get 60-word preview safely
function getPreview(content: string, limit = 60) {
  const clean = stripHtml(content);
  const words = clean.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "…" : clean;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const snap = await getDocs(
        query(collection(db, "blog"), orderBy("createdAt", "desc"))
      );
      const blogList: Blog[] = snap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            imageURL: data.imageURL,
            author: data.author ?? "Unknown author",
            createdAt: data.createdAt ?? null,
          };
        }
      );
      setBlogs(blogList);
    }
    fetchBlogs();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#1F1A16]">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B]">
        Gospel Sounders Blog
      </h1>

      {/* Blog Cards Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition p-5"
          >
            {blog.imageURL && (
              <img
                src={blog.imageURL}
                alt={blog.title}
                className="rounded-xl object-cover h-48 w-full mb-4"
              />
            )}

            <h2 className="text-xl font-bold text-gray-900 dark:text-[#F6F1EA] mb-2">
              {blog.title}
            </h2>

            <p className="text-sm text-[#6B4A2E] dark:text-[#D9A441] mb-1">
              By {blog.author}
            </p>

            {blog.createdAt && (
              <p className="text-xs text-[#A67C52] dark:text-[#D9A441] mb-3">
                {formatProfessionalDate(blog.createdAt)}
              </p>
            )}

            <p className="text-gray-700 dark:text-[#D8C9B4] mb-4 line-clamp-4">
              {getPreview(blog.content)}
            </p>

            {/* Read More button */}
            <Link
              href={`/blog/${blog.id}`}
              className="mt-auto inline-block w-full text-center bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
