"use client";

import AddMember from "@/components/AddMember";

export default function AddMemberPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#3B2414] dark:text-[#F6F1EA] mb-6">
        Add New Member
      </h1>

      <AddMember />
    </main>
  );
}
