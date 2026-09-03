"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
  BookOpen,
  FlaskConical,
  Mail,
  Receipt,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile sidebar drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    { label: "INBOX", href: "/admin/messages", icon: Mail },
    { label: "PROPOSALS", href: "/admin/proposals", icon: FileText },
    { label: "INVOICES", href: "/admin/invoices", icon: Receipt },
    { label: "PROJECTS", href: "/admin/projects", icon: FolderGit2 },
    { label: "NEW PROJECT", href: "/admin/projects/new", icon: PlusCircle },
    { label: "ARTICLES", href: "/admin/posts", icon: BookOpen },
    { label: "EXPERIMENTS", href: "/admin/experiments", icon: FlaskConical },
    { label: "PROFILE & SKILLS", href: "/admin/profile", icon: UserCircle },
    { label: "CV BUILDER", href: "/admin/cv", icon: BookOpen },
    { label: "SETTINGS", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger Menu (Visible on < md) */}
      <div className="no-print md:hidden bg-[#0D0D0D] border-b border-[#1F1F1F] p-4 flex items-center justify-between sticky top-0 z-40 select-none">
        <Link href="/admin" className="group">
          <Logo size="sm" subtext="ADMIN" />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-[#161616] border border-[#2B2B2B] text-[#F5F5F5] hover:text-[#E31B23] transition-colors"
          aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="no-print fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Drawer (Slide-in on mobile, fixed on desktop) */}
      <aside
        className={`no-print fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-auto w-72 md:w-64 bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col justify-between h-full md:h-screen p-6 select-none shrink-0 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Admin Brand (Desktop Header) */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1C1C1C]">
            <Link href="/admin" className="group">
              <Logo size="sm" subtext="ADMIN" />
            </Link>

            {/* Mobile close button inside drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-[#777777] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="space-y-1.5 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;

              let isActive = false;
              if (item.href === "/admin") {
                isActive = pathname === "/admin";
              } else if (item.href === "/admin/messages") {
                isActive = pathname === "/admin/messages" || pathname.startsWith("/admin/messages/");
              } else if (item.href === "/admin/projects/new") {
                isActive = pathname === "/admin/projects/new";
              } else if (item.href === "/admin/projects") {
                isActive =
                  pathname === "/admin/projects" ||
                  (pathname.startsWith("/admin/projects/") && pathname !== "/admin/projects/new");
              } else if (item.href === "/admin/posts") {
                isActive =
                  pathname === "/admin/posts" ||
                  (pathname.startsWith("/admin/posts/") && pathname !== "/admin/posts/new");
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
    </>
  );
};
