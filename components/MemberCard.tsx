"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string; // full HTML from RichTextEditor
}

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Limit description to first 70 words for collapsed view
  const getShortDescription = (html: string) => {
    const text = html.replace(/<[^>]+>/g, " "); // strip HTML tags
    const words = text.split(/\s+/);
    if (words.length <= 70) return html; // short enough, no truncation
    return words.slice(0, 70).join(" ") + "...";
  };

  const descriptionToShow = isExpanded
    ? member.metadata
    : getShortDescription(member.metadata);

  return (
    <div className="relative group bg-[#F6F1EA]/10 dark:bg-[#2A1A10]/30 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-200 border border-white/10 p-4">
      {/* Member Image */}
      <div className="relative w-full h-64 mb-3 rounded-xl overflow-hidden">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-contain rounded-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Member Name */}
      <h3 className="text-[#3B2414] dark:text-[#F6F1EA] font-semibold text-xl mb-2">
        {member.name}
      </h3>

      {/* Description */}
      <div className="text-[#5A3A23] dark:text-[#D8C9B4] text-sm prose dark:prose-invert max-w-none">
        {parse(descriptionToShow)}

        {/* Show Read More button only if content is long */}
        {member.metadata.replace(/<[^>]+>/g, " ").split(/\s+/).length > 70 && (
          <Link
            href={`/members/${member.id}`}
            className="ml-1 text-[#C9A24D] dark:text-[#B8943F] font-semibold underline"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Link>
        )}
      </div>
    </div>
  );
}
