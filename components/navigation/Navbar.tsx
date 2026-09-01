"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 5 core navigation links for balanced spacing
  const navLinks = [
    { label: t.nav.about, href: "/#about", id: "about" },
    { label: t.nav.work, href: "/#work", id: "work" },
    { label: t.nav.skills, href: "/#skills", id: "skills" },
    { label: t.nav.blog, href: "/#blog", id: "blog" },
    { label: t.nav.contact, href: "/#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Detect active section on scroll
      const sectionIds = ["about", "work", "skills", "blog", "contact"];
      const scrollPosition = window.scrollY + 200;

      let current = "";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
            break;
          }
        }
      }

      // Check if user is at the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        current = "contact";
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1C1C1C] py-3.5"
          : "bg-transparent py-5 md:py-7 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group shrink-0"
          data-cursor="link"
        >
          <Logo />
        </Link>

        {/* Desktop Nav Items with Balanced Spacing */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`group relative font-mono text-[11px] xl:text-xs uppercase tracking-widest transition-colors py-1 ${
                  isActive
                    ? "text-[#F5F5F5] font-semibold"
                    : "text-[#777777] hover:text-[#F5F5F5]"
                }`}
                data-cursor="link"
              >
                <span
                  className={`text-[#E31B23] mr-1 text-[10px] transition-opacity duration-300 ${
                    isActive ? "opacity-100 font-bold" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  0{idx + 1}.
                </span>
                <span>{link.label}</span>

                {/* Animated Bottom Indicator Line */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#E31B23] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Compact Language + Search + CTA */}
        <div className="hidden sm:flex items-center gap-3.5 shrink-0">
          {/* Minimalist Language Switcher */}
          <LanguageSwitcher />

          <span className="h-3 w-[1px] bg-[#222222]" />

          {/* Compact Command Palette Search Trigger */}
          <button
            onClick={handleOpenSearch}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#777777] hover:text-[#F5F5F5] p-1.5 hover:bg-[#141414] border border-transparent hover:border-[#222222] transition-colors group"
            title="Search (Ctrl + K)"
            aria-label="Search"
            data-cursor="link"
          >
            <Search className="w-3.5 h-3.5 text-[#E31B23] group-hover:scale-110 transition-transform" />
            <kbd className="text-[9px] bg-[#161616] text-[#666666] border border-[#262626] px-1 py-0.2">
              ⌘K
            </kbd>
          </button>

          {/* Direct Contact Button */}
          <a
            href="mailto:arydianprtma@gmail.com"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] xl:text-xs uppercase tracking-wider text-[#F5F5F5] hover:text-[#E31B23] transition-colors border border-[#262626] hover:border-[#E31B23] px-3.5 py-1.5 bg-[#121212]"
            data-cursor="link"
          >
            <span>{t.nav.letsTalk}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#E31B23]" />
          </a>
        </div>

        {/* Mobile Right Controls: Language + Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#F5F5F5] hover:text-[#E31B23] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-[#0D0D0D] border-b border-[#222222] px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-3 font-mono text-sm">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenSearch();
                }}
                className="flex items-center justify-between p-3 bg-[#141414] border border-[#262626] text-xs text-[#888888] mb-2"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#E31B23]" />
                  <span>{t.palette.searchPlaceholder}</span>
                </span>
                <kbd className="text-[10px] bg-[#222222] text-[#888888] px-1.5 py-0.5 border border-[#333333]">
                  ⌘K
                </kbd>
              </button>

              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-2 border-b border-[#1A1A1A] transition-all ${
                      isActive
                        ? "text-[#F5F5F5] bg-[#161616] border-l-2 border-l-[#E31B23] pl-3 font-semibold"
                        : "text-[#888888] hover:text-[#F5F5F5] hover:pl-2"
                    }`}
                  >
                    <span>
                      <span className="text-[#E31B23] mr-2">0{idx + 1}.</span>
                      {link.label}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 ${isActive ? "text-[#E31B23]" : "text-[#777777]"}`} />
                  </Link>
                );
              })}
              <div className="pt-2">
                <a
                  href="mailto:arydianprtma@gmail.com"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E31B23] text-white py-3 text-xs tracking-wider uppercase font-semibold"
                >
                  {t.nav.letsTalk}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
