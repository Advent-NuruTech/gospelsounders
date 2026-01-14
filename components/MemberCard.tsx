"use client";

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

interface MemberCardProps {
  member: Member;
}

// Strip HTML safely
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// 60–70 word professional preview (matches blog feel)
function getPreview(html: string, limit = 70) {
  const clean = stripHtml(html);
  const words = clean.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "…"
    : clean;
}

export default function MemberCard({ member }: MemberCardProps) {
  const previewText = getPreview(member.metadata);

  return (
    <div className="flex flex-col bg-white dark:bg-[#2A221C] rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden p-5 h-full">
      
      {/* Image - full width, height auto, no cropping */}
      <div className="w-full mb-4 rounded-xl overflow-hidden">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={800}           // define width
            height={600}          // default height (Next.js will auto-scale)
            className="w-full h-auto object-contain" // no cropping
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-[#F6F1EA] mb-2">
        {member.name}
      </h3>

      {/* Description */}
      <div className="text-gray-700 dark:text-[#D8C9B4] text-sm mb-4 line-clamp-4">
        {parse(previewText)}
      </div>

      {/* Read More CTA */}
      <Link
        href={`/members/${member.id}`}
        className="mt-auto inline-block w-full text-center bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:opacity-90 transition"
      >
        View Profile
      </Link>
    </div>
  );
}
