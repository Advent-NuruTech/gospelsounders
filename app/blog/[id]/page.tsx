"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

// Professional date formatting
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

export default function BlogIdPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      // Make sure id is a string
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      const docRef = doc(db, "blog", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setBlog({
          id: snap.id,
          title: data.title,
          content: data.content,
          imageURL: data.imageURL,
          author: data.author ?? "Unknown author",
          createdAt: data.createdAt ?? null,
        });
      } else {
        router.push("/blog"); // Redirect if blog not found
      }
    }
    fetchBlog();
  }, [params.id, router]);

  if (!blog) {
    return <p className="text-center mt-20 text-gray-500">Loading blog...</p>;
  }

  // Share blog
  async function shareBlog(blog: Blog) {
    const shareData: any = {
      title: blog.title,
      text: blog.content.split(" ").slice(0, 60).join(" ") + "…",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Blog link copied to clipboard!");
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-[#1F1A16] min-h-screen">
      <button
        onClick={() => router.back()}
        className="mb-6 text-[#6B4A2E] dark:text-[#D9A441] font-semibold hover:underline"
      >
        ← Back to Blogs
      </button>

      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B]">
        {blog.title}
      </h1>

      <p className="text-[#6B4A2E] dark:text-[#D9A441] font-medium mb-6">
        By {blog.author} • {formatProfessionalDate(blog.createdAt)}
      </p>

      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="w-full object-contain rounded-lg mb-6"
        />
      )}

      <div
        className="prose max-w-none dark:prose-invert text-gray-700 dark:text-[#D8C9B4] mb-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
        <button
          onClick={() => shareBlog(blog)}
          className="flex-1 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-3 px-6 rounded-full font-semibold hover:opacity-90 transition text-center"
        >
          Share This Blog
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
          Share the blog title and a 60-word preview directly!
        </p>
          <button
        onClick={() => router.back()}
        className="mb-6 text-[#6B4A2E] dark:text-[#D9A441] font-semibold hover:underline"
      >
        ← Back to Blogs
      </button>
      </div>
    </main>
  );
}
