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
        <div className="min-h-full">{children}</div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
