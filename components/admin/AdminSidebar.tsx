"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function AdminSidebar({ isOpen, onClose, navItems }: AdminSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#3B2414] dark:bg-[#F6F1EA] shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:flex lg:flex-col lg:w-64`}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-300 transition-colors z-10 lg:hidden"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-xl text-[#F6E3C4] dark:text-[#3B2414]" />
        </button>

        {/* Branding */}
        <div className="flex-shrink-0 p-6 border-b border-[#6B4A2E] dark:border-[#D8C9B4] text-center">
          <div className="relative w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden shadow-md">
            <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#F6E3C4] dark:text-[#3B2414] mb-1 leading-snug">
            Gospel Sounders
          </h3>
          <p className="text-xs sm:text-sm text-[#D8C9B4] dark:text-[#6B4A2E]">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? "bg-[#D8C9B4] text-[#3B2414] dark:bg-[#6B4A2E] dark:text-[#F6F1EA]"
                  : "text-[#F6E3C4] dark:text-[#3B2414] hover:bg-[#D8C9B4] dark:hover:bg-[#6B4A2E] hover:text-[#3B2414] dark:hover:text-[#F6F1EA]"
              }`}
            >
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-[#3B2414] dark:bg-[#F6F1EA] text-[#F6E3C4] dark:text-[#3B2414]"
                    : "bg-[#F6E3C4] dark:bg-[#3B2414] text-[#3B2414] dark:text-[#F6E3C4] group-hover:bg-[#D8C9B4] dark:group-hover:bg-[#6B4A2E]"
                }`}
              >
                <item.icon className="text-base" />
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
