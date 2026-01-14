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
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
  const [isSharing, setIsSharing] = useState(false);

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

      // Fetch suggested blogs excluding current one
      const blogsRef = collection(db, "blog");
      const q = query(blogsRef, where("__name__", "!=", id), limit(6));
      const qsnap = await getDocs(q);

      const others: Blog[] = [];
      qsnap.forEach((docSnap) => {
        const d = docSnap.data();
        others.push({
          id: docSnap.id,
          title: d.title,
          content: d.content,
          imageURL: d.imageURL,
          author: d.author ?? "Unknown author",
          createdAt: d.createdAt ?? null,
        });
      });

      setSuggestedBlogs(others.slice(0, 3));
    }

    fetchBlogAndSuggestions();
  }, [params.id, router]);

  // -------- IMPROVED SHARE LOGIC --------
  async function shareBlog(blog: Blog) {
    setIsSharing(true);
    const plainText = stripHtml(blog.content);
    const excerpt = getExcerpt(plainText, 20); // ~60 words total with title
    
    // Create share text with title and description (max 60 words)
    const shareText = `${blog.title}. ${excerpt}`;
    
    try {
      // First try with image
      if (blog.imageURL && navigator.share && navigator.canShare) {
        try {
          const response = await fetch(blog.imageURL);
          const blob = await response.blob();
          const file = new File([blob], 'blog-image.jpg', { type: blob.type });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: blog.title,
              text: shareText,
              files: [file],
              url: window.location.href,
            });
            setIsSharing(false);
            return;
          }
        } catch (error) {
          console.log('Image share failed, falling back to text');
        }
      }

      // Fallback to text-only share
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(`${blog.title} - ${window.location.href}`);
        alert("Blog link copied to clipboard!");
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        // Fallback clipboard copy
        await navigator.clipboard.writeText(`${blog.title} - ${window.location.href}`);
        alert("Blog link copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
    }
  }

  if (!blog) {
    return <p className="text-center mt-20 text-gray-500">Loading blog…</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-[#1F1A16] min-h-screen">
      {/* Top Back */}
      <button
        onClick={() => router.push("/blog")}
        className="mb-8 text-[#6B4A2E] dark:text-[#D9A441] font-semibold hover:underline flex items-center gap-2"
      >
        ← Back to Blogs
      </button>

      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
        {blog.title}
      </h1>

      <p className="text-[#6B4A2E] dark:text-[#D9A441] font-medium mb-8">
        By {blog.author} • {formatProfessionalDate(blog.createdAt)}
      </p>

      {blog.imageURL && (
        <div className="relative w-full h-[400px] mb-8">
          <img
            src={blog.imageURL}
            alt={blog.title}
            className="w-full h-full object-contain rounded-lg bg-gray-100 dark:bg-[#2A231D]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none dark:prose-invert text-gray-700 dark:text-[#D8C9B4] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Share Button */}
      <div className="mt-12">
        <button
          onClick={() => shareBlog(blog)}
          disabled={isSharing}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-4 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {isSharing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sharing...
            </>
          ) : (
            'Share This Blog'
          )}
        </button>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Share the title, description, and image with your friends
        </p>
      </div>

      {/* Suggested Blogs - Improved */}
      {suggestedBlogs.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-[#6B4A2E] dark:text-[#D9A441]">
            More Stories You Might Like
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => router.push(`/blog/${b.id}`)}
                className="group cursor-pointer bg-white dark:bg-[#2A231D] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="relative w-full h-48 bg-gray-100 dark:bg-[#3A332D]">
                  {b.imageURL ? (
                    <img
                      src={b.imageURL}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-3 group-hover:text-[#6B4A2E] dark:group-hover:text-[#D9A441] transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {getExcerpt(stripHtml(b.content), 20)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>By {b.author}</span>
                    <span className="group-hover:text-[#6B4A2E] dark:group-hover:text-[#D9A441] transition-colors">
                      Read →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leave Hint */}
      <div className="mt-12 text-center py-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You've reached the end of this story. Ready for more inspiration?
        </p>
        <button
          onClick={() => router.push("/blog")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-full font-semibold hover:opacity-90 transition"
        >
          Explore All Blogs
        </button>
      </div>
    </main>
  );
}