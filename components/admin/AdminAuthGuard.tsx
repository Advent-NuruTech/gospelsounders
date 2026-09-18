"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { hasAdminAccess } from "@/lib/adminAccess";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from "@/lib/adminRoutes";
import { auth } from "@/lib/firebase";

interface Props {
  children: React.ReactNode;
}

function buildLoginRedirect() {
  if (typeof window === "undefined") return ADMIN_LOGIN_PATH;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (!currentPath.startsWith(ADMIN_BASE_PATH) || currentPath.startsWith(ADMIN_LOGIN_PATH)) {
    return ADMIN_LOGIN_PATH;
  }

  return `${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(currentPath)}`;
}

export default function AdminAuthGuard({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;

      if (!firebaseUser) {
        setLoading(false);
        router.replace(buildLoginRedirect());
        return;
      }

      const allowed = await hasAdminAccess(firebaseUser);
      if (!active) return;

      if (!allowed) {
        await signOut(auth);
        setLoading(false);
        router.replace(`${ADMIN_LOGIN_PATH}?error=unauthorized`);
        return;
      }

      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D3B66] text-white">
        <svg
          className="mb-4 h-10 w-10 animate-spin text-[#F4D35E]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
