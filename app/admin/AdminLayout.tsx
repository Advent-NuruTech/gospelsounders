"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar, { NavItem } from "@/components/admin/AdminSidebar";
import { FaTachometerAlt, FaUsers, FaBookOpen, FaPrayingHands, FaDonate } from "react-icons/fa";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/members/add-member", label: "Add Member", icon: FaUsers },
    { href: "/members/edit-member", label: "Edit Members", icon: FaUsers },
    { href: "/admin/sabbath-school/add-lesson", label: "Add Lesson", icon: FaBookOpen },
       { href: "/admin/blog/add-blog", label: "Add Blog", icon: FaBookOpen },
    { href: "/admin/sabbath-school/edit-lesson", label: "Edit Lessons", icon: FaBookOpen },
    { href: "/admin/received-prayer", label: "Prayer Requests", icon: FaPrayingHands },
    { href: "/admin/contributions", label: "Contributions", icon: FaDonate },
  ];

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={adminNavItems}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar at top of main area */}
        <div className="w-full">
          <AdminNavbar toggleSidebar={toggleSidebar} navItems={adminNavItems} />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
