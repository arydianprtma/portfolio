"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  UserCircle,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
    { label: "PROJECTS", href: "/admin/projects", icon: FolderGit2 },
    { label: "NEW PROJECT", href: "/admin/projects/new", icon: PlusCircle },
    { label: "PROFILE & SKILLS", href: "/admin/profile", icon: UserCircle },
    { label: "SETTINGS", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col justify-between h-screen sticky top-0 p-6 select-none shrink-0">
      <div>
        {/* Admin Brand */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1C1C1C]">
          <Link href="/admin" className="group">
            <Logo size="sm" subtext="ADMIN" />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;

            let isActive = false;
            if (item.href === "/admin") {
              isActive = pathname === "/admin";
            } else if (item.href === "/admin/projects/new") {
              isActive = pathname === "/admin/projects/new";
            } else if (item.href === "/admin/projects") {
              isActive =
                pathname === "/admin/projects" ||
                (pathname.startsWith("/admin/projects/") && pathname !== "/admin/projects/new");
            } else {
              isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-none transition-colors duration-200 uppercase tracking-wider ${
                  isActive
                    ? "bg-[#181818] text-[#F5F5F5] border-l-2 border-l-[#E31B23] font-semibold"
                    : "text-[#777777] hover:text-[#F5F5F5] hover:bg-[#121212]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#E31B23]" : "text-[#555555]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-[#1C1C1C] font-mono text-xs">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 bg-[#121212] border border-[#222222] text-[#888888] hover:text-[#F5F5F5] hover:border-[#E31B23] transition-colors"
        >
          <span className="uppercase text-[11px] tracking-wider">VIEW LIVE SITE</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E31B23]" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[#777777] hover:text-[#E31B23] hover:bg-[#181818] transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span className="uppercase tracking-wider">LOG OUT</span>
        </button>
      </div>
    </aside>
  );
};
