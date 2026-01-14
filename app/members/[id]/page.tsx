"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import parse from "html-react-parser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Member {
  id?: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: Date | { toDate: () => Date } | string;
  description?: string;
}

// Helper for short preview
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getPreview(html: string, words = 18) {
  const clean = stripHtml(html);
  const parts = clean.split(" ");
  return parts.length > words ? parts.slice(0, words).join(" ") + "…" : clean;
}

function extractLastTwoParagraphs(content: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent?.trim() || '');
  
  // Get last two paragraphs that have content
  const nonEmptyParagraphs = paragraphs.filter(p => p.length > 0);
  const lastTwo = nonEmptyParagraphs.slice(-2);
  
  return lastTwo.join(' ');
}

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

  return `${d.toLocaleString("default", {
    month: "short",
  })} ${day}${suffix}, ${d.getFullYear()}`;
}

export default function MemberPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [member, setMember] = useState<Member | null>(null);
  const [otherMembers, setOtherMembers] = useState<Member[]>([]);
  const [memberBlogs, setMemberBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMemberData = async () => {
      setLoading(true);
      setLoadingBlogs(true);
      
      try {
        // Fetch current member
        const snap = await getDoc(doc(db, "members", id));
        if (snap.exists()) {
          const memberData = { id: snap.id, ...(snap.data() as Member) };
          setMember(memberData);
          
          // Fetch blogs by this member
          const blogsQuery = query(
            collection(db, "blog"),
            orderBy("createdAt", "desc"),
            limit(6)
          );
          const blogsSnap = await getDocs(blogsQuery);
          
          const blogs: Blog[] = [];
          blogsSnap.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if author matches member name
            if (data.author === memberData.name) {
              blogs.push({
                id: docSnap.id,
                title: data.title,
                content: data.content,
                imageURL: data.imageURL,
                author: data.author ?? "Unknown author",
                createdAt: data.createdAt ?? null,
                description: data.description || "",
              });
            }
          });
          
          setMemberBlogs(blogs);
        } else {
          setMember(null);
        }

        // Fetch other members (max 6)
        const snapOther = await getDocs(query(collection(db, "members"), orderBy("createdAt", "asc"), limit(6)));
        const list = snapOther.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Member, "id">) }))
          .filter((m) => m.id !== id);
        setOtherMembers(list);
      } catch (err) {
        console.error("Error fetching member data:", err);
        setMember(null);
        setMemberBlogs([]);
        setOtherMembers([]);
      } finally {
        setLoading(false);
        setLoadingBlogs(false);
      }
    };

    fetchMemberData();
  }, [id]);

  const handleBlogClick = (blogId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4A2E] dark:border-[#D9A441]"></div>
    </div>
  );
  
  if (!member) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <h2 className="text-2xl font-bold text-[#6B4A2E] dark:text-[#D9A441] mb-4">Member not found</h2>
      <Link 
        href="/members" 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
      >
        ← Back to Members
      </Link>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#1F1A16] min-h-screen">
      {/* Back Navigation */}
      <Link 
        href="/members" 
        className="inline-flex items-center gap-2 text-[#6B4A2E] dark:text-[#D9A441] hover:text-[#B8860B] dark:hover:text-[#FFD700] font-medium mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to All Members
      </Link>

      {/* Current Member */}
      <div className="max-w-4xl mx-auto mb-16">
        {/* Member Image - Responsive and not cropped */}
        {member.imageUrl && (
          <div className="relative w-full h-auto mb-8">
            <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden bg-[#F6F1EA] dark:bg-[#2A1A10] shadow-lg">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                priority
              />
            </div>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#6B4A2E] dark:text-[#D9A441]">
          {member.name}
        </h1>

        {/* Member Content with Enhanced Readability */}
        <article className="prose prose-lg max-w-none dark:prose-invert 
          prose-headings:text-[#6B4A2E] prose-headings:dark:text-[#D9A441]
          prose-p:text-[#5A3A23] prose-p:dark:text-[#D8C9B4] prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#B8860B] prose-a:dark:text-[#FFD700] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#5A3A23] prose-strong:dark:text-[#D8C9B4]
          prose-em:text-[#6B4A2E]/70 prose-em:dark:text-[#D9A441]/70
          prose-blockquote:text-[#5A3A23] prose-blockquote:dark:text-[#D8C9B4] prose-blockquote:border-l-[#6B4A2E] prose-blockquote:dark:border-l-[#D9A441]
          prose-ul:text-[#5A3A23] prose-ul:dark:text-[#D8C9B4]
          prose-ol:text-[#5A3A23] prose-ol:dark:text-[#D8C9B4]
          prose-li:marker:text-[#6B4A2E] prose-li:dark:marker:text-[#D9A441]">
          {parse(member.metadata)}
        </article>
      </div>

      {/* Blogs by this Member */}
      {memberBlogs.length > 0 && (
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[#6B4A2E] dark:text-[#D9A441]">
              Blogs by {member.name}
            </h2>
            <span className="text-sm text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
              {memberBlogs.length} article{memberBlogs.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid gap-6">
            {memberBlogs.map((blog) => {
              const excerpt = blog.description 
                ? blog.description.length > 120 
                  ? blog.description.substring(0, 117) + "..."
                  : blog.description
                : getPreview(blog.content, 30);

              return (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.id}`}
                  onClick={() => handleBlogClick(blog.id)}
                  className="group block bg-white dark:bg-[#2A221C] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {blog.imageURL && (
                        <div className="relative w-full lg:w-48 h-48 lg:h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={blog.imageURL}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#6B4A2E] dark:text-[#D9A441] mb-2 group-hover:text-[#B8860B] dark:group-hover:text-[#FFD700] transition-colors">
                          {blog.title}
                        </h3>
                        
                        <p className="text-[#5A3A23]/70 dark:text-[#D8C9B4]/70 text-sm mb-3 line-clamp-2">
                          {excerpt}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-[#6B4A2E]/60 dark:text-[#D9A441]/60">
                          <span>{formatProfessionalDate(blog.createdAt)}</span>
                          <span className="group-hover:text-[#6B4A2E] dark:group-hover:text-[#D9A441] transition-colors font-medium">
                            Read article →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Other Members */}
      {otherMembers.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-[#6B4A2E] dark:text-[#D9A441]">
            Meet Other Team Members
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMembers.map((m, index) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Image section - only shows when imageUrl exists */}
                {m.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={m.imageUrl} 
                      alt={m.name} 
                      fill 
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#6B4A2E] dark:text-[#D9A441] mb-2">
                    {m.name}
                  </h3>

                  <p className="text-sm text-[#5A3A23]/70 dark:text-[#D8C9B4]/70 mb-4 line-clamp-3 flex-1">
                    {getPreview(m.metadata)}
                  </p>

                  <Link
                    href={`/members/${m.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-medium hover:opacity-90 transition mt-auto"
                  >
                    View Profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

    
     
    </main>
  );
}