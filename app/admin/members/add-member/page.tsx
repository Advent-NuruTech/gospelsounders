"use client";

import AddMember from "@/components/admin/AddMember";

export default function AddMemberPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Add New Member
      </h1>

      <AddMember />
    </main>
  );
}
