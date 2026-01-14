"use client";

import { useEffect, useState, useCallback } from "react";
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

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};

// -------- Helpers --------
function formatProfessionalDate(date: any): string {
  if (!date) return "";
  
  const d = date?.toDate ? date.toDate() : new Date(date);
  if (isNaN(d.getTime())) return "";
  
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

  return `Published on ${day}${suffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
}

function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

function createShareableText(title: string, content: string, maxWords: number = 60): string {
  const plainContent = stripHtml(content);
  const titleWordCount = title.split(/\s+/).length;
  const contentMaxWords = Math.max(0, maxWords - titleWordCount);
  
  return `${title} ${truncateWords(plainContent, contentMaxWords)}`;
}

// -------- Custom Hook for Share Logic --------
function useShareBlog(blog: Blog | null) {
  const [isSharing, setIsSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const shareBlog = useCallback(async () => {
    if (!blog) return;

    setIsSharing(true);
    setToastMessage(null);

    try {
      // STEP 1: Silently copy title + description (max 60 words) to clipboard
      const shareableText = createShareableText(blog.title, blog.content, 60);
      
      await navigator.clipboard.writeText(shareableText);
      
      // Brief delay to ensure clipboard operation completes
      await new Promise(resolve => setTimeout(resolve, 100));

      // STEP 2: Share image + title + description + blog link
      const shareData: ShareData = {
        title: blog.title,
        text: shareableText,
        url: window.location.href,
      };

      // Prepare image file if available
      let imageFile: File | null = null;
      if (blog.imageURL) {
        try {
          const response = await fetch(blog.imageURL);
          if (response.ok) {
            const blob = await response.blob();
            imageFile = new File([blob], "blog-image.jpg", { 
              type: blob.type || "image/jpeg" 
            });
          }
        } catch (error) {
          console.debug("Image fetch failed, proceeding without it:", error);
        }
      }

      // Attempt share with image if supported
      if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
        await navigator.share({
          ...shareData,
          files: [imageFile],
        });
      } else if (navigator.share) {
        // Fallback to text-only share
        await navigator.share(shareData);
      } else {
        // Final fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage("Link copied to clipboard!");
      }
    } catch (error: any) {
      // Only handle non-abort errors (user cancelled share)
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
        
        // Emergency fallback: copy everything to clipboard
        const fallbackText = createShareableText(blog.title, blog.content, 60) + 
                            "\n\n" + window.location.href;
        await navigator.clipboard.writeText(fallbackText);
        setToastMessage("Content copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
      // Clear toast after 3 seconds
      if (toastMessage) {
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  }, [blog]);

  return { shareBlog, isSharing, toastMessage };
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [suggestedBlogs, setSuggestedBlogs] = useState<Blog[]>([]);
  const { shareBlog, isSharing, toastMessage } = useShareBlog(blog);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogAndSuggestions() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;

        // Fetch current blog
        const blogDoc = await getDoc(doc(db, "blog", id));
        if (!isMounted) return;

        if (!blogDoc.exists()) {
          router.push("/blog");
          return;
        }

        const data = blogDoc.data();
        const currentBlog: Blog = {
          id: blogDoc.id,
          title: data.title || "Untitled",
          content: data.content || "",
          imageURL: data.imageURL,
          author: data.author || "Unknown Author",
          createdAt: data.createdAt || null,
        };

        setBlog(currentBlog);

        // Fetch suggested blogs
        const blogsRef = collection(db, "blog");
        const q = query(blogsRef, where("__name__", "!=", id), limit(6));
        const querySnapshot = await getDocs(q);
        if (!isMounted) return;

        const suggestions: Blog[] = [];
        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          suggestions.push({
            id: docSnap.id,
            title: d.title || "Untitled",
            content: d.content || "",
            imageURL: d.imageURL,
            author: d.author || "Unknown Author",
            createdAt: d.createdAt || null,
          });
        });

        setSuggestedBlogs(suggestions.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        if (isMounted) {
          router.push("/blog");
        }
      }
    }

    fetchBlogAndSuggestions();

    return () => {
      isMounted = false;
    };
  }, [params.id, router]);

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading blog content...</div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Navigation */}
        <button
          onClick={() => router.push("/blog")}
          className="mb-8 text-[#6B4A2E] dark:text-[#D9A441] font-semibold hover:underline flex items-center gap-2 transition-colors"
          aria-label="Back to blogs"
        >
          ← Back to Blogs
        </button>

        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {blog.title}
          </h1>
          <div className="text-[#6B4A2E] dark:text-[#D9A441] font-medium">
            By {blog.author} • {formatProfessionalDate(blog.createdAt)}
          </div>
        </header>

        {/* Featured Image */}
        {blog.imageURL && (
          <div className="mb-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={blog.imageURL}
              alt={blog.title}
              className="w-full h-auto max-h-[60vh] object-contain"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Share Button - Single Button with Two-Step Process */}
        <div className="mb-12">
          <button
            onClick={shareBlog}
            disabled={isSharing}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-3 
                     bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] 
                     text-white dark:text-gray-900 
                     py-4 px-8 rounded-full 
                     font-semibold hover:opacity-90 
                     transition-all duration-200 
                     disabled:opacity-70 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:ring-offset-2"
            aria-label="Share this blog"
          >
            {isSharing ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Preparing Share...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                <span>Share This Blog</span>
              </>
            )}
          </button>
        </div>

        {/* Suggested Blogs */}
        {suggestedBlogs.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedBlogs.map((suggestion) => (
                <article
                  key={suggestion.id}
                  onClick={() => router.push(`/blog/${suggestion.id}`)}
                  className="group cursor-pointer bg-white dark:bg-gray-800 
                           rounded-xl shadow-sm hover:shadow-xl 
                           transition-all duration-300 overflow-hidden"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/blog/${suggestion.id}`);
                    }
                  }}
                >
                  {suggestion.imageURL && (
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={suggestion.imageURL}
                        alt={suggestion.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {stripHtml(suggestion.content).slice(0, 120)}...
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      By {suggestion.author}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Enjoyed this article? Explore more stories from our collection.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-[#6B4A2E] to-[#D9A441]
                     text-white dark:text-gray-900 
                     rounded-full font-semibold 
                     hover:opacity-90 transition-opacity"
          >
            Browse All Articles
          </button>
        </footer>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}