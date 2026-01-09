"use client";

import AdminLayout from "./AdminLayout"; // make sure the path is correct

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
        <p>This is a simple email & password login system.</p>
      </div>
    </AdminLayout>
  );
}
