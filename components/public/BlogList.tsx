"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Link from "next/link";

export interface Blog {
  id: string;
  title: string;
  content?: string;
  imageURL?: string;
  author?: string;
  createdAt?: any;
}

// ---------- UTILITY ----------
const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

const getPreview = (content?: string, wordLimit = 40) => {
  const clean = stripHtml(content);
  const words = clean.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "…" : clean;
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
export default function BlogList({ maxBlogs = 2 }: { maxBlogs?: number }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const q = query(
          collection(db, "blog"),
          orderBy("createdAt", "desc"),
          limit(maxBlogs)
        );
        const snap = await getDocs(q);
        const blogList: Blog[] = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            imageURL: data.imageURL,
            author: data.author ?? "Unknown author",
            createdAt: data.createdAt ?? null,
          };
        });
        setBlogs(blogList);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [maxBlogs]);

  if (loading) return <p className="text-center text-[#5A3A23]">Loading blogs...</p>;
  if (blogs.length === 0) return <p className="text-center text-[#5A3A23]">No blogs available.</p>;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
      {blogs.map(blog => (
        <div
          key={blog.id}
          className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-md hover:shadow-xl transition p-5"
        >
          {blog.imageURL && (
            <div className="w-full h-48 overflow-hidden rounded-xl mb-4">
              <img
                src={blog.imageURL}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h3 className="text-xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-2">{blog.title}</h3>

          <p className="text-xs text-[#6B4A2E] dark:text-[#D9A441] mb-1">By {blog.author}</p>
          {blog.createdAt && (
            <p className="text-xs text-[#A67C52] dark:text-[#D9A441] mb-3">{formatDate(blog.createdAt)}</p>
          )}

          <p className="text-gray-700 dark:text-[#D8C9B4] text-sm mb-4 line-clamp-4">{getPreview(blog.content)}</p>

          <Link
            href={`/blog/${blog.id}`}
            className="mt-auto inline-block w-full text-center bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
          >
            Read More →
          </Link>
        </div>
      ))}
    </div>
  );
}
