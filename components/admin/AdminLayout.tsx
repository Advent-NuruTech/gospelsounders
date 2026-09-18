"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { ADMIN_ROUTES } from "@/lib/adminRoutes";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaBookOpen,
  FaDonate,
  FaPrayingHands,
} from "react-icons/fa";

const navItems = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: FaTachometerAlt },
  { href: ADMIN_ROUTES.membersAdd, label: "Add Member", icon: FaUsers },
  { href: ADMIN_ROUTES.membersEdit, label: "Edit Members", icon: FaUsers },

  { href: ADMIN_ROUTES.sabbathSchoolAdd, label: "Add Lesson", icon: FaBookOpen },
  { href: ADMIN_ROUTES.sabbathSchoolEdit, label: "Edit Lessons", icon: FaBookOpen },

  { href: ADMIN_ROUTES.blogPost, label: "Post Blog", icon: FaBookOpen },
  { href: ADMIN_ROUTES.blogDelete, label: "Edit / Delete Blog", icon: FaBookOpen },

  { href: ADMIN_ROUTES.bibleStudies, label: "Upload Study Notes", icon: FaBookOpen },
  { href: ADMIN_ROUTES.uploadVideo, label: "Upload Video", icon: FaBookOpen },

  { href: ADMIN_ROUTES.receivedPrayer, label: "Prayer Requests", icon: FaPrayingHands },
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
      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOP BAR (Mobile only) */}
        <header
          className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:hidden"
        >
          <button
            aria-label="Open admin navigation"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-xl text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <FaBars aria-hidden="true" />
          </button>

          <h1 className="font-semibold text-gray-800 dark:text-gray-200">
            Admin Panel
          </h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden text-gray-800 dark:text-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
}
