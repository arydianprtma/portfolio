import React from "react";

interface SectionLabelProps {
  label: string;
  number?: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  number,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#777777] mb-8 md:mb-12 ${className}`}>
      <span className="inline-block w-2.5 h-[2px] bg-[#E31B23]" />
      {number && <span className="text-[#E31B23] font-semibold">{number}</span>}
      <span className="text-[#F5F5F5] font-medium tracking-widest">{label}</span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-[#222222] to-transparent ml-2" />
    </div>
  );
};
