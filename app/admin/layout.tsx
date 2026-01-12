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
        {/* Full page wrapper */}
        <div className="flex flex-col min-h-screen bg-[#0D3B66] text-white">
          {/* Optional top spacing */}
          <div className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
