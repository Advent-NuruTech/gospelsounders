"use client";

import { useEffect, useState, type ReactNode } from "react";
import EditProfile from "@/components/admin/EditProfile";
import AddAdmin from "@/components/admin/AddAdmin";
import { useRouteLoading } from "@/components/RouteLoadingProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { ADMIN_ROUTES } from "@/lib/adminRoutes";
import {
  FiUsers,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { FaPrayingHands } from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] =
    useState<"profile" | "addAdmin" | null>(null);

  const [stats, setStats] = useState({
    members: 0,
    prayerRequests: 0,
    blog: 0,
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { startRouteLoading } = useRouteLoading();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [members, prayers, blogs] = await Promise.all([
          getDocs(collection(db, "members")),
          getDocs(collection(db, "prayerRequests")),
          getDocs(collection(db, "blog")),
        ]);

        setStats({
          members: members.size,
          prayerRequests: prayers.size,
          blog: blogs.size,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const navigateTo = (href: string) => {
    startRouteLoading(href);
    router.push(href);
  };

  const logout = async () => {
    await signOut(auth);
    navigateTo("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
              Admin Dashboard
            </h1>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {auth.currentUser?.email?.split("@")[0] || "Admin"}
            </p>
          </div>

          <button
            onClick={logout}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white shadow transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="space-y-5 p-4 sm:p-5 lg:p-6">
        {/* STATS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Members"
            value={stats.members}
            icon={<FiUsers />}
            onClick={() => navigateTo("/members")}
            color="blue"
          />

          <StatCard
            title="Prayer Requests"
            value={stats.prayerRequests}
            icon={<FaPrayingHands />}
            onClick={() => navigateTo(ADMIN_ROUTES.receivedPrayer)}
            color="pink"
          />

          <StatCard
            title="Blog Posts"
            value={stats.blog}
            icon={<FiFileText />}
            onClick={() => navigateTo("/blog")}
            color="emerald"
          />
        </div>

        {/* ADMIN TOOLS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Admin Tools
            </h2>
            <FiSettings className="shrink-0 text-slate-400" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToolCard
              title="Profile Settings"
              desc="Update email and password"
              color="blue"
              onClick={() => setActiveTab("profile")}
            />
            <ToolCard
              title="Add Admin"
              desc="Create administrator account"
              color="emerald"
              onClick={() => setActiveTab("addAdmin")}
            />
          </div>
        </section>
      </main>

      {/* MODAL */}
      {activeTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <h3 className="min-w-0 break-words font-semibold text-slate-800 dark:text-slate-100">
                {activeTab === "profile" ? "Edit Profile" : "Add Admin"}
              </h3>
              <button
                aria-label="Close dialog"
                onClick={() => setActiveTab(null)}
                className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "profile" && <EditProfile />}
              {activeTab === "addAdmin" && <AddAdmin />}
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-900">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Loading dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type StatColor = "blue" | "pink" | "emerald";

interface StatStyle {
  iconBg: string;
  iconText: string;
}

const statStyles: Record<StatColor, StatStyle> = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconText: "text-blue-600",
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    iconText: "text-pink-600",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconText: "text-emerald-600",
  },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  onClick: () => void;
  color: StatColor;
}

function StatCard({ title, value, icon, onClick, color }: StatCardProps) {
  const s = statStyles[color];

  return (
    <button
      onClick={onClick}
      className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl ${s.iconBg} ${s.iconText}`}
        >
          {icon}
        </div>
        <FiChevronRight className="shrink-0 text-slate-400" aria-hidden="true" />
      </div>

      <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {value}
      </h3>
      <p className="break-words text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>
    </button>
  );
}

type ToolColor = "blue" | "emerald";

interface ToolStyle {
  bg: string;
  border: string;
  title: string;
  text: string;
  button: string;
}

const toolStyles: Record<ToolColor, ToolStyle> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    title: "text-blue-800 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    title: "text-emerald-800 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

interface ToolCardProps {
  title: string;
  desc: string;
  color: ToolColor;
  onClick: () => void;
}

function ToolCard({ title, desc, color, onClick }: ToolCardProps) {
  const s = toolStyles[color];

  return (
    <div className={`min-w-0 rounded-lg border p-4 ${s.bg} ${s.border}`}>
      <h4 className={`break-words font-semibold ${s.title}`}>{title}</h4>
      <p className={`mb-3 break-words text-sm ${s.text}`}>{desc}</p>
      <button
        onClick={onClick}
        className={`w-full rounded-md py-2 font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${s.button}`}
      >
        Open
      </button>
    </div>
  );
}
