"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import parse from "html-react-parser";
import { usePathname } from "next/navigation"; // App Router client hook

interface Member {
  name: string;
  imageUrl: string;
  metadata: string;
}

export default function MemberPage() {
  const pathname = usePathname(); // e.g. "/members/abc123"
  const id = pathname?.split("/").pop(); // get the last segment as ID

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        const ref = doc(db, "members", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setMember(snap.data() as Member);
        } else {
          setMember(null);
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setMember(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return <p className="text-center py-20 text-gray-600 dark:text-gray-300">Loading member…</p>;
  }

  if (!member) {
    return <p className="text-center py-20 text-gray-600 dark:text-gray-300">Member not found.</p>;
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Image */}
      <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden bg-[#F6F1EA] dark:bg-[#2A1A10]">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-6">
        {member.name}
      </h1>

      {/* Metadata / Rich Content */}
      <article className="prose dark:prose-invert max-w-none text-[#5A3A23] dark:text-[#D8C9B4]">
        {parse(member.metadata)}
      </article>
    </main>
  );
}
