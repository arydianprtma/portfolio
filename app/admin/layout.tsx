import React from "react";
import { isAuthenticated } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | ARDP Portfolio",
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
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-[#0A0A0A] text-[#F5F5F5] flex flex-col md:flex-row font-mono selection:bg-[#E31B23] selection:text-white">
      {/* Fixed Sticky Sidebar on Desktop / Mobile Drawer on Small Screens */}
      <AdminSidebar />
      {/* Scrollable Content Area */}
      <main className="flex-1 md:h-screen md:overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
