"use client";

import { useMemo, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AlertCircle, Check, Copy, Key, Mail, Shield, UserPlus, X } from "lucide-react";
import { normalizeAdminEmail } from "@/lib/adminAccess";
import { ADMIN_LOGIN_PATH } from "@/lib/adminRoutes";
import { auth, db } from "@/lib/firebase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

interface CreatedAdmin {
  email: string;
  password: string;
  loginUrl: string;
}

function validatePassword(password: string) {
  return (
    password.length >= 10 &&
    password.length <= 128 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

function buildInvite({ email, password, loginUrl }: CreatedAdmin) {
  return [
    "Congratulations,",
    "",
    "You have been added as an administrator for Gospel Sounders Publications and Missions.",
    "",
    "Login Details:",
    `Login URL: ${loginUrl}`,
    `Email: ${email}`,
    `Temporary Password: ${password}`,
    "",
    "Important:",
    "- Change your password after first login.",
    "- Keep your login credentials secure.",
    "- Contact the system administrator if you need help.",
  ].join("\n");
}

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [createdAdmin, setCreatedAdmin] = useState<CreatedAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inviteText = useMemo(
    () => (createdAdmin ? buildInvite(createdAdmin) : ""),
    [createdAdmin],
  );

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setCreatedAdmin(null);
    setCopied(false);
    setShowPassword(false);
  };

  const generateRandomPassword = () => {
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";
    const all = `${lower}${upper}${numbers}${symbols}`;
    const chars = [lower, upper, numbers, symbols].map(
      (set) => set[Math.floor(Math.random() * set.length)],
    );

    while (chars.length < 14) {
      chars.push(all[Math.floor(Math.random() * all.length)]);
    }

    const generated = chars.sort(() => Math.random() - 0.5).join("");
    setPassword(generated);
    setConfirmPassword(generated);
  };

  const handleAddAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setCopied(false);

    const cleanEmail = normalizeAdminEmail(email);
    const createdByUid = auth.currentUser?.uid ?? null;
    const createdByEmail = auth.currentUser?.email ?? null;

    if (!cleanEmail || cleanEmail.length > 254 || !EMAIL_PATTERN.test(cleanEmail)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be 10-128 characters and include uppercase, lowercase, and a number.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);

      await Promise.all([
        setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            email: cleanEmail,
            role: "admin",
            createdAt: serverTimestamp(),
            createdByUid,
            createdByEmail,
          },
          { merge: true },
        ),
        setDoc(
          doc(db, "admins", userCredential.user.uid),
          {
            email: cleanEmail,
            active: true,
            createdAt: serverTimestamp(),
            createdByUid,
            createdByEmail,
          },
          { merge: true },
        ),
      ]);

      setCreatedAdmin({
        email: cleanEmail,
        password,
        loginUrl: `${window.location.origin}${ADMIN_LOGIN_PATH}`,
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/operation-not-allowed": "Email/password accounts are not enabled.",
        "auth/weak-password": "Password is too weak.",
        "auth/network-request-failed": "Network error. Please check your connection.",
      };

      setMessage(errorMessages[code] || "An error occurred. Please try again.");
      setCreatedAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = inviteText;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  if (createdAdmin) {
    return (
      <div className="relative mx-auto w-full max-w-md min-w-0 rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <button
          onClick={resetForm}
          className="absolute right-3 top-3 rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-800"
          aria-label="Close success message"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex min-w-0 items-start gap-3 pr-10">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
            <Shield className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-xl font-bold text-slate-900">Admin Added Successfully</h2>
            <p className="mt-1 text-sm text-slate-600">Copy and send these credentials securely.</p>
          </div>
        </div>

        <pre className="max-h-72 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-emerald-100 bg-white p-4 text-sm leading-6 text-slate-700">
          {inviteText}
        </pre>

        <div className="mt-4 space-y-3">
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 p-3 font-semibold text-white transition hover:bg-emerald-700"
            type="button"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "Copied" : "Copy Invite"}
          </button>
          <button
            onClick={resetForm}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            type="button"
          >
            Add Another Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex min-w-0 items-start gap-3">
        <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
          <UserPlus className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-xl font-bold text-slate-900">Add New Admin</h2>
          <p className="mt-1 text-sm text-slate-600">Create a registered administrator account.</p>
        </div>
      </div>

      <form onSubmit={handleAddAdmin} className="space-y-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4" />
            Email Address
          </label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            placeholder="admin@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full min-w-0 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div>
          <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Key className="h-4 w-4" />
              Password
            </label>
            <button
              type="button"
              onClick={generateRandomPassword}
              className="text-sm font-medium text-blue-700 transition hover:text-blue-900"
            >
              Generate Strong Password
            </button>
          </div>
          <div className="flex min-w-0 gap-2">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              maxLength={128}
              placeholder="Temporary password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            maxLength={128}
            placeholder="Confirm temporary password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="w-full min-w-0 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        {message && (
          <div className="flex min-w-0 items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="min-w-0 break-words text-sm font-medium leading-6">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Add Admin Account"}
        </button>
      </form>
    </div>
  );
}
