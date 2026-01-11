"use client";

import { useState } from "react";
import { adminSignUp, adminLogin } from "./useAdminAuth";

export default function AdminAuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        if (!email || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
          setError("All fields are required");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        await adminSignUp(email, password, securityQuestion, securityAnswer, token);
        setSuccess("Admin account created successfully!");
      } else {
        await adminLogin(email, password);
        setSuccess("Logged in successfully!");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 rounded shadow-lg bg-[#0D3B66] text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#F4D35E]">
        {mode === "login" ? "Gospel Sounders Admin Login" : "Gospel Sounders Admin Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 rounded border border-[#F4D35E] text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded border border-[#F4D35E] text-black"
          required
        />

        {mode === "signup" && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded border border-[#F4D35E] text-black"
              required
            />
            <input
              type="text"
              placeholder="Security Question"
              value={securityQuestion}
              onChange={e => setSecurityQuestion(e.target.value)}
              className="w-full p-2 rounded border border-[#F4D35E] text-black"
              required
            />
            <input
              type="text"
              placeholder="Answer"
              value={securityAnswer}
              onChange={e => setSecurityAnswer(e.target.value)}
              className="w-full p-2 rounded border border-[#F4D35E] text-black"
              required
            />
            <input
              type="text"
              placeholder="Admin Token (if not first admin)"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="w-full p-2 rounded border border-[#F4D35E] text-black"
            />
          </>
        )}

        {error && <div className="text-red-400">{error}</div>}
        {success && <div className="text-green-400">{success}</div>}

        <button type="submit" className="w-full py-2 bg-[#F4D35E] text-[#0D3B66] font-bold rounded">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-3 text-sm">
        {mode === "login" ? (
          <span onClick={() => setMode("signup")} className="cursor-pointer text-[#F4D35E] underline">
            Need an admin account? Sign Up
          </span>
        ) : (
          <span onClick={() => setMode("login")} className="cursor-pointer text-[#F4D35E] underline">
            Back to Login
          </span>
        )}
      </p>
    </div>
  );
}
