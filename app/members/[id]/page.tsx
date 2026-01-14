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

// Helpers for short preview
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function getPreview(html: string, words = 18) {
  const clean = stripHtml(html);
  const parts = clean.split(" ");
  return parts.length > words ? parts.slice(0, words).join(" ") + "…" : clean;
}

export default function MemberPage() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();

  const [member, setMember] = useState<Member | null>(null);
  const [otherMembers, setOtherMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      setLoading(true);
      try {
        // Fetch current member
        const snap = await getDoc(doc(db, "members", id));
        if (snap.exists()) setMember({ id: snap.id, ...(snap.data() as Member) });
        else setMember(null);

        // Fetch other members (max 6)
        const snapOther = await getDocs(query(collection(db, "members"), orderBy("createdAt", "asc"), limit(6)));
        const list = snapOther.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Member, "id">) }))
          .filter((m) => m.id !== id);
        setOtherMembers(list);
      } catch (err) {
        console.error("Error fetching member:", err);
        setMember(null);
        setOtherMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-32 text-gray-600 dark:text-gray-300">
      Loading member…
    </div>
  );
  if (!member) return (
    <div className="flex justify-center items-center py-32 text-gray-600 dark:text-gray-300">
      Member not found.
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#1F1A16]">
      
      {/* Current Member */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden bg-[#F6F1EA] dark:bg-[#2A1A10] shadow-lg">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
              No Image
            </div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] mb-6">
          {member.name}
        </h1>

        <article className="prose dark:prose-invert max-w-none text-[#5A3A23] dark:text-[#D8C9B4]">
          {parse(member.metadata)}
        </article>
      </div>

      {/* Other Members */}
      {otherMembers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B]">
            Other Team Members
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMembers.map((m, index) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition p-5"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                  {m.imageUrl ? (
                    <Image src={m.imageUrl} alt={m.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-[#F6F1EA] mb-1">
                  {m.name}
                </h3>

                <p className="text-sm text-gray-700 dark:text-[#D8C9B4] mb-4 line-clamp-3">
                  {getPreview(m.metadata)}
                </p>

                <Link
                  href={`/members/${m.id}`}
                  className="mt-auto inline-block w-full text-center bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
                >
                  View Profile
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
