"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import parse from "html-react-parser";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { motion } from "framer-motion";

interface Member {
  id?: string;
  name: string;
  imageUrl: string;
  metadata: string;
  description?: string;
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

function getExcerpt(text: string, words = 24) {
  const wordsArray = text.split(" ");
  if (wordsArray.length <= words) return text;
  return wordsArray.slice(0, words).join(" ") + "…";
}

function getPreview(html: string, words = 18) {
  const clean = stripHtml(html);
  const parts = clean.split(" ");
  return parts.length > words ? parts.slice(0, words).join(" ") + "…" : clean;
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

// Helper to check if author name matches member name (case-insensitive, partial match)
function authorMatchesMember(authorName: string, memberName: string): boolean {
  // Clean and normalize both names
  const cleanAuthor = authorName.trim().toLowerCase();
  const cleanMember = memberName.trim().toLowerCase();
  
  // Check for exact match
  if (cleanAuthor === cleanMember) return true;
  
  // Check if member name contains author name or vice versa
  if (cleanAuthor.includes(cleanMember) || cleanMember.includes(cleanAuthor)) return true;
  
  // Split into parts and check for any part matches
  const authorParts = cleanAuthor.split(/\s+/);
  const memberParts = cleanMember.split(/\s+/);
  
  // Check if any author part matches any member part
  for (const authorPart of authorParts) {
    for (const memberPart of memberParts) {
      if (authorPart === memberPart) return true;
    }
  }
  
  return false;
}

export default function MemberPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [member, setMember] = useState<Member | null>(null);
  const [otherMembers, setOtherMembers] = useState<Member[]>([]);
  const [memberBlogs, setMemberBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [metadataParagraphs, setMetadataParagraphs] = useState<string[]>([]);
  const [lastTwoParagraphs, setLastTwoParagraphs] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchMemberData = async () => {
      setLoading(true);
      setLoadingBlogs(true);
      
      try {
        // Fetch current member
        const memberSnap = await getDoc(doc(db, "members", id));
        if (memberSnap.exists()) {
          const memberData = { id: memberSnap.id, ...(memberSnap.data() as Member) };
          setMember(memberData);
          
          // Process metadata for better paragraph display
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = memberData.metadata;
          const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);
          setMetadataParagraphs(paragraphs);
          
          // Extract last two paragraphs
          if (paragraphs.length >= 2) {
            const lastTwo = paragraphs.slice(-2);
            const lastTwoText = lastTwo.map(p => stripHtml(p)).join(' ');
            setLastTwoParagraphs(lastTwoText);
          }
          
          // Fetch ALL blogs from both collections to ensure we find all matches
          const blogsPromises = [
            // Try "blogs" collection (plural - from Add Blog page)
            getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(50))),
            // Try "blog" collection (singular - from original blog page)
            getDocs(query(collection(db, "blog"), orderBy("createdAt", "desc"), limit(50)))
          ];
          
          const [blogsSnapPlural, blogsSnapSingular] = await Promise.all(blogsPromises);
          
          const blogs: Blog[] = [];
          
          // Process blogs from "blogs" collection
          blogsSnapPlural.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if ANY part of member name appears in author field
            if (data.authorName && authorMatchesMember(data.authorName, memberData.name)) {
              blogs.push({
                id: docSnap.id,
                title: data.title,
                content: data.content,
                imageURL: data.imageUrl, // Note: field name difference
                author: data.authorName, // Using authorName field
                createdAt: data.createdAt ?? null,
                description: data.shortDescription || "",
              });
            }
          });
          
          // Process blogs from "blog" collection
          blogsSnapSingular.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if ANY part of member name appears in author field
            if (data.author && authorMatchesMember(data.author, memberData.name)) {
              blogs.push({
                id: docSnap.id,
                title: data.title,
                content: data.content,
                imageURL: data.imageURL,
                author: data.author,
                createdAt: data.createdAt ?? null,
                description: data.description || "",
              });
            }
          });
          
          // Remove duplicates by blog title (in case same blog exists in both collections)
          const uniqueBlogs = blogs.filter((blog, index, self) =>
            index === self.findIndex(b => b.title === blog.title)
          );
          
          // Sort by date (newest first)
          uniqueBlogs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt instanceof Date ? a.createdAt : 
                          typeof a.createdAt === 'string' ? a.createdAt : 
                          (a.createdAt as any)?.toDate?.() || new Date()).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt instanceof Date ? b.createdAt : 
                          typeof b.createdAt === 'string' ? b.createdAt : 
                          (b.createdAt as any)?.toDate?.() || new Date()).getTime() : 0;
            return dateB - dateA;
          });
          
          // Limit to 6 most recent
          setMemberBlogs(uniqueBlogs.slice(0, 6));
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

  const router = useRouter();

