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
  { href: "/admin/blog/post", label: "Post Blog", icon: FaBookOpen }, 
   { href: "/admin/blog/blog-delete", label: "Edit or Delete Blog", icon: FaBookOpen },
   { href: "/admin/bible-studies", label: "Upload study notes ", icon: FaBookOpen },
      { href: "/admin/upload-video", label: "Upload Video", icon: FaBookOpen },
  { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },
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
    <div className="flex min-h-screen">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
      />

      <div className="flex-1 ml-0 md:ml-64">
        {/* Top bar */}
        <header className="md:hidden p-4 border-b flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="font-bold">Admin</h1>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
