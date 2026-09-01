"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowRight,
  User,
  FolderGit2,
  Code2,
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  Globe,
  FileText,
  Terminal,
} from "lucide-react";
import { Project, Post } from "@/types";
import { trackCvDownload } from "@/components/analytics/PageTracker";
import { useLanguage } from "@/context/LanguageContext";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
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
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
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

  const handleToggleLang = () => {
    const nextLang = language === "en" ? "id" : "en";
    setLanguage(nextLang);
    setIsOpen(false);
  };

  // Build command list
  const baseItems: CommandItem[] = [
    // Navigation
    {
      id: "nav-about",
      title: "01 / " + t.nav.about,
      category: t.palette.quickNav,
      icon: User,
      description: t.about.whoAmI,
      perform: () => {
        router.push("/#about");
        setIsOpen(false);
      },
    },
    {
      id: "nav-work",
      title: "02 / " + t.nav.work,
      category: t.palette.quickNav,
      icon: FolderGit2,
      description: t.projects.headline,
      perform: () => {
        router.push("/#work");
        setIsOpen(false);
      },
    },
    {
      id: "nav-skills",
      title: "03 / " + t.nav.skills,
      category: t.palette.quickNav,
      icon: Code2,
      description: t.skills.headline,
      perform: () => {
        router.push("/#skills");
        setIsOpen(false);
      },
    },
    {
      id: "nav-blog",
      title: "04 / " + t.nav.blog,
      category: t.palette.quickNav,
      icon: BookOpen,
      description: t.blog.headline,
      perform: () => {
        router.push("/#blog");
        setIsOpen(false);
      },
    },
    {
      id: "nav-experiments",
      title: "05 / " + t.nav.experiments,
      category: t.palette.quickNav,
      icon: Sparkles,
      description: t.experiments.headline,
      perform: () => {
        router.push("/#experiments");
        setIsOpen(false);
      },
    },
    {
      id: "nav-contact",
      title: "06 / " + t.nav.contact,
      category: t.palette.quickNav,
      icon: ArrowRight,
      description: t.contact.headlinePart3,
      perform: () => {
        router.push("/#contact");
        setIsOpen(false);
      },
    },

    // Actions
    {
      id: "act-switch-lang",
      title: t.palette.switchLangTitle,
      category: t.palette.actions,
      icon: Globe,
      description: t.palette.switchLangDesc,
      shortcut: language === "en" ? "ID" : "EN",
      perform: handleToggleLang,
    },
    {
      id: "act-cv",
      title: t.palette.downloadCvTitle,
      category: t.palette.actions,
      icon: FileText,
      description: t.palette.downloadCvDesc,
      shortcut: "CV",
      perform: handleDownloadCv,
    },
    {
      id: "act-copy-email",
      title: copied ? t.palette.emailCopiedTitle : t.palette.copyEmailTitle,
      category: t.palette.actions,
      icon: copied ? Check : Copy,
      description: "arydianprtma@gmail.com",
      perform: handleCopyEmail,
    },
  ];

  // Dynamically map projects into command items
  const projectItems: CommandItem[] = projects.map((p) => ({
    id: `proj-${p.slug}`,
    title: `${t.palette.projects}: ${p.title}`,
    category: t.palette.projects,
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
    title: `${t.palette.articles}: ${a.title}`,
    category: t.palette.articles,
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
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].perform();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (listEl) {
      const activeEl = listEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-16 sm:pt-28 px-4 font-mono select-none">
          {/* Backdrop Blur Mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Terminal Command Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden z-10"
          >
            {/* Top Red Laser Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E31B23] to-transparent" />

            {/* Terminal Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border)] bg-[var(--background)] gap-3">
              <Search className="w-4 h-4 text-[#E31B23] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyNav}
                placeholder={t.palette.searchPlaceholder}
                className="w-full bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] text-xs sm:text-sm outline-none font-mono"
              />
              <kbd className="hidden sm:inline-block text-[10px] bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Command Results List */}
            <div
              ref={listRef}
              className="max-h-[380px] overflow-y-auto divide-y divide-[var(--border)] p-2"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[var(--muted)] text-xs">
                  <p>{t.palette.noCommandsFound} &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      data-index={idx}
                      onClick={() => item.perform()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? "bg-[var(--surface-hover)] text-[var(--foreground)] border-l-2 border-l-[#E31B23]"
                          : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`p-1.5 border transition-colors shrink-0 ${
                            isSelected
                              ? "bg-[var(--surface)] border-[#E31B23]/60 text-[#E31B23]"
                              : "bg-[var(--background)] border-[var(--border)] text-[var(--muted)]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-[var(--muted)] font-normal uppercase">
                              [{item.category}]
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="text-[10px] text-[#E31B23] font-bold uppercase hidden sm:inline">
                            EXECUTE
                          </span>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-[#E31B23]" : "text-[var(--muted)]"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Info Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--background)] border-t border-[var(--border)] text-[10px] text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-[#E31B23]" />
                <span className="uppercase">{t.palette.activeNotice}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">↑↓ NAVIGATE</span>
                <span>↵ SELECT</span>
                <span>ESC CLOSE</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
