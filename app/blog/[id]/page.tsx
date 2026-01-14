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

// Helper to truncate text for sharing
function createShareText(title: string, description: string, maxWords = 60): string {
  const titleWords = title.split(" ").length;
  const availableWords = maxWords - titleWords;
  
  const truncatedDesc = description.split(" ").slice(0, availableWords).join(" ");
  return `${title}. ${truncatedDesc}${description.split(" ").length > availableWords ? '…' : ''}`;
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

  // -------- FIXED SHARE LOGIC --------
  async function shareBlog(blog: Blog) {
    setIsSharing(true);
    
    try {
      const plainText = stripHtml(blog.content);
      const shareText = createShareText(blog.title, plainText, 60);
      
      // Check if Web Share API is available
      if (!navigator.share) {
        throw new Error("Web Share API not supported");
      }

      let shareData: ShareData = {
        title: blog.title,
        text: shareText,
        url: window.location.href,
      };

      // Only attempt image share if we have an image URL
      if (blog.imageURL) {
        try {
          // Fetch the image
          const response = await fetch(blog.imageURL);
          if (!response.ok) throw new Error("Failed to fetch image");
          
          const blob = await response.blob();
          const file = new File([blob], 'blog-image.jpg', { 
            type: blob.type || 'image/jpeg' 
          });
          
          // Check if files can be shared
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData = {
              ...shareData,
              files: [file],
            };
          }
        } catch (imageError) {
          console.warn('Image sharing failed, continuing with text-only:', imageError);
          // Continue with text-only share
        }
      }

      // Attempt to share
      await navigator.share(shareData);

    } catch (error: any) {
      // Only show fallback for non-abort errors
      if (error.name !== 'AbortError') {
        console.warn('Share failed:', error);
        
        // Improved fallback: Copy formatted text to clipboard
        const plainText = stripHtml(blog.content);
        const excerpt = getExcerpt(plainText, 20);
        const textToCopy = `${blog.title}\n\n${excerpt}\n\n${window.location.href}`;
        
        try {
          await navigator.clipboard.writeText(textToCopy);
          alert("Blog content copied to clipboard! You can paste it to share.");
        } catch (clipboardError) {
          // Last resort fallback
          const shareUrl = `${blog.title} - ${window.location.href}`;
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert("Blog link copied to clipboard!");
        }
      }
    } finally {
      setIsSharing(false);
    }
  }

  // Alternative approach for platforms that support text but not files properly
  async function shareWithoutImage(blog: Blog) {
    const plainText = stripHtml(blog.content);
    const shareText = createShareText(blog.title, plainText, 60);
    
    try {
      await navigator.share({
        title: blog.title,
        text: shareText,
        url: window.location.href,
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        const textToCopy = `${blog.title}\n${shareText}\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        alert("Blog preview copied to clipboard!");
      }
    }
  }

  // Test if sharing works properly on current platform
  const canShareFiles = blog?.imageURL && 
    typeof navigator.share === 'function' && 
    typeof navigator.canShare === 'function' && 
    navigator.canShare({ files: [new File([], 'test.jpg')] });

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

      {/* Share Section with Options */}
      <div className="mt-12 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => shareBlog(blog)}
            disabled={isSharing}
            className="flex-1 max-w-md flex items-center justify-center gap-3 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-4 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {isSharing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sharing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share Blog with Image
              </>
            )}
          </button>
          
          {canShareFiles && (
            <button
              onClick={() => shareWithoutImage(blog)}
              className="flex-1 max-w-md flex items-center justify-center gap-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 rounded-full font-semibold hover:opacity-90 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              Share Text Only
            </button>
          )}
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {canShareFiles 
            ? "Share includes: Title, description (60 words max), image, and link"
            : "Share includes: Title, description (60 words max), and link"}
        </p>
      </div>

      {/* Suggested Blogs */}
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