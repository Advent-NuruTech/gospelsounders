"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/admin"); // redirect after login
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <AuthForm onSuccess={handleLoginSuccess} />
    </div>
  );
}
