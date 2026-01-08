"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "./RichTextEditor";

interface MemberData {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

interface AddMemberProps {
  member?: MemberData;
}

export default function AddMember({ member }: AddMemberProps) {
  const [name, setName] = useState(member?.name ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState(member?.metadata ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Member name is required");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      let imageUrl = member?.imageUrl ?? "";

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if (member) {
        // Update member
        await updateDoc(doc(db, "members", member.id), {
          name: name.trim(),
          imageUrl,
          metadata,
          updatedAt: serverTimestamp(),
        });

        alert("Member updated successfully");
      } else {
        // Create member
        await addDoc(collection(db, "members"), {
          name: name.trim(),
          imageUrl,
          metadata,
          createdAt: serverTimestamp(),
        });

        alert("Member added successfully");

        // Reset form only after create
        setName("");
        setImageFile(null);
        setMetadata("");
      }
    } catch (error) {
      console.error("Member save error:", error);
      alert("Failed to save member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F6F1EA]/10 dark:bg-[#2A1A10]/30 p-6 rounded-2xl space-y-5 border border-white/10">
      {/* Member Name */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
          Member Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          className="w-full p-3 rounded-lg bg-white dark:bg-[#2A1A10]
          text-[#3B2414] dark:text-[#F6F1EA]
          border border-[#E7D9C4] dark:border-[#5A3A23]
          focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
        />
      </div>

      {/* Member Image */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
          Member Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          className="w-full text-sm text-[#3B2414] dark:text-[#F6F1EA]"
        />
        {member?.imageUrl && !imageFile && (
          <p className="mt-1 text-xs text-gray-500">
            Current image will be kept unless replaced
          </p>
        )}
      </div>

      {/* Rich Metadata */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-[#3B2414] dark:text-[#F6F1EA]">
          Member Details
        </label>
        <RichTextEditor value={metadata} onChange={setMetadata} />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-6 py-3 bg-[#C9A24D]
        text-[#3B2414] font-bold rounded-lg
        hover:bg-[#B8943F] disabled:opacity-60
        transition-all"
      >
        {loading
          ? "Saving..."
          : member
          ? "Update Member"
          : "Add Member"}
      </button>
    </div>
  );
}
