"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  link?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  link,
}) => {
  return (
    <div className="text-center mb-8 py-6 px-4 rounded-lg bg-yellow-400 dark:bg-[#D4AF37]">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-black">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 text-gray-800 dark:text-gray-900 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

      {/* Optional Link */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-gray-900 dark:text-black font-semibold hover:underline"
        >
          Visit Channel →
        </a>
      )}
    </div>
  );
};
