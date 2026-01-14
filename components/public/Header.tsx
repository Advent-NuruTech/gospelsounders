"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaUsers,
  FaBars,
  FaHome,
  FaBookOpen,
  FaWater,
  FaPrayingHands,
  FaDonate,
  FaChevronDown,
} from "react-icons/fa";
import Sidebar from "./SideBar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const pathname = usePathname();
  const aboutRef = useRef<HTMLDivElement>(null);

  const handleNavigation = () => setLoading(true);
  useEffect(() => setLoading(false), [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => pathname === href;

  const publicNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/sabbath-school", label: "Sabbath School", icon: FaUsers },
    { href: "/library", label: "Library", icon: FaBookOpen },
    { href: "/blog", label: "Blog", icon: FaWater },
    { href: "#", label: "Donate", icon: FaDonate },
    { href: "/prayer", label: "Prayer Request", icon: FaPrayingHands },
  ];

  return (
    <>
      <nav className="bg-[#3B2414] dark:bg-[#F6F1EA] shadow-md sticky top-0 z-50 border-b border-[#6B4A2E] dark:border-[#D8C9B4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 lg:h-24">
            
            {/* Logo */}
            <Link href="/" onClick={handleNavigation} className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#F6E3C4] dark:text-[#3B2414]">
                  Gospel Sounders
                </h1>
                <p className="text-xs sm:text-sm text-[#D8C9B4] dark:text-[#6B4A2E] -mt-1">
                  Publications & Missions
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">

              {/* About Us Dropdown */}
              <div ref={aboutRef} className="relative">
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    pathname.startsWith("/about") || pathname.startsWith("/members")
                      ? "bg-[#D8C9B4] text-[#3B2414] dark:bg-[#6B4A2E] dark:text-[#F6F1EA]"
                      : "text-[#F6E3C4] hover:bg-[#D8C9B4] hover:text-[#3B2414] dark:text-[#3B2414] dark:hover:bg-[#6B4A2E] dark:hover:text-[#F6F1EA]"
                  }`}
                >
                  <FaUsers />
                  <span>About Us</span>
                  <FaChevronDown className="text-xs" />
                </button>

                {aboutOpen && (
                  <div className="absolute top-full mt-2 min-w-[180px] rounded-lg shadow-lg overflow-hidden bg-[#3B2414] dark:bg-[#F6F1EA] border border-[#6B4A2E] dark:border-[#D8C9B4]">
                    <Link
                      href="/about"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm text-[#F6E3C4] dark:text-[#3B2414] hover:bg-[#D8C9B4] hover:text-[#3B2414]"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/members"
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2 text-sm text-[#F6E3C4] dark:text-[#3B2414] hover:bg-[#D8C9B4] hover:text-[#3B2414]"
                    >
                      Our Team
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Nav Items */}
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
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-[#D8C9B4] dark:bg-[#6B4A2E]"
              >
                <FaBars className="text-xl text-[#3B2414] dark:text-[#F6E3C4]" />
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F6E3C4] via-[#D8C9B4] to-[#F6E3C4] animate-pulse" />
        )}
      </nav>

      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          publicNavItems={[
            { href: "/about", label: "About Us", icon: FaUsers },
            { href: "/members", label: "Our Team", icon: FaUsers },
            ...publicNavItems,
          ]}
        />
      )}
    </>
  );
}