const handleBlogClick = (blogId: string) => {
  router.push(`/blog/${blogId}`);
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
        className="mb-10 text-[#6B4A2E] dark:text-[#D9A441] hover:text-[#B8860B] dark:hover:text-[#FFD700] font-medium flex items-center gap-2 transition-colors"
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
          <div className="mb-10 rounded-2xl overflow-hidden">
            <div className="relative w-full aspect-square md:aspect-video">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
          {member.name}
        </h1>

        {/* Author Title & Bio */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-[#6B4A2E]/20 dark:border-[#D9A441]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] flex items-center justify-center">
                <span className="font-medium text-white dark:text-black">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-[#6B4A2E] dark:text-[#D9A441]">Team Member</p>
                <p className="text-sm text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
                  {memberBlogs.length} article{memberBlogs.length !== 1 ? 's' : ''} published
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Content with Enhanced Readability */}
        <article>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="space-y-8">
              {metadataParagraphs.map((paragraph, index) => {
                const isLastTwo = index >= metadataParagraphs.length - 2;
                
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
      </div>

      {/* Blogs by this Member - DISPLAYED FIRST */}
      <div className="max-w-4xl mx-auto">
        {memberBlogs.length > 0 ? (
          <section className="mb-16">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
                Blogs by {member.name}
              </h2>
              <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
                Latest articles written by {member.name}
              </p>
            </div>

            <div className="grid gap-8">
              {memberBlogs.map((blog) => {
                const excerpt = blog.description 
                  ? blog.description.length > 120 
                    ? blog.description.substring(0, 117) + "..."
                    : blog.description
                  : getExcerpt(stripHtml(blog.content), 40);

                return (
                  <article
                    key={blog.id}
                    onClick={() => handleBlogClick(blog.id)}
                    className="group cursor-pointer bg-white dark:bg-[#2A231D] rounded-2xl overflow-hidden border border-[#6B4A2E]/20 dark:border-[#D9A441]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image section only shows when imageURL exists */}
                    {blog.imageURL && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.imageURL}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className={`p-6 ${!blog.imageURL ? 'pt-6' : ''}`}>
                      <h3 className="font-bold text-lg mb-3 text-[#6B4A2E] dark:text-[#D9A441] group-hover:text-[#B8860B] dark:group-hover:text-[#FFD700] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[#6B4A2E]/70 dark:text-[#D8C9B4]/70 text-sm mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#6B4A2E]/60 dark:text-[#D9A441]/60">
                            {formatProfessionalDate(blog.createdAt)}
                          </span>
                        </div>
                       <span
  onClick={(e) => {
    e.stopPropagation(); // Prevent parent article click
    handleBlogClick(blog.id);
  }}
  className="text-sm font-medium text-[#6B4A2E] dark:text-[#D9A441] group-hover:translate-x-1 transition-transform cursor-pointer"
>
  Read article →
</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : !loadingBlogs && (
          <div className="mb-16 text-center py-12 border-t border-[#6B4A2E]/20 dark:border-[#D9A441]/20">
            <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70 text-lg mb-6">
              No blog articles published by {member.name} yet.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              Explore All Blogs
            </Link>
          </div>
        )}

        {/* Other Members - DISPLAYED AFTER BLOGS */}
        {otherMembers.length > 0 && (
          <section className="mt-12 pt-12 border-t border-[#6B4A2E]/20 dark:border-[#D9A441]/20">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] bg-clip-text text-transparent">
                Meet Other Team Members
              </h2>
              <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70">
                Discover more talented individuals on our team
              </p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherMembers.map((m, index) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="group cursor-pointer bg-white dark:bg-[#2A231D] rounded-2xl overflow-hidden border border-[#6B4A2E]/20 dark:border-[#D9A441]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image section - only shows when imageUrl exists */}
                  {m.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className={`p-6 ${!m.imageUrl ? 'pt-6' : ''}`}>
                    <h3 className="font-bold text-lg mb-3 text-[#6B4A2E] dark:text-[#D9A441] group-hover:text-[#B8860B] dark:group-hover:text-[#FFD700] transition-colors line-clamp-2">
                      {m.name}
                    </h3>
                    <p className="text-[#6B4A2E]/70 dark:text-[#D8C9B4]/70 text-sm mb-4 line-clamp-3">
                      {m.description && m.description.length > 0
                        ? getExcerpt(m.description, 20)
                        : getExcerpt(stripHtml(m.metadata), 20)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6B4A2E]/60 dark:text-[#D9A441]/60">
                        Team Member
                      </span>
                      <Link
                        href={`/members/${m.id}`}
                        className="text-sm font-medium text-[#6B4A2E] dark:text-[#D9A441] group-hover:translate-x-1 transition-transform"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-[#6B4A2E]/20 dark:border-[#D9A441]/20 text-center">
        <p className="text-[#6B4A2E]/70 dark:text-[#D9A441]/70 mb-6 text-lg">
          Want to connect with our team?
        </p>
        <Link
          href="/members"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View All Team Members
        </Link>
      </div>
    </main>
  );
}