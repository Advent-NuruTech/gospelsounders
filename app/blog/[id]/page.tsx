"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

// -------- Helpers --------
function formatProfessionalDate(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date?.toDate
      ? date.toDate()
      : new Date(date);

  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `Published on ${day}${suffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function getExcerpt(text: string, words = 24) {
  return text.split(" ").slice(0, words).join(" ") + "…";
}

export default function BlogIdPage() {
  const params = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [suggestedBlogs, setSuggestedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogAndSuggestions() {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      const snap = await getDoc(doc(db, "blog", id));
      if (!snap.exists()) {
        router.push("/blog");
        return;
      }

      const data = snap.data();
      const currentBlog: Blog = {
        id: snap.id,
        title: data.title,
        content: data.content,
        imageURL: data.imageURL,
        author: data.author ?? "Unknown author",
        createdAt: data.createdAt ?? null,
      };

      setBlog(currentBlog);

      // Fetch suggested blogs
      const q = query(collection(db, "blog"), limit(6));
      const qsnap = await getDocs(q);

      const others: Blog[] = [];
      qsnap.forEach((docSnap) => {
        if (docSnap.id !== id) {
          const d = docSnap.data();
          others.push({
            id: docSnap.id,
            title: d.title,
            content: d.content,
            imageURL: d.imageURL,
            author: d.author ?? "Unknown author",
            createdAt: d.createdAt ?? null,
          });
        }
      });

      setSuggestedBlogs(others.slice(0, 3));
    }

    fetchBlogAndSuggestions();
  }, [params.id, router]);

  if (!blog) {
    return <p className="text-center mt-20 text-gray-500">Loading blog…</p>;
  }

  // -------- SHARE LOGIC --------
  async function shareBlog(blog: Blog) {
    const plainText = stripHtml(blog.content);
    const excerpt = getExcerpt(plainText, 60);

    try {
      if (blog.imageURL && navigator.canShare) {
        const res = await fetch(blog.imageURL);
        const blob = await res.blob();
        const file = new File([blob], "blog-image.jpg", { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: blog.title,
            text: excerpt,
            files: [file],
            url: window.location.href,
          });
          return;
        }
      }

      await navigator.share({
        title: blog.title,
        text: excerpt,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-[#1F1A16] min-h-screen">
      {/* Top Back */}
      <button
        onClick={() => router.push("/blog")}
        className="mb-6 text-[#6B4A2E] dark:text-[#D9A441] font-semibold hover:underline"
      >
        ← Back to Blogs
      </button>

      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
        {blog.title}
      </h1>

      <p className="text-[#6B4A2E] dark:text-[#D9A441] font-medium mb-6">
        By {blog.author} • {formatProfessionalDate(blog.createdAt)}
      </p>

      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="w-full rounded-lg mb-6 object-contain"
        />
      )}

      <div
        className="prose max-w-none dark:prose-invert text-gray-700 dark:text-[#D8C9B4]"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Share */}
      <div className="mt-8">
        <button
          onClick={() => shareBlog(blog)}
          className="w-full bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Share This Blog
        </button>
      </div>

      {/* Leave Hint */}
      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        You have reached the end of this article.{" "}
        <button
          onClick={() => router.push("/blog")}
          className="font-semibold text-[#6B4A2E] dark:text-[#D9A441] hover:underline"
        >
          Go back to the Blogs tab
        </button>
      </div>

      {/* Suggested Blogs */}
      {suggestedBlogs.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold mb-6 text-[#6B4A2E] dark:text-[#D9A441]">
            Suggested Blogs
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {suggestedBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => router.push(`/blog/${b.id}`)}
                className="cursor-pointer bg-white dark:bg-[#2A231D] rounded-lg shadow hover:shadow-lg transition p-4"
              >
                {b.imageURL && (
                  <img
                    src={b.imageURL}
                    alt={b.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getExcerpt(stripHtml(b.content), 20)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
