"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [editingStates, setEditingStates] = useState<{
    [key: string]: { name: string; imageFile: File | null; metadata: string };
  }>({});

  useEffect(() => {
    const fetchMembers = async () => {
      const q = query(collection(db, "members"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        imageUrl: d.data().imageUrl,
        metadata: d.data().metadata,
      })) as Member[];

      setMembers(data);

      const states: typeof editingStates = {};
      data.forEach((m) => {
        states[m.id] = { name: m.name, imageFile: null, metadata: m.metadata };
      });
      setEditingStates(states);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const handleSave = async (member: Member) => {
    const state = editingStates[member.id];
    if (!state || !state.name.trim()) return;

    setSavingIds((p) => [...p, member.id]);

    try {
      let imageUrl = member.imageUrl;
      if (state.imageFile) {
        imageUrl = await uploadToCloudinary(state.imageFile);
      }

      await updateDoc(doc(db, "members", member.id), {
        name: state.name,
        imageUrl,
        metadata: state.metadata,
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, name: state.name, imageUrl, metadata: state.metadata } : m
        )
      );

      setEditingStates((prev) => ({
        ...prev,
        [member.id]: { ...prev[member.id], imageFile: null },
      }));
    } finally {
      setSavingIds((p) => p.filter((id) => id !== member.id));
    }
  };

  if (loading)
    return <p className="text-center py-20 text-white">Loading members…</p>;

  return (
    <main className="min-h-screen bg-[#0D3B66] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold">Manage Members</h1>

        {members.map((member) => {
          const state = editingStates[member.id];
          const saving = savingIds.includes(member.id);
          if (!state) return null;

          return (
            <section
              key={member.id}
              className="border border-blue-500 rounded-lg p-6 bg-[#0A2F52]"
            >
              {/* Image */}
              <div className="relative w-full h-64 mb-4 rounded border border-blue-400 overflow-hidden bg-[#08304F]">
                <Image
                  src={state.imageFile ? URL.createObjectURL(state.imageFile) : member.imageUrl}
                  alt={state.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-semibold">
                  Change Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={(e) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [member.id]: {
                        ...prev[member.id],
                        imageFile: e.target.files?.[0] ?? null,
                      },
                    }))
                  }
                />
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [member.id]: { ...prev[member.id], name: e.target.value },
                    }))
                  }
                  className="w-full p-2 rounded bg-[#08304F] border border-blue-400 text-white"
                />
              </div>

              {/* Metadata */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-semibold">
                  Details
                </label>
                <RichTextEditor
                  value={state.metadata}
                  onChange={(val) =>
                    setEditingStates((prev) => ({
                      ...prev,
                      [member.id]: { ...prev[member.id], metadata: val },
                    }))
                  }
                />
              </div>

              {/* Save */}
              <button
                onClick={() => handleSave(member)}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
              >
                {saving ? "Saving..." : "Update Member"}
              </button>
            </section>
          );
        })}
      </div>
    </main>
  );
}
