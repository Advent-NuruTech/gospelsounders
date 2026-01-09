"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";

type Blog = {
  id: string;
  title: string;
  author: string;
  content: string;
  imageURL?: string;
  createdAt?: { seconds: number };
};

export default function BlogManagerPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-full min-h-[200px] focus:outline-none dark:prose-invert",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const snap = await getDocs(collection(db, "blog"));
    const data: Blog[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Blog, "id">),
    }));
    setBlogs(data);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setAuthor(blog.author);
    setImageFile(null);
    editor?.commands.setContent(blog.content);
  };

  const handleUpdate = async () => {
    if (!editingBlog) return;

    const content = editor?.getHTML() ?? "";
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("Title, author and content are required");
      return;
    }

    let imageURL = editingBlog.imageURL || "";

    // IMAGE LOGIC — UNTOUCHED
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/upload-blog-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageURL = data.url;
    }

    await updateDoc(doc(db, "blog", editingBlog.id), {
      title,
      author,
      content,
      imageURL,
      updatedAt: serverTimestamp(),
    });

    setEditingBlog(null);
    setTitle("");
    setAuthor("");
    setImageFile(null);
    editor?.commands.clearContent();
    loadBlogs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog permanently?")) return;
    await deleteDoc(doc(db, "blog", id));
    loadBlogs();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* EDIT SECTION */}
      {editingBlog && (
        <div className="mb-10 p-5 border rounded bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">
            Editing: {editingBlog.title}
          </h2>

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
            className="w-full p-2 mb-3 border rounded dark:bg-gray-700"
          />

          {/* Author */}
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            className="w-full p-2 mb-3 border rounded dark:bg-gray-700"
          />

          {/* Editor */}
          <EditorContent
            editor={editor}
            className="border rounded p-3 min-h-[200px] mb-3 dark:border-gray-600"
          />

          {/* Image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mb-3"
          />

          {editingBlog.imageURL && !imageFile && (
            <img
              src={editingBlog.imageURL}
              alt={editingBlog.title}
              className="mb-3 w-full object-contain rounded"
            />
          )}

          {imageFile && (
            <p className="text-sm text-gray-500 mb-3">{imageFile.name}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingBlog(null);
                editor?.commands.clearContent();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BLOG LIST */}
      <h1 className="text-2xl font-bold mb-6">Existing Blogs</h1>

      {blogs.map((b) => (
        <div
          key={b.id}
          className="border rounded p-4 mb-6 bg-white dark:bg-gray-900"
        >
          <h2 className="font-bold text-lg">{b.title}</h2>

          <p className="text-sm text-gray-500 mb-2">
            By <strong>{b.author}</strong>
            {b.createdAt && (
              <> • {new Date(b.createdAt.seconds * 1000).toLocaleDateString()}</>
            )}
          </p>

          {/* IMAGE LOGIC — UNTOUCHED */}
          {b.imageURL && (
            <img
              src={b.imageURL}
              alt={b.title}
              className="mt-2 w-full object-contain rounded"
            />
          )}

          <div
            className="prose mt-3 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: b.content }}
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleEdit(b)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(b.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
