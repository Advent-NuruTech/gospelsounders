"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-full min-h-[260px] focus:outline-none dark:prose-invert",
      },
    },
    immediatelyRender: false,
  });

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !editor?.getHTML().trim()) {
      alert("Title, author, and content are required");
      return;
    }

    setLoading(true);

    let imageURL: string | undefined = undefined;

    // Upload featured image to Cloudinary (URL only saved)
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload-blog-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageURL = data.url; // ✅ BlogCard expects imageURL
    }

    await addDoc(collection(db, "blog"), {
      title,
      author,
      content: editor.getHTML(), // rich HTML
      imageURL: imageURL ?? null,
      createdAt: serverTimestamp(),
    });

    // Reset form
    setTitle("");
    setAuthor("");
    setImageFile(null);
    editor.commands.clearContent();
    setLoading(false);

    alert("Blog published successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
        className="w-full mb-4 p-3 border rounded dark:bg-gray-800"
      />

      {/* Author */}
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author name"
        className="w-full mb-4 p-3 border rounded dark:bg-gray-800"
      />

      {/* Editor */}
      <div className="border rounded p-3 mb-4 dark:border-gray-600">
        <EditorContent editor={editor} />
      </div>

      {/* Featured Image (optional) */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      {imageFile && (
        <p className="text-sm text-gray-500 mt-2">{imageFile.name}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
}
