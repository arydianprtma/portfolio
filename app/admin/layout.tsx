import React from "react";
import { isAuthenticated } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | BOS Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0A0A0A] text-[#F5F5F5] flex flex-col md:flex-row font-mono selection:bg-[#E31B23] selection:text-white">
      {/* Fixed Sticky Sidebar */}
      <AdminSidebar />
      {/* Scrollable Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
