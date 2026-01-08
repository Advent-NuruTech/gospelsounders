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

  useEffect(() => {
    const fetchMembers = async () => {
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
      }
    };

    fetchMembers();
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-6">
        Registered Members
      </h2>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center py-20">
          No members registered yet.
        </p>
      )}
    </main>
  );
}
