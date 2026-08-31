import React from "react";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
        {/* Giant Watermark 404 Outline */}
        <div
          className="absolute inset-0 flex items-center justify-center font-display text-[160px] sm:text-[240px] md:text-[360px] font-black text-outline-stroke opacity-10 pointer-events-none select-none -z-10"
          aria-hidden="true"
        >
          404
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E31B23] mb-6 px-3.5 py-1.5 bg-[#141414] border border-[#262626]">
          <Terminal className="w-3.5 h-3.5" />
          <span className="tracking-widest">STATUS CODE: 404_NOT_FOUND</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] mb-4">
          LOST IN TRANSMISSION.
        </h1>

        <p className="text-[#888888] text-sm md:text-base max-w-md mb-10 font-light leading-relaxed">
          The requested route or sector does not exist or has been relocated to another workspace.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#F5F5F5] text-[#0A0A0A] hover:bg-[#E31B23] hover:text-white px-8 py-3.5 font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO HOMEPAGE</span>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
