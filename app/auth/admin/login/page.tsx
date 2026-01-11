"use client";

import AdminAuthForm from "@/components/admin/AdminAuthForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminState } from "@/components/admin/useAdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = useAdminState(user => {
      if (user) {
        router.replace("/admin/dashboard"); // Redirect to admin dashboard
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D3B66]">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <AdminAuthForm />
      </div>
    </div>
  );
}
