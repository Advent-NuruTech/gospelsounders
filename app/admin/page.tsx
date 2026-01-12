"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/components/admin/useAdminAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    members: 0,
    prayerRequests: 0,
    blog: 0,
    contributions: 0,
  });

  const handleLogout = async () => {
    await adminLogout();
    router.replace("/admin/login");
  };

  // Fetch counts from Firestore
  useEffect(() => {
    async function fetchStats() {
      const membersSnap = await getDocs(collection(db, "members"));
      const prayersSnap = await getDocs(collection(db, "prayerRequests"));
      const blogsSnap = await getDocs(collection(db, "blog"));
      const contributionsSnap = await getDocs(collection(db, "contributions"));

      setStats({
        members: membersSnap.size,
        prayerRequests: prayersSnap.size,
        blog: blogsSnap.size,
        contributions: contributionsSnap.size,
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D3B66] text-white flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#F4D35E]/50">
        <h1 className="text-3xl font-extrabold text-[#F4D35E]">
          Gospel Sounders Admin
        </h1>
        <button
          onClick={handleLogout}
          className="bg-[#F4D35E] text-[#0D3B66] font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          Logout
        </button>
      </header>

      {/* ===== MAIN DASHBOARD CONTENT ===== */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Card */}
        <section className="bg-white dark:bg-[#1F1A16] text-black dark:text-[#F6F1EA] rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p className="opacity-80">
            Manage members, prayer requests, lessons, blogs, and contributions here.
          </p>
        </section>

        {/* ===== STATS GRID ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Members */}
          <div className="bg-[#F4D35E] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer">
            <span className="text-4xl font-extrabold text-[#0D3B66]">{stats.members}</span>
            <p className="mt-2 text-lg font-semibold text-[#0D3B66]">Members</p>
          </div>

          {/* Prayer Requests */}
          <div className="bg-[#F4D35E] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer">
            <span className="text-4xl font-extrabold text-[#0D3B66]">{stats.prayerRequests}</span>
            <p className="mt-2 text-lg font-semibold text-[#0D3B66]">Prayer Requests</p>
          </div>

          {/* Blogs */}
          <div className="bg-[#F4D35E] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer">
            <span className="text-4xl font-extrabold text-[#0D3B66]">{stats.blog}</span>
            <p className="mt-2 text-lg font-semibold text-[#0D3B66]">Blog Posts</p>
          </div>

          {/* Contributions */}
          <div className="bg-[#F4D35E] rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer">
            <span className="text-4xl font-extrabold text-[#0D3B66]"></span>
            <p className="mt-2 text-lg font-semibold text-[#0D3B66]"></p>
          </div>
        </section>
      </main>
    </div>
  );
}
