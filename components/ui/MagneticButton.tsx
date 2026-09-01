"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  target?: string;
  download?: boolean | string;
  rel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  className = "",
  variant = "primary",
  target,
  download,
  rel,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      "bg-[var(--foreground)] text-[var(--background)] hover:bg-[#E31B23] hover:text-white border border-transparent transition-colors duration-300 font-semibold",
    secondary:
      "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:border-[#E31B23] border border-[var(--border)] transition-all duration-300",
    outline:
      "bg-transparent text-[var(--foreground)] hover:text-[#E31B23] hover:border-[#E31B23] border border-[var(--border)] transition-all duration-300",
    ghost:
      "bg-transparent text-[var(--muted)] hover:text-[var(--foreground)] border border-transparent transition-colors duration-200",
  };

  const content = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.2 }}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-none text-xs md:text-sm font-mono uppercase tracking-wider cursor-pointer select-none ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        download={download}
        rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return content;
};
