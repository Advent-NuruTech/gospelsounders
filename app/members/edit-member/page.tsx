"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import parse from "html-react-parser";
import RichTextEditor from "@/components/RichTextEditor"; // your editor component
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
  const [savingIds, setSavingIds] = useState<string[]>([]); // track which members are saving
  const [editingStates, setEditingStates] = useState<{
    [key: string]: { name: string; imageFile: File | null; metadata: string };
  }>({});

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const membersRef = collection(db, "members");
        const q = query(membersRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          name: docSnap.data().name,
          imageUrl: docSnap.data().imageUrl,
          metadata: docSnap.data().metadata,
        })) as Member[];

        setMembers(data);

        // Initialize editing states
        const states: typeof editingStates = {};
        data.forEach((m) => {
          states[m.id] = { name: m.name, imageFile: null, metadata: m.metadata };
        });
        setEditingStates(states);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSave = async (member: Member) => {
    const state = editingStates[member.id];
    if (!state) return;
    if (!state.name.trim()) return alert("Name is required");

    setSavingIds((prev) => [...prev, member.id]);

    try {
      let imageUrl = member.imageUrl;

      // Upload new image if selected
      if (state.imageFile) {
        imageUrl = await uploadToCloudinary(state.imageFile);
      }

      const ref = doc(db, "members", member.id);
      await updateDoc(ref, {
        name: state.name,
        imageUrl,
        metadata: state.metadata,
      });

      // Update local state
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, name: state.name, imageUrl, metadata: state.metadata } : m
        )
      );

      alert("Member updated successfully!");
      setEditingStates((prev) => ({
        ...prev,
        [member.id]: { ...prev[member.id], imageFile: null },
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update member.");
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== member.id));
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-600 dark:text-gray-300">Loading members…</p>;
  if (members.length === 0)
    return <p className="text-center py-20 text-gray-600 dark:text-gray-300">No members found.</p>;

  return (
    <main className="container mx-auto px-4 py-12 space-y-8">
      {members.map((member) => {
        const state = editingStates[member.id];
        const saving = savingIds.includes(member.id);

        if (!state) return null;

        return (
          <div
            key={member.id}
            className="bg-[#F6F1EA]/10 dark:bg-[#2A1A10]/30 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-200 border border-white/10 p-4"
          >
            {/* Image */}
            <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-[#3B2414]">
              <Image
                src={state.imageFile ? URL.createObjectURL(state.imageFile) : member.imageUrl || ""}
                alt={state.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
                Change Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files &&
                  setEditingStates((prev) => ({
                    ...prev,
                    [member.id]: { ...prev[member.id], imageFile: e.target.files![0] },
                  }))
                }
                className="w-full text-sm text-[#3B2414] dark:text-[#F6F1EA]"
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
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
                className="w-full p-3 rounded-lg bg-white dark:bg-[#2A1A10] text-[#3B2414] dark:text-[#F6F1EA] border border-[#E7D9C4] dark:border-[#5A3A23]"
              />
            </div>

            {/* Metadata */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
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

            {/* Save Button */}
            <button
              onClick={() => handleSave(member)}
              disabled={saving}
              className="px-6 py-3 bg-[#C9A24D] text-[#3B2414] dark:text-[#2A1A10] font-bold rounded-lg hover:bg-[#B8943F] transition-all"
            >
              {saving ? "Saving..." : "Update Member"}
            </button>
          </div>
        );
      })}
    </main>
  );
}
