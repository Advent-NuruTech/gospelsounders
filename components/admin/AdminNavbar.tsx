"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaTachometerAlt, FaUsers, FaBookOpen, FaPrayingHands, FaDonate } from "react-icons/fa";
import AdminSidebar, { NavItem } from "./AdminSidebar";

interface AdminNavbarProps {
  toggleSidebar: () => void;
  navItems: NavItem[];
}

export default function AdminNavbar({ toggleSidebar, navItems }: AdminNavbarProps) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => setLoading(false), [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="bg-[#3B2414] dark:bg-[#F6F1EA] shadow-md sticky top-0 z-50 border-b border-[#6B4A2E] dark:border-[#D8C9B4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Logo + Admin Title */}
            <Link href="/admin" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#F6E3C4] dark:text-[#3B2414] leading-tight">
                  Gospel Sounders
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#D8C9B4] dark:text-[#6B4A2E] -mt-1">
                  Admin Panel
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-[#D8C9B4] text-[#3B2414] dark:bg-[#6B4A2E] dark:text-[#F6F1EA]"
                      : "text-[#F6E3C4] hover:bg-[#D8C9B4] hover:text-[#3B2414] dark:text-[#3B2414] dark:hover:bg-[#6B4A2E] dark:hover:text-[#F6F1EA]"
                  }`}
                >
                  <item.icon className="text-base" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center ml-auto">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-[#D8C9B4] dark:bg-[#6B4A2E] hover:bg-[#F6E3C4] dark:hover:bg-[#3B2414] transition-colors duration-200"
                aria-label="Open menu"
              >
                <FaBars className="text-xl text-[#3B2414] dark:text-[#F6F1EA]" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F6E3C4] via-[#D8C9B4] to-[#F6E3C4] animate-pulse">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        )}
      </nav>
    </>
  );
}
