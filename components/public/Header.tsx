"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUsers,
  FaBars,
  FaHome,
  FaBookOpen,
  FaWater,
  FaPrayingHands,
  FaDonate,
} from "react-icons/fa";
import Sidebar from "./SideBar";


export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Handle navigation: show loading bar
  const handleNavigation = () => setLoading(true);

  // Stop loading after route changes
  useEffect(() => setLoading(false), [pathname]);

  const isActive = (href: string) => pathname === href;

  const publicNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/sabbath-school", label: "Sabbath School", icon: FaUsers },

    { href: "/about", label: "About Us", icon: FaUsers },
    { href: "/blog", label: "Blog", icon: FaWater },
    { href: "/contribution", label: "Donate", icon: FaDonate },
        { href: "/prayer", label: "Prayer Request", icon: FaPrayingHands }
  ];

  return (
    <>
      <nav className="bg-[#3B2414] dark:bg-[#F6F1EA] shadow-md sticky top-0 z-50 border-b border-[#6B4A2E] dark:border-[#D8C9B4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            
            {/* Logo + Text */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0"
              onClick={handleNavigation}
            >
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Title always aligned horizontally with logo */}
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#F6E3C4] dark:text-[#3B2414] leading-tight">
                  Gospel Sounders
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-[#D8C9B4] dark:text-[#6B4A2E] -mt-1">
                  Publications & Ministry
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
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
   {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center ml-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-[#D8C9B4] dark:bg-[#6B4A2E] hover:bg-[#F6E3C4] dark:hover:bg-[#3B2414] transition-colors duration-200"
                aria-label="Open menu"
              >
                <FaBars className="text-xl text-[#3B2414] dark:text-[#F6E3C4]" />
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

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          publicNavItems={publicNavItems}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
}
