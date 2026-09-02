"use client";

import React, { useState } from "react";
import { Eye, Activity, TrendingUp, FileDown } from "lucide-react";
import { PeriodStats } from "@/types";

interface AnalyticsStatsCardProps {
  pageViewsBreakdown?: PeriodStats;
  cvDownloadsBreakdown?: PeriodStats;
  initialPageViews: number;
  initialCvDownloads: number;
}

type PeriodFilter = "today" | "7d" | "30d" | "all";

export const AnalyticsStatsCard: React.FC<AnalyticsStatsCardProps> = ({
  pageViewsBreakdown,
  cvDownloadsBreakdown,
  initialPageViews,
  initialCvDownloads,
}) => {
  const [filter, setFilter] = useState<PeriodFilter>("7d");

  // Get current filtered page views
  const getPageViews = (): number => {
    if (!pageViewsBreakdown) return initialPageViews;
    switch (filter) {
      case "today":
        return pageViewsBreakdown.today;
      case "7d":
        return pageViewsBreakdown.last7Days;
      case "30d":
        return pageViewsBreakdown.last30Days;
      case "all":
      default:
        return pageViewsBreakdown.allTime;
    }
  };

  // Get current filtered CV downloads
  const getCvDownloads = (): number => {
    if (!cvDownloadsBreakdown) return initialCvDownloads;
    switch (filter) {
      case "today":
        return cvDownloadsBreakdown.today;
      case "7d":
        return cvDownloadsBreakdown.last7Days;
      case "30d":
        return cvDownloadsBreakdown.last30Days;
      case "all":
      default:
        return cvDownloadsBreakdown.allTime;
    }
  };

  const currentViews = getPageViews();
  const currentDownloads = getCvDownloads();
  const conversionRate = currentViews > 0 ? ((currentDownloads / currentViews) * 100).toFixed(1) : "0";

  const getPeriodLabel = (): string => {
    switch (filter) {
      case "today":
        return "Hari Ini (24 Jam Terakhir)";
      case "7d":
        return "7 Hari Terakhir";
      case "30d":
        return "30 Hari Terakhir";
      case "all":
      default:
        return "Sepanjang Waktu (All Time)";
    }
  };

  return (
    <>
      {/* 1. Total Website Visits Card with Filter Pills */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-5 sm:p-6 flex flex-col justify-between gap-4 group hover:border-[#E31B23]/40 transition-colors">
        <div className="flex items-center justify-between gap-2 border-b border-[#1A1A1A] pb-3">
          <div className="flex items-center gap-1.5 text-[#777777] uppercase tracking-wider text-[11px]">
            <Eye className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>TOTAL WEB VISITS</span>
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#161616] p-0.5 border border-[#262626]">
            <button
              type="button"
              onClick={() => setFilter("today")}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                filter === "today"
                  ? "bg-[#E31B23] text-white"
                  : "text-[#777777] hover:text-[#F5F5F5]"
              }`}
              title="Filter 24 Jam Terakhir"
            >
              24H
            </button>
            <button
              type="button"
              onClick={() => setFilter("7d")}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                filter === "7d"
                  ? "bg-[#E31B23] text-white"
                  : "text-[#777777] hover:text-[#F5F5F5]"
              }`}
              title="Filter 7 Hari Terakhir"
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => setFilter("30d")}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                filter === "30d"
                  ? "bg-[#E31B23] text-white"
                  : "text-[#777777] hover:text-[#F5F5F5]"
              }`}
              title="Filter 30 Hari Terakhir"
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                filter === "all"
                  ? "bg-[#E31B23] text-white"
                  : "text-[#777777] hover:text-[#F5F5F5]"
              }`}
              title="Semua Waktu"
            >
              ALL
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#F5F5F5] block tracking-tight">
              {currentViews.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 inline-flex items-center gap-1.5">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>{getPeriodLabel()}</span>
            </span>
          </div>

          <div className="w-11 h-11 bg-[#161616] border border-[#262626] flex items-center justify-center text-[#E31B23] shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Total CV Downloads Card */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-5 sm:p-6 flex flex-col justify-between gap-4 group hover:border-[#E31B23]/40 transition-colors">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
          <div className="flex items-center gap-1.5 text-[#777777] uppercase tracking-wider text-[11px]">
            <FileDown className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>CV / RESUME DOWNLOADS</span>
          </div>
          <span className="text-[10px] text-[#666666] font-mono uppercase">
            {filter === "today" ? "24H" : filter === "7d" ? "7 DAYS" : filter === "30d" ? "30 DAYS" : "ALL"}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#F5F5F5] block tracking-tight">
              {currentDownloads.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#888888] font-mono mt-1 block">
              Conversion: <span className="text-[#E31B23] font-semibold">{conversionRate}%</span>
            </span>
          </div>

          <div className="w-11 h-11 bg-[#161616] border border-[#262626] flex items-center justify-center text-[#E31B23] shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </>
  );
};
