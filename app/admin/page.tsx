"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/components/admin/useAdminAuth";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen p-8 bg-[#0D3B66] text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#F4D35E]">Gospel Sounders Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-[#F4D35E] text-[#0D3B66] font-semibold px-4 py-2 rounded hover:opacity-90 transition"
        >
          Logout
        </button>
      </header>

      <main className="space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded shadow text-black">
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p>Manage members, lessons, blogs, and contributions here.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#F4D35E] p-6 rounded shadow font-bold text-[#0D3B66] text-center cursor-pointer hover:opacity-90 transition">
            Members
          </div>
          <div className="bg-[#F4D35E] p-6 rounded shadow font-bold text-[#0D3B66] text-center cursor-pointer hover:opacity-90 transition">
            Lessons
          </div>
          <div className="bg-[#F4D35E] p-6 rounded shadow font-bold text-[#0D3B66] text-center cursor-pointer hover:opacity-90 transition">
            Blogs
          </div>
          <div className="bg-[#F4D35E] p-6 rounded shadow font-bold text-[#0D3B66] text-center cursor-pointer hover:opacity-90 transition">
            Contributions
          </div>
        </section>
      </main>
    </div>
  );
}
