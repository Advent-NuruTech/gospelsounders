"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ================= IMPORT COMPONENTS ================= */
import Hero from "@/components/public/HeroBanner";

import BlogList from "@/components/public/BlogList";
import LibraryList from "@/components/public/LibraryList";
import { SectionTitle } from "@/components/public/SectionTitle";
import YoutubeCarousel from "@/components/public/YoutubeCarousel";

// First, let's define the proper SectionTitleProps interface
// Based on your usage, it should include align and variant
// If SectionTitle component doesn't accept these, we need to update it
// For now, let's use the props that the component actually accepts

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#1F1A16] text-gray-900 dark:text-[#F6F1EA] transition-colors duration-300">

      {/* ================= HERO ================= */}
      <Hero />




 {/* ================= YOUTUBE ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#2A221C] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Latest Video Messages"
            subtitle="Watch sermons, teachings, and ministry highlights"
          />

          {/* YouTube Carousel */}
          <motion.div 
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <YoutubeCarousel />
          </motion.div>

          <motion.div 
            className="text-center mt-10 sm:mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://youtube.com/@gospelsounders"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block 
                bg-gradient-to-r from-[#C9A24D] to-[#B8943F]
                text-white dark:text-[#3B2414]
                px-6 sm:px-8 py-3 sm:py-4
                rounded-lg font-semibold
                hover:shadow-xl hover:scale-105
                active:scale-95
                transition-all duration-300
                text-base sm:text-lg
              "
            >
              View All Videos →
            </a>
          </motion.div>
        </div>
      </section>




      {/* ================= BLOG ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#2A221C] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Ministry Blog & Updates"
            subtitle="Inspired articles, announcements, and spiritual reflections"
          />

          {/* Desktop: 2 columns, 1 row with proper card sizing */}
          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <BlogList maxBlogs={2} />
            </div>
          </div>

          <motion.div 
            className="text-center mt-10 sm:mt-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="
                inline-block 
                border-2 border-[#C9A24D]
                text-gray-900 dark:text-[#F6F1EA]
                px-6 sm:px-8 py-3 sm:py-4
                rounded-lg font-semibold
                hover:bg-[#C9A24D]
                hover:text-white dark:hover:text-[#3B2414]
                hover:shadow-xl hover:scale-105
                active:scale-95
                transition-all duration-300
                text-base sm:text-lg
              "
            >
              View All Blog Posts →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= LIBRARY ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionTitle
          title="Bible Study Library"
          subtitle="Carefully prepared study notes, references, and downloads"
        />

        {/* Enhanced card grid with consistent sizing */}
        <div className="mt-8 sm:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <LibraryList maxDocs={2} />
          </div>
        </div>

        <motion.div 
          className="text-center mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/library"
            className="
              inline-block 
              bg-gradient-to-r from-[#3B2414] to-[#2A170D]
              text-white
              px-6 sm:px-8 py-3 sm:py-4
              rounded-lg font-semibold
              hover:shadow-xl hover:scale-105
              active:scale-95
              transition-all duration-300
              text-base sm:text-lg
            "
          >
            View Full Library →
          </Link>
        </motion.div>
      </section>

     

      
    </main>
  );
}