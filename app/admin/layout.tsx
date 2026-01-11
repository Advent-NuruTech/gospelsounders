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
        <div className="min-h-screen bg-[#0D3B66] text-white">
          {children}
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
