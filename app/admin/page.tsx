"use client";

import { useState, useEffect } from "react";
import EditProfile from "@/components/admin/EditProfile";
import AddAdmin from "@/components/admin/AddAdmin";
import { signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import {
  FiUsers,
  FiHeart,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiUserPlus,
  FiUser,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";
import { FaPrayingHands, FaUserEdit } from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"profile" | "addAdmin" | null>(null);
  const [stats, setStats] = useState({
    members: 0,
    prayerRequests: 0,
    blog: 0,
    recentMembers: 0,
    pendingRequests: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch stats and activities from Firestore
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch all stats in parallel
        const [
          membersSnap,
          prayersSnap,
          blogsSnap,
          recentMembersSnap,
          pendingRequestsSnap,
          activitiesSnap
        ] = await Promise.all([
          getDocs(collection(db, "members")),
          getDocs(collection(db, "prayerRequests")),
          getDocs(collection(db, "blog")),
          getDocs(query(collection(db, "members"), orderBy("createdAt", "desc"), limit(5))),
          getDocs(query(collection(db, "prayerRequests"), orderBy("status", "asc"), limit(10))),
          getDocs(query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(5)))
        ]);

        setStats({
          members: membersSnap.size,
          prayerRequests: prayersSnap.size,
          blog: blogsSnap.size,
          recentMembers: recentMembersSnap.size,
          pendingRequests: pendingRequestsSnap.docs.filter(doc => doc.data().status === "pending").length,
        });

        // Process recent activities
        const activities = activitiesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'addMember':
        router.push('/admin/members/add-member');
        break;
      case 'addBlog':
        router.push('/admin/blog/post');
        break;
      case 'viewPrayers':
        router.push('/admin/received-prayer');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {auth.currentUser?.email?.split('@')[0] || 'Admin'}!</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Members Card */}
          <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.members}</h3>
            <p className="text-gray-600">Total Members</p>
            <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span>{stats.recentMembers} new this week</span>
            </div>
          </div>

          {/* Prayer Requests Card */}
          <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <FaPrayingHands className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-sm font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                {stats.pendingRequests} pending
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.prayerRequests}</h3>
            <p className="text-gray-600">Prayer Requests</p>
            <div className="mt-3">
              <button
                onClick={() => handleQuickAction('viewPrayers')}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
              >
                View requests
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Blog Posts Card */}
          <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.blog}</h3>
            <p className="text-gray-600">Blog Posts</p>
            <div className="mt-3">
              <button
                onClick={() => handleQuickAction('addBlog')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                Create new post
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Quick Actions & Admin Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
              <FiActivity className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            

              <button
                onClick={() => handleQuickAction('addBlog')}
                className="group p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <FiFileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Create Blog Post</h3>
                    <p className="text-sm text-gray-600">Write and publish new content</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("addAdmin")}
                className="group p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <FiUserPlus className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Add Admin User</h3>
                    <p className="text-sm text-gray-600">Create new admin account</p>
                  </div>
                </div>
              </button>

            
            </div>
          </div>

          {/* Admin Tools Panel */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Admin Tools</h2>
              <FiSettings className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-1">Profile Settings</h3>
                <p className="text-sm text-blue-700 mb-3">Update your email and password</p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-1">Add Admin User</h3>
                <p className="text-sm text-emerald-700 mb-3">Create new administrator account</p>
                <button
                  onClick={() => setActiveTab("addAdmin")}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Overlay */}
        {activeTab && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeTab === "profile" ? "Edit Profile" : "Add Admin User"}
                </h2>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                {activeTab === "profile" && <EditProfile />}
                {activeTab === "addAdmin" && <AddAdmin />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      )}
    </div>
  );
}