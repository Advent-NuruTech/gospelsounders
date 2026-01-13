"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaDonate,
  FaPrayingHands,
} from "react-icons/fa";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/admin/members/add-member", label: "Add Member", icon: FaUsers },
  { href: "/admin/members/edit-member", label: "Edit Members", icon: FaUsers },

  { href: "/admin/sabbath-school/add-lesson", label: "Add Lesson", icon: FaBookOpen },
  { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },

  { href: "/admin/blog/post", label: "Post Blog", icon: FaBookOpen },
  { href: "/admin/blog/blog-delete", label: "Edit / Delete Blog", icon: FaBookOpen },

  { href: "/admin/bible-studies", label: "Upload Study Notes", icon: FaBookOpen },
  { href: "/admin/upload-video", label: "Upload Video", icon: FaBookOpen },

  { href: "/admin/received-prayer", label: "Prayer Requests", icon: FaPrayingHands },
  { href: "#", label: "Contributions", icon: FaDonate },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
      />

      {/* MAIN AREA */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        {/* TOP BAR (Mobile only) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 
          bg-white dark:bg-gray-900 
          border-b border-gray-200 dark:border-gray-800"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-gray-700 dark:text-gray-200"
          >
            ☰
          </button>

          <h1 className="font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 text-gray-800 dark:text-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
}
