"use client";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Head from "next/head";
import MemberCard from "@/components/MemberCard";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "members"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          metadata: doc.data().metadata,
        })) as Member[];
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <>
      {/* SEO / Attention Magnet */}
      <Head>
        <title>Our Team | Gospel Sounders</title>
        <meta
          name="description"
          content="Meet the dedicated team behind Gospel Sounders — servants committed to revealing the Father and the Son, proclaiming the everlasting gospel, and preparing a people for Christ’s soon return."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12 bg-gray-50 dark:bg-[#1F1A16]">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6B4A2E] via-[#D9A441] to-[#B8860B] mb-4">
            Meet Our Team
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-700 dark:text-[#D8C9B4]">
            Faithful workers united in purpose — revealing the Father and the Son
            through truth-filled ministry, literature, and service.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4A2E] dark:border-[#D9A441]" />
          </div>
        ) : members.length > 0 ? (
          /* Members Grid */
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition"
              >
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <p className="text-lg text-gray-700 dark:text-[#D8C9B4] mb-2">
              No team members published yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please check back soon.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
