"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Globe, Radio } from "lucide-react";

export const LiveClockWidget: React.FC = () => {
  const [time, setTime] = useState<string>("");
  const [dayName, setDayName] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format Time HH:MM:SS
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);

      // Day of Week
      const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
      setDayName(days[now.getDay()]);

      // Full Date: DD MMMM YYYY
      const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];
      const day = String(now.getDate()).padStart(2, "0");
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setDateStr(`${day} ${month} ${year}`);

      // Timezone string
      const offset = -now.getTimezoneOffset() / 60;
      const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
      setTimezone(`${offsetStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#101010] border border-[#1F1F1F] p-5 sm:p-6 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      {/* Left: Time & Active Pulse */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#161616] border border-[#2B2B2B] flex items-center justify-center text-[#E31B23] shrink-0">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#666666] uppercase tracking-widest">
            <Radio className="w-3 h-3 text-[#E31B23]" />
            <span>LOCAL SYSTEM TIME</span>
          </div>

          <div className="font-display font-black text-2xl sm:text-3xl text-[#F5F5F5] tracking-wider mt-0.5">
            {time || "00:00:00"}
          </div>
        </div>
      </div>

      {/* Right: Full Calendar Date & Timezone */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-t md:border-t-0 border-[#1A1A1A] pt-4 md:pt-0">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-[#777777]" />
          <div>
            <span className="text-[10px] text-[#E31B23] font-bold tracking-wider block">
              {dayName || "TODAY"}
            </span>
            <span className="text-xs text-[#F5F5F5] font-semibold tracking-wide">
              {dateStr || "01 JANUARY 2026"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#141414] border border-[#242424] px-3 py-1.5 text-[11px] text-[#A0A0A0]">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{timezone || "UTC+7"}</span>
          <span className="text-[10px] text-emerald-400">● LIVE</span>
        </div>
      </div>
    </div>
  );
};
