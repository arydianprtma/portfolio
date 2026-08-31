"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", href: "#about", id: "about" },
    { label: "WORK", href: "#work", id: "work" },
    { label: "SKILLS", href: "#skills", id: "skills" },
    { label: "EXPERIMENTS", href: "#experiments", id: "experiments" },
    { label: "CONTACT", href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Detect active section on scroll
      const sectionIds = ["about", "work", "skills", "experiments", "contact"];
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1C1C1C] py-4"
          : "bg-transparent py-6 md:py-8 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group"
          data-cursor="link"
        >
          <Logo />
        </Link>

        {/* Desktop Nav Items with Active Scroll Indicator */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative font-mono text-xs uppercase tracking-widest transition-colors py-1 ${
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

        {/* Status / CTA Right */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="mailto:contact@developer.dev"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#F5F5F5] hover:text-[#E31B23] transition-colors border border-[#262626] hover:border-[#E31B23] px-3.5 py-1.5 bg-[#121212]"
            data-cursor="link"
          >
            <span>LET&apos;S TALK</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#E31B23]" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#F5F5F5] hover:text-[#E31B23] transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#0D0D0D] border-b border-[#222222] px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-3 font-mono text-sm">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;

                return (
                  <Link
                    key={link.label}
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
                  href="mailto:contact@developer.dev"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E31B23] text-white py-3 text-xs tracking-wider uppercase font-semibold"
                >
                  GET IN TOUCH
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
