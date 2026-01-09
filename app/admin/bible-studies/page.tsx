"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

interface LibraryDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  filePath: string;
}

export default function AdminLibraryPage() {
  const [docs, setDocs] = useState<LibraryDoc[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    file: null as File | null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "library"), (snapshot) => {
      const allDocs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as LibraryDoc[];
      setDocs(allDocs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.description || !form.file) {
      return alert("All fields are required");
    }
    setLoading(true);

    try {
      const filePath = await uploadToCloudinary(form.file);

      if (editingId) {
        await updateDoc(doc(db, "library", editingId), {
          title: form.title,
          category: form.category,
          description: form.description,
          filePath,
        });
      } else {
        await addDoc(collection(db, "library"), {
          title: form.title,
          category: form.category,
          description: form.description,
          filePath,
          createdAt: new Date(),
        });
      }

      setForm({ title: "", category: "", description: "", file: null });
      setEditingId(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc: LibraryDoc) => {
    setForm({ ...doc, file: null });
    setEditingId(doc.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDoc(doc(db, "library", id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{editingId ? "Edit Document" : "Add Document"}</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <textarea
        placeholder="Short Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="file"
        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
        className="mb-2"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded mt-2"
      >
        {loading ? "Saving..." : editingId ? "Update" : "Add"}
      </button>

      <hr className="my-6" />

      <h2 className="text-lg font-bold mb-2">Existing Documents</h2>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id} className="flex justify-between items-center mb-2">
            <span>{doc.title} ({doc.category})</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(doc)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
