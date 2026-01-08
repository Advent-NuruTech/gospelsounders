"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const navItems = [
    { href: "/", label: "Home"},
    { href: "/updates", label: "Updates" },
    { href: "/contact", label: "Contact"},
    { href: "/faq", label: "FAQ" },
    { href: "/booking", label: "Booking" },
    { href: "/policy", label: "Policies" },
  ];

  // Don't return null during SSR - render a skeleton instead
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div>
                <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-32 h-4 mt-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            {/* Menu button skeleton */}
            <div className="lg:hidden w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#F6F1EA]/95 dark:bg-[#2A1A10]/95 backdrop-blur border-b border-[#E7D9C4] dark:border-[#3B2414]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11">
              <Image
                src="/images/logo.jpg"
                alt="Gospel Sounders Logo"
                fill
                className="rounded-xl object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#3B2414] dark:text-[#F6F1EA]">
                Gospel Sounders
              </h1>
              <p className="text-xs text-[#6B4A2E] dark:text-[#D8C9B4] -mt-1">
                Publications & Ministry
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  activeLink === item.href
                    ? "bg-[#3B2414] text-[#F6F1EA] dark:bg-[#5A3A23]"
                    : "text-[#5A3A23] dark:text-[#E7D9C4] hover:bg-[#EFE6DA] dark:hover:bg-[#3B2414]"
                }`}
              >
                <span className="flex items-center gap-2">
               
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Donate */}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2 bg-[#C9A24D] text-[#3B2414] dark:text-[#2A1A10] font-bold rounded-lg hover:bg-[#B8943F] transition"
            >
              Donate
            </Link>
          </nav>

          {/* Mobile Button */}
          <button
            className="lg:hidden w-11 h-11 rounded-xl bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#E7D9C4] dark:border-[#5A3A23] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#F6F1EA] dark:bg-[#2A1A10] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 60 }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 rounded-xl bg-[#F6F1EA] dark:bg-[#3B2414] border border-[#E7D9C4] dark:border-[#5A3A23] flex items-center justify-center text-xl hover:bg-[#EFE6DA] dark:hover:bg-[#5A3A23] transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-6 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setIsMenuOpen(false);
                setActiveLink(item.href);
              }}
              className={`px-6 py-4 rounded-xl font-semibold text-lg transition-colors ${
                activeLink === item.href
                  ? "bg-[#3B2414] text-[#F6F1EA] dark:bg-[#5A3A23]"
                  : "text-[#5A3A23] dark:text-[#E7D9C4] hover:bg-[#EFE6DA] dark:hover:bg-[#3B2414]"
              }`}
            >
              <span className="flex items-center gap-3">
              
                {item.label}
              </span>
            </Link>
          ))}

          {/* Donate Button */}
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-6 px-6 py-4 bg-[#C9A24D] text-[#3B2414] font-bold rounded-xl text-center text-lg hover:bg-[#B8943F] transition-colors"
          >
            Donate
          </Link>
        </nav>
      </div>

      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
          style={{ zIndex: 50 }}
        />
      )}
    </header>
  );
}