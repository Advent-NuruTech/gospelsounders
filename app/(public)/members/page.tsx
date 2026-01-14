"use client";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import MemberCard from "@/components/MemberCard";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string; // full HTML from RichTextEditor
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const membersRef = collection(db, "members");
        const q = query(membersRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          metadata: doc.data().metadata,
        })) as Member[];
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-4">
          Meet Our Team
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Dedicated to Gospel Work
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B2414] dark:border-[#F6F1EA]"></div>
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            No members registered yet.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check back soon to meet our team!
          </p>
        </div>
      )}
    </main>
  );
}