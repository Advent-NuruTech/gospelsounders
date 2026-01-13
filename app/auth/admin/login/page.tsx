// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0D3B66] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo.jpg"
   
            alt="Gospel Sounders Logo"
            width={300}
            height={200}
            className="rounded-full"
          />
        </div>

        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-[#0D3B66] mb-2">Welcome to  Admin</h1>
        <p className="text-gray-600 mb-6">Please login to access the admin dashboard</p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F4D35E]"
            required
          />
          <button
            type="submit"
            className="bg-[#F4D35E] text-[#0D3B66] font-bold py-3 rounded hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
      </div>
    </div>
  );
}
