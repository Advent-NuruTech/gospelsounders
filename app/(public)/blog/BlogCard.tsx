"use client";

import { useState } from "react";

type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any; // Firestore Timestamp / Date / string
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getWordCount(html: string) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function getPreview(html: string, limit = 60) {
  const words = stripHtml(html).split(/\s+/);
  if (words.length <= limit) return words.join(" ");
  return words.slice(0, limit).join(" ") + "…";
}

function formatDate(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const [expanded, setExpanded] = useState(false);

  const wordCount = getWordCount(blog.content);
  const needsReadMore = wordCount > 60;

  return (
    <article className="mb-10 border-b pb-6">
      {/* TITLE */}
      <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
        {blog.title}
      </h2>

      {/* AUTHOR */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        By <span className="font-medium">{blog.author}</span>
      </p>

      {/* IMAGE LOGIC — UNTOUCHED */}
      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="w-full h-auto object-contain rounded-lg mb-4"
          loading="lazy"
        />
      )}

      {/* CONTENT */}
      <div className="prose max-w-none dark:prose-invert">
        {expanded || !needsReadMore ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        ) : (
          <p>{getPreview(blog.content)}</p>
        )}
      </div>

      {needsReadMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* DATE — AT THE BOTTOM */}
      {blog.createdAt && (
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Published on {formatDate(blog.createdAt)}
        </p>
      )}
    </article>
  );
}
