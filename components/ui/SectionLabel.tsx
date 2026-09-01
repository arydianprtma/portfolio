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
  // Cleanly extract number if already formatted in label e.g. "02 / KARYA PILIHAN"
  let displayNum = number ? number.replace(/\.$/, "") : "";
  let displayText = label;

  const match = label.match(/^(\d{2})\s*\/\s*(.*)$/);
  if (match) {
    displayNum = displayNum || match[1];
    displayText = match[2];
  }

  return (
    <div className={`flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#777777] mb-8 md:mb-12 ${className}`}>
      <span className="inline-block w-2.5 h-[2px] bg-[#E31B23]" />
      {displayNum ? (
        <>
          <span className="text-[#E31B23] font-semibold">{displayNum}</span>
          <span className="text-[var(--border)]">/</span>
        </>
      ) : null}
      <span className="text-[var(--foreground)] font-medium tracking-widest">{displayText}</span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--border)] to-transparent ml-2" />
    </div>
  );
};
