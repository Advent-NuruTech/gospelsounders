"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ================= TYPING HOOK (SMOOTH LOOP) ================= */
function useTyping(text: string, speed = 100, repeatDelay = 2000) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout;

    const start = () => {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, index + 1));
        index++;

        if (index === text.length) {
          clearInterval(interval);
          setTimeout(() => {
            index = 0;
            setDisplayed("");
            start();
          }, repeatDelay);
        }
      }, speed);
    };

    start();
    return () => clearInterval(interval);
  }, [text, speed, repeatDelay]);

  return displayed;
}

/* ================= HERO BANNER (PRO STYLE) ================= */
export default function HeroBanner() {
  const typingText = useTyping("Revealing the Father and the Son", 100, 2000);

  return (
    <motion.section
      className="relative w-screen h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* ===== Background Video ===== */}
      <video
        src="/hero/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Gradient Overlay ===== */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-black/70 via-black/50 to-black/70
          md:bg-gradient-to-r
          md:from-black/80 md:via-black/60 md:to-transparent
        "
      />

      {/* ===== Floating Particles ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A24D] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

     {/* ===== Centered Content with Responsive Layout ===== */}
        <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Text Content */}
            <div className="text-left lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1
                  className="
                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold 
                    text-[#F6F1EA]
                    mb-4 lg:mb-6
                    leading-tight
                  "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Gospel{" "}
                  <span className="
                    bg-gradient-to-r 
                    from-[#C9A24D] via-[#E7D9C4] to-[#C9A24D]
                    bg-clip-text text-transparent
                    animate-gradient-x
                  ">
                    Sounders
                  </span>
                </motion.h1>

                <motion.h2
                  className="
                    text-xl sm:text-2xl md:text-3xl 
                    text-[#E7D9C4]
                    mb-4 lg:mb-8
                    font-medium
                  "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Publications & Missions
                </motion.h2>

                <motion.div
                  className="
                    text-lg sm:text-xl md:text-2xl 
                    text-[#E7D9C4]
                    mb-8 lg:mb-12 min-h-[1.6em]
                    font-light
                  "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <span className="inline-block">
                    {typingText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      |
                    </motion.span>
                  </span>
                </motion.div>

                {/* ===== Enhanced CTA Buttons ===== */}
                <motion.div 
                  className="flex flex-wrap gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <Link
                    href="/sabbath-school"
                    className="
                      group relative overflow-hidden
                      bg-gradient-to-r from-[#C9A24D] to-[#B8943F]
                      text-[#3B2414]
                      px-6 sm:px-8 py-3 sm:py-4
                      rounded-lg font-semibold
                      transition-all duration-300
                      hover:shadow-xl hover:scale-105
                      active:scale-95
                      text-base sm:text-lg
                      flex-1 sm:flex-none text-center
                      min-w-[140px]
                    "
                  >
                    <span className="relative z-10">Sabbath School</span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>

                  <Link
                    href="/library"
                    className="
                      group relative overflow-hidden
                      border-2 border-[#C9A24D]
                      text-[#F6F1EA]
                      px-6 sm:px-8 py-3 sm:py-4
                      rounded-lg font-semibold
                      transition-all duration-300
                      hover:bg-[#C9A24D] hover:text-[#3B2414]
                      hover:shadow-xl hover:scale-105
                      active:scale-95
                      text-base sm:text-lg
                      flex-1 sm:flex-none text-center
                      min-w-[140px]
                    "
                  >
                    <span className="relative z-10">Bible Studies</span>
                  </Link>

                  <Link
                    href="/blog"
                    className="
                      group relative overflow-hidden
                      border-2 border-[#E7D9C4]
                      text-[#E7D9C4]
                      px-6 sm:px-8 py-3 sm:py-4
                      rounded-lg font-semibold
                      transition-all duration-300
                      hover:bg-[#E7D9C4] hover:text-[#3B2414]
                      hover:shadow-xl hover:scale-105
                      active:scale-95
                      text-base sm:text-lg
                      flex-1 sm:flex-none text-center
                      min-w-[140px]
                    "
                  >
                    <span className="relative z-10">Blog</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Decorative Element for Desktop */}
            <motion.div 
              className="hidden lg:block order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="relative w-full h-64 lg:h-96">
                <div className="
                  absolute inset-0 
                  border-2 border-[#C9A24D]/30 
                  rounded-full
                  animate-pulse
                " />
                <div className="
                  absolute inset-8 
                  border border-[#E7D9C4]/20 
                  rounded-full
                  animate-spin-slow
                " />
              </div>
            </motion.div>
          </motion.div>
        </div>

      {/* ===== Scroll Indicator ===== */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[#C9A24D] rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-[#C9A24D] rounded-full" />
        </div>
      </motion.div>
    </motion.section>
  );
}
