"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

interface Props {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: Props) {
  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
          {children}
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}