"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RichTextEditor from "@/components/RichTextEditor";

export default function AddBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [authorName, setAuthorName] = useState(""); // manual author input
  const [content, setContent] = useState(""); // HTML from RichTextEditor
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !shortDescription.trim() || !content.trim() || !authorName.trim()) {
      return alert("All fields are required, including author name");
    }

    setLoading(true);

    try {
      // Upload featured image if any
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `blog-images/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add blog to Firestore
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        authorName: authorName.trim(),
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Blog posted successfully!");
      router.push("/admin/blog"); // redirect to blog list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Blog</h1>

      {/* Blog Title */}
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
      />

      {/* Short Description */}
      <input
        type="text"
        placeholder="Short Description"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
      />

      {/* Author Name */}
      <input
        type="text"
        placeholder="Author Name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
      />

      {/* Featured Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="mb-4"
      />

      {/* Rich Text Editor */}
      <div className="mb-4 border border-gray-300 rounded-lg p-2">
        <RichTextEditor
          value={content}
          onChange={setContent}
        />
      </div>

      {/* Date */}
      <div className="flex justify-end mb-4 text-sm text-gray-500">
        Date: {new Date().toLocaleDateString()}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition font-semibold"
      >
        {loading ? "Posting..." : "Post Blog"}
      </button>
    </div>
  );
}
