"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AlertCircle, Eye, EyeOff, Lock, Mail, Moon, ShieldCheck, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { hasAdminAccess, normalizeAdminEmail } from "@/lib/adminAccess";
import { ADMIN_BASE_PATH } from "@/lib/adminRoutes";
import {
  clearLoginAttempts,
  formatLockout,
  getLoginThrottleState,
  recordFailedLoginAttempt,
} from "@/lib/adminLoginThrottle";
import { auth } from "@/lib/firebase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function validateLogin(email: string, password: string) {
  if (!email || !password) return "Enter both email and password.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (password.length > 128) return "Password is too long.";
  return "";
}

function getSafeNextPath() {
  if (typeof window === "undefined") return ADMIN_BASE_PATH;

  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith(ADMIN_BASE_PATH) || next.startsWith(`${ADMIN_BASE_PATH}/login`)) {
    return ADMIN_BASE_PATH;
  }

  return next;
}

function getGenericError(code?: string) {
  if (code === "auth/network-request-failed") {
    return "Network error. Check your connection and try again.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many failed attempts. Try again later.";
  }

  if (code === "auth/user-disabled") {
    return "This account is disabled. Contact the administrator.";
  }

  return "Invalid email or password.";
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("admin-theme");
    setIsDarkMode(
      savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    const rememberedEmail = window.localStorage.getItem("remembered-admin-email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    const throttle = getLoginThrottleState();
    if (throttle.locked) {
      setError(`Too many failed attempts. Try again in ${formatLockout(throttle.lockUntil)}.`);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    window.localStorage.setItem("admin-theme", nextTheme ? "dark" : "light");
  };

  const handleFailedAttempt = (message: string) => {
    const throttle = recordFailedLoginAttempt();

    if (throttle.locked) {
      setError(`Too many failed attempts. Try again in ${formatLockout(throttle.lockUntil)}.`);
      return;
    }

    setError(`${message} ${throttle.remainingAttempts} attempt${throttle.remainingAttempts === 1 ? "" : "s"} remaining.`);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanEmail = normalizeAdminEmail(email);
    setEmail(cleanEmail);

    const validationError = validateLogin(cleanEmail, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    const throttle = getLoginThrottleState();
    if (throttle.locked) {
      setError(`Too many failed attempts. Try again in ${formatLockout(throttle.lockUntil)}.`);
      return;
    }

    setLoading(true);

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const allowed = await hasAdminAccess(credential.user);

      if (!allowed) {
        await signOut(auth);
        handleFailedAttempt("This account is not authorized for administrator access.");
        return;
      }

      clearLoginAttempts();

      if (rememberMe) {
        window.localStorage.setItem("remembered-admin-email", cleanEmail);
      } else {
        window.localStorage.removeItem("remembered-admin-email");
      }

      router.replace(getSafeNextPath());
    } catch (err: unknown) {
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : undefined;
      handleFailedAttempt(getGenericError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen overflow-x-hidden ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">
        <section className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-sm text-center">
            <div className="relative mx-auto mb-5 h-28 w-28 overflow-hidden rounded-2xl shadow-lg sm:h-36 sm:w-36">
              <Image src="/images/logo.jpg" alt="Gospel Sounders Logo" fill className="object-cover" priority />
            </div>
            <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
              Gospel Sounders
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              Publications & Missions
            </p>
            <div
              className={`mt-8 rounded-lg border p-4 text-left ${
                isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="min-w-0 text-sm font-medium leading-6">
                  Use the official private access URL and your registered administrator credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10 ${
            isDarkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          <div className="w-full max-w-md min-w-0">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-800 text-amber-300"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
            </div>

            <div className="mb-8 min-w-0">
              <h2 className="break-words text-2xl font-bold sm:text-3xl">Administrator Access</h2>
              <p className={`mt-2 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Sign in with your registered account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="min-w-0">
                <label
                  className={`mb-2 flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <div className="relative min-w-0">
                  <Mail
                    className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    maxLength={254}
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`w-full min-w-0 rounded-lg border p-3.5 pl-10 text-base outline-none transition focus:ring-2 ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                        : "border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:ring-blue-600/20"
                    }`}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
                  <label
                    className={`flex items-center gap-2 text-sm font-medium ${
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className={`inline-flex shrink-0 items-center gap-1 text-sm font-medium ${
                      isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative min-w-0">
                  <Lock
                    className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    maxLength={128}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`w-full min-w-0 rounded-lg border p-3.5 pl-10 pr-4 text-base outline-none transition focus:ring-2 ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                        : "border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:ring-blue-600/20"
                    }`}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                <label className="flex min-w-0 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    disabled={loading}
                  />
                  <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    Remember email
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setError("Contact the system administrator for password reset.")}
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-amber-300 hover:text-amber-200" : "text-blue-700 hover:text-blue-800"
                  }`}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`flex w-full min-w-0 items-center justify-center rounded-lg p-3.5 font-semibold text-white transition ${
                  loading
                    ? "cursor-not-allowed opacity-70"
                    : isDarkMode
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <div
                className={`mt-6 min-w-0 rounded-lg border p-4 ${
                  isDarkMode
                    ? "border-red-900 bg-red-950/40 text-red-200"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="min-w-0 break-words text-sm font-medium leading-6">{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
