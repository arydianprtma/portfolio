"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowRight,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Code2,
  FolderGit2,
  BookOpen,
  User,
  Sparkles,
  Shield,
  X,
} from "lucide-react";
import { Project, Post } from "@/types";
import { trackCvDownload } from "@/components/analytics/PageTracker";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Projects" | "Articles" | "Socials";
  icon: React.ElementType;
  description?: string;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic projects & articles for live search
  useEffect(() => {
    const fetchQuickData = async () => {
      try {
        const [projRes, postRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/posts"),
        ]);
        if (projRes.ok) {
          const pData = await projRes.json();
          setProjects(pData.projects || []);
        }
        if (postRes.ok) {
          const aData = await postRes.json();
          setPosts((aData.posts || []).filter((p: Post) => p.published !== false));
        }
      } catch (err) {
        console.error("Failed to load command palette data", err);
      }
    };
    fetchQuickData();
  }, []);

  // Global keydown listeners (Ctrl+K, Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("arydianprtma@gmail.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1200);
  };

  const handleDownloadCv = () => {
    trackCvDownload();
    window.open("/api/admin/upload?type=resume", "_blank");
    setIsOpen(false);
  };

  // Build command list
  const baseItems: CommandItem[] = [
    // Navigation
    {
      id: "nav-about",
      title: "01 / About Me",
      category: "Navigation",
      icon: User,
      description: "Bio, core philosophies, and identity",
      perform: () => {
        router.push("/#about");
        setIsOpen(false);
      },
    },
    {
      id: "nav-work",
      title: "02 / Selected Works",
      category: "Navigation",
      icon: FolderGit2,
      description: "Interactive projects showcase",
      perform: () => {
        router.push("/#work");
        setIsOpen(false);
      },
    },
    {
      id: "nav-skills",
      title: "03 / Skills & Capabilities",
      category: "Navigation",
      icon: Code2,
      description: "Technologies & software engineering stack",
      perform: () => {
        router.push("/#skills");
        setIsOpen(false);
      },
    },
    {
      id: "nav-blog",
      title: "04 / Tech Blog & Insights",
      category: "Navigation",
      icon: BookOpen,
      description: "Articles and architectural breakdowns",
      perform: () => {
        router.push("/#blog");
        setIsOpen(false);
      },
    },
    {
      id: "nav-experiments",
      title: "05 / Experiments Lab",
      category: "Navigation",
      icon: Sparkles,
      description: "Creative coding & exploratory prototypes",
      perform: () => {
        router.push("/#experiments");
        setIsOpen(false);
      },
    },
    {
      id: "nav-contact",
      title: "06 / Contact & Inquiry",
      category: "Navigation",
      icon: ArrowRight,
      description: "Direct email and collaboration channels",
      perform: () => {
        router.push("/#contact");
        setIsOpen(false);
      },
    },

    // Actions
    {
      id: "act-cv",
      title: "Download CV / Resume (PDF)",
      category: "Action",
      icon: FileText,
      description: "Instant download verified resume",
      shortcut: "CV",
      perform: handleDownloadCv,
    },
    {
      id: "act-copy-email",
      title: copied ? "Email Copied to Clipboard!" : "Copy Email Address",
      category: "Action",
      icon: copied ? Check : Copy,
      description: "arydianprtma@gmail.com",
      perform: handleCopyEmail,
    },
    {
      id: "act-admin",
      title: "Open Admin Portal",
      category: "Action",
      icon: Shield,
      description: "Secured management dashboard",
      perform: () => {
        router.push("/admin");
        setIsOpen(false);
      },
    },
  ];

  // Dynamically map projects into command items
  const projectItems: CommandItem[] = projects.map((p) => ({
    id: `proj-${p.slug}`,
    title: `Project: ${p.title}`,
    category: "Projects",
    icon: FolderGit2,
    description: `${p.category} • ${p.technologies.slice(0, 3).join(", ")}`,
    perform: () => {
      router.push(`/work/${p.slug}`);
      setIsOpen(false);
    },
  }));

  // Dynamically map articles into command items
  const articleItems: CommandItem[] = posts.map((a) => ({
    id: `post-${a.slug}`,
    title: `Article: ${a.title}`,
    category: "Articles",
    icon: BookOpen,
    description: `${a.readingTime} • ${a.tags.slice(0, 2).join(", ")}`,
    perform: () => {
      router.push(`/blog/${a.slug}`);
      setIsOpen(false);
    },
  }));

  const allItems = [...baseItems, ...projectItems, ...articleItems];

  // Filter items by search query
  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems;

  // Handle keyboard list navigation
  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].perform();
    }
  };

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 sm:pt-28 px-4 font-mono select-none">
          {/* Backdrop Blur Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Command Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#262626] shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#1F1F1F] bg-[#121212]">
              <Search className="w-4 h-4 text-[#E31B23] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyNav}
                placeholder="Search commands, projects, articles, cv..."
                className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#666666] outline-none font-mono"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#666666] hover:text-[#F5F5F5] p-1 ml-2"
                aria-label="Close command palette"
              >
                <kbd className="text-[10px] bg-[#1C1C1C] border border-[#2B2B2B] px-1.5 py-0.5 text-[#888888]">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="max-h-[380px] overflow-y-auto divide-y divide-[#171717] p-2"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[#666666] text-xs">
                  No matching commands found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      data-index={idx}
                      onClick={() => item.perform()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#181818] border-l-2 border-l-[#E31B23]"
                          : "hover:bg-[#121212] text-[#888888]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div
                          className={`w-7 h-7 flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-[#222222] border-[#E31B23]/40 text-[#E31B23]"
                              : "bg-[#141414] border-[#222222] text-[#666666]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div
                            className={`text-xs font-semibold uppercase tracking-wider truncate ${
                              isSelected ? "text-[#F5F5F5]" : "text-[#A0A0A0]"
                            }`}
                          >
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-[10px] text-[#666666] truncate mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] uppercase tracking-widest text-[#555555] bg-[#141414] border border-[#222222] px-1.5 py-0.5">
                          {item.category}
                        </span>
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-[#E31B23]" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2 bg-[#0A0A0A] border-t border-[#1C1C1C] flex items-center justify-between text-[10px] text-[#555555]">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="bg-[#181818] border border-[#2A2A2A] px-1 py-0.5 text-[#888888]">↑</kbd>
                  <kbd className="bg-[#181818] border border-[#2A2A2A] px-1 py-0.5 text-[#888888] ml-1">↓</kbd> to navigate
                </span>
                <span>
                  <kbd className="bg-[#181818] border border-[#2A2A2A] px-1.5 py-0.5 text-[#888888]">↵</kbd> to select
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="uppercase text-[9px] tracking-wider text-[#777777]">COMMAND PALETTE ACTIVE</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
