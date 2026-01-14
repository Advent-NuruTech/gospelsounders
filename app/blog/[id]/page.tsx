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
import Head from "next/head";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: Date | { toDate: () => Date } | string;
  description?: string;
};

// -------- Helpers --------
function formatProfessionalDate(date: Blog["createdAt"]) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date instanceof Date
      ? date
      : date?.toDate
      ? date.toDate()
      : new Date();

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
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "…";
}

function createShareText(title: string, description: string, maxWords = 60): string {
  const titleWords = title.split(" ").length;
  const availableWords = Math.max(10, maxWords - titleWords);
  
  const truncatedDesc = description.split(" ").slice(0, availableWords).join(" ");
  const hasMore = description.split(" ").length > availableWords;
  return `${title}. ${truncatedDesc}${hasMore ? '…' : ''}`;
}

function generateMetaDescription(blog: Blog): string {
  if (blog.description) {
    return blog.description.length > 160 
      ? blog.description.substring(0, 157) + "..."
      : blog.description;
  }
  
  const plainText = stripHtml(blog.content);
  if (plainText.length <= 160) return plainText;
  
  return plainText.substring(0, 157) + "...";
}

export default function BlogIdPage() {
  const params = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [suggestedBlogs, setSuggestedBlogs] = useState<Blog[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [shareSupported, setShareSupported] = useState(false);
  const [contentParagraphs, setContentParagraphs] = useState<string[]>([]);
  const [lastTwoParagraphs, setLastTwoParagraphs] = useState<string>("");

  useEffect(() => {
    setShareSupported(!!navigator.share);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        description: data.description || "",
      };

      setBlog(currentBlog);
      
      // Generate meta description
      const metaDesc = generateMetaDescription(currentBlog);
      setMetaDescription(metaDesc);
      document.title = `${currentBlog.title} | Blog`;

      // Process content for better readability
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentBlog.content;
      const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);
      setContentParagraphs(paragraphs);
      
      // Extract last two paragraphs for special handling
      if (paragraphs.length >= 2) {
        const lastTwo = paragraphs.slice(-2);
        const lastTwoText = lastTwo.map(p => stripHtml(p)).join(' ');
        setLastTwoParagraphs(lastTwoText);
      }

      // Fetch suggested blogs
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
          description: d.description || "",
        });
      });

      setSuggestedBlogs(others.slice(0, 3));
    }

    fetchBlogAndSuggestions();
  }, [params.id, router]);

  async function shareWithImage(blog: Blog) {
    if (!shareSupported) {
      try {
        const textToCopy = `${blog.title}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        alert("Link copied to clipboard!");
      } catch {
        alert("Sharing is not supported on this device");
      }
      return;
    }

    setIsSharing(true);
    
    try {
      const plainText = stripHtml(blog.content);
      const shareText = createShareText(blog.title, plainText, 60);
      
      let shareData: ShareData = {
        title: blog.title,
        text: shareText,
        url: window.location.href,
      };

      if (blog.imageURL) {
        try {
          const response = await fetch(blog.imageURL);
          if (response.ok) {
            const blob = await response.blob();
            const file = new File([blob], 'blog-image.jpg', { 
              type: blob.type || 'image/jpeg' 
            });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData = {
                ...shareData,
                files: [file],
              };
            }
          }
        } catch {
          // Continue without image
        }
      }

      await navigator.share(shareData);

    } catch (error: unknown) {
      const err = error as Error;
      if (err.name !== 'AbortError') {
        try {
          const textToCopy = `${blog.title}\n${window.location.href}`;
          await navigator.clipboard.writeText(textToCopy);
          alert("Link copied to clipboard!");
        } catch {
          // Ignore clipboard errors
        }
      }
    } finally {
      setIsSharing(false);
    }
  }

  async function shareTextContent(blog: Blog) {
    if (!shareSupported) {
      try {
        const textToCopy = `${blog.title}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(textToCopy);
        alert("Link copied to clipboard!");
      } catch {
        alert("Sharing is not supported on this device");
      }
      return;
    }

    try {
      const plainText = stripHtml(blog.content);
      const shareText = createShareText(blog.title, plainText, 60);
      
      await navigator.share({
        title: blog.title,
        text: shareText,
        url: window.location.href,
      });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name !== 'AbortError') {
        try {
          const textToCopy = `${blog.title}\n${window.location.href}`;
          await navigator.clipboard.writeText(textToCopy);
          alert("Link copied to clipboard!");
        } catch {
          // Ignore clipboard errors
        }
      }
    }
  }

  const handleSuggestedBlogClick = (blogId: string) => {
    router.push(`/blog/${blogId}`);
    scrollToTop();
  };

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4A2E] dark:border-[#D9A441]"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${blog.title} | Blog`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {blog.imageURL && <meta property="og:image" content={blog.imageURL} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={metaDescription} />
        {blog.imageURL && <meta name="twitter:image" content={blog.imageURL} />}
        <meta name="author" content={blog.author} />
      </Head>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/blog")}
          className="mb-10 text-[#6B4A2E] dark:text-[#D9A441] hover:text-[#B8860B] dark:hover:text-[#FFD700] font-medium flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all articles
        </button>

        {/* Article Header */}
        <article>
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">

              {blog.title}
            </h1>

            {/* Meta Description */}
            {metaDescription && (
              <div className="mb-8">
                <p className="text-lg text-[#6B4A2E] dark:text-[#D8C9B4] leading-relaxed bg-gradient-to-r from-[#6B4A2E]/10 to-[#D9A441]/10 dark:from-[#6B4A2E]/20 dark:to-[#D9A441]/10 rounded-xl p-6">
                  {metaDescription}
                </p>
              </div>
            )}

            {/* Author & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-[#6B4A2E]/20 dark:border-[#D9A441]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] flex items-center justify-center">
                  <span className="font-medium text-white dark:text-black">
                    {blog.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#6B4A2E] dark:text-[#D9A441]">By {blog.author}</p>
                  <p className="text-sm text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
                    {formatProfessionalDate(blog.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image - Only shows when imageURL exists */}
          {blog.imageURL && (
            <div className="mb-10 rounded-2xl overflow-hidden">
              <img
                src={blog.imageURL}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Content with Enhanced Readability */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              {contentParagraphs.map((paragraph, index) => {
                const isLastTwo = index >= contentParagraphs.length - 2;
                
                return (
                  <div 
                    key={index} 
                    className={`
                      leading-relaxed text-[#6B4A2E] dark:text-[#D8C9B4]
                      ${isLastTwo ? 'bg-gradient-to-r from-[#6B4A2E]/5 to-[#D9A441]/5 dark:from-[#6B4A2E]/10 dark:to-[#D9A441]/10 p-6 rounded-xl' : ''}
                    `}
                  >
                    <div 
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                      className={isLastTwo ? 'text-lg' : ''}
                    />
                    
                    {isLastTwo && lastTwoParagraphs && (
                      <div className="mt-4">
                        <meta name="description" content={lastTwoParagraphs.substring(0, 155) + '...'} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* Sharing Section */}
        <div className="mt-16 pt-8 border-t border-[#6B4A2E]/20 dark:border-[#D9A441]/20">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-[#6B4A2E] dark:text-[#D9A441] mb-2">
              Share this article
            </h3>
            <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
              Help others discover this story
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Share with Image Button */}
            <button
              onClick={() => shareWithImage(blog)}
              disabled={isSharing}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 w-full sm:w-auto min-w-[240px]"
            >
              {isSharing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Share with Image
                </>
              )}
            </button>
            
            {/* Share Text Only Button */}
            <button
              onClick={() => shareTextContent(blog)}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-[#1F1A16] text-[#6B4A2E] dark:text-[#D9A441] border-2 border-[#6B4A2E] dark:border-[#D9A441] rounded-full font-medium hover:bg-[#6B4A2E] hover:text-white dark:hover:bg-[#D9A441] dark:hover:text-black transition-all duration-300 w-full sm:w-auto min-w-[240px]"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Share Text Only
            </button>
          </div>
        </div>

        {/* Suggested Articles */}
        {suggestedBlogs.length > 0 && (
          <section className="mt-20">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
                Continue Reading
              </h2>
              <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
                More stories you might enjoy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {suggestedBlogs.map((b) => (
                <article
                  key={b.id}
                  onClick={() => handleSuggestedBlogClick(b.id)}
                  className="group cursor-pointer bg-white dark:bg-[#2A231D] rounded-2xl overflow-hidden border border-[#6B4A2E]/20 dark:border-[#D9A441]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image section only shows when imageURL exists */}
                  {b.imageURL && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={b.imageURL}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className={`p-6 ${!b.imageURL ? 'pt-6' : ''}`}>
                    <h3 className="font-bold text-lg mb-3 text-[#6B4A2E] dark:text-[#D9A441] group-hover:text-[#B8860B] dark:group-hover:text-[#FFD700] transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-[#6B4A2E]/70 dark:text-[#D8C9B4]/70 text-sm mb-4 line-clamp-3">
                      {b.description 
                        ? getExcerpt(b.description, 20)
                        : getExcerpt(stripHtml(b.content), 20)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6B4A2E]/60 dark:text-[#D9A441]/60">
                        By {b.author}
                      </span>
                      <span className="text-sm font-medium text-[#6B4A2E] dark:text-[#D9A441] group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 pt-12 border-t border-[#6B4A2E]/20 dark:border-[#D9A441]/20 text-center">
          <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70 mb-6 text-lg">
            Enjoyed this article? Explore more insights
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            View All Articles
          </button>
        </div>
      </main>
    </>
  );
}