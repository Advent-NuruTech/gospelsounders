"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  request: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function ReceivedPrayersPage() {
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  const loadPrayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prayerRequests"));
      const list: PrayerRequest[] = snapshot.docs.map(
        (item: QueryDocumentSnapshot<DocumentData>) => ({
          id: item.id,
          ...(item.data() as Omit<PrayerRequest, "id">),
        }),
      );

      setPrayers(list);
    } catch (err) {
      console.error("Failed to load prayers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this prayer request?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "prayerRequests", id));
      setPrayers((prev) => prev.filter((prayer) => prayer.id !== id));
    } catch (error) {
      console.error("Failed to delete prayer request:", error);
      alert("Error deleting the request.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold dark:text-white">
        Received Prayer Requests
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading prayer requests...</p>
      ) : prayers.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No prayer requests yet.</p>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="rounded-lg border bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {prayer.name}
                </h2>

                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="shrink-0 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <p className="mt-2 break-words text-sm text-gray-600 dark:text-gray-400">
                <strong>Phone:</strong> {prayer.phone}
              </p>

              {prayer.email && (
                <p className="break-words text-sm text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> {prayer.email}
                </p>
              )}

              <p className="mt-3 break-words leading-relaxed text-gray-700 dark:text-gray-300">
                {prayer.request}
              </p>

              {prayer.createdAt && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Submitted on: {new Date(prayer.createdAt.seconds * 1000).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
