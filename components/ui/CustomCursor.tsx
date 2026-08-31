"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export type CursorType = "default" | "view" | "link" | "drag" | "hidden";

export const CustomCursor: React.FC = () => {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState(false);

  // Position motion values for fluid 60+ FPS tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, weighted trailing spring
  const springConfig = { damping: 28, stiffness: 260, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports fine pointer (mouse / trackpad)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check cursor trigger under pointer
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttrElement = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorAttrElement) {
        const type = cursorAttrElement.getAttribute("data-cursor") as CursorType;
        const text = cursorAttrElement.getAttribute("data-cursor-text") || "";
        setCursorType(type || "link");
        setCursorText(text || (type === "view" ? "VIEW" : ""));
        return;
      }

      const interactiveElement = target.closest("a, button, [role='button'], input, textarea");
      if (interactiveElement) {
        setCursorType("link");
        setCursorText("");
        return;
      }

      setCursorType("default");
      setCursorText("");
    };

    const handleMouseLeave = () => {
      setCursorType("hidden");
    };

    const handleMouseEnter = () => {
      setCursorType("default");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isEnabled || cursorType === "hidden") {
    return null;
  }

  // Define dynamic sizes and styling based on cursor mode
  const getVariants = () => {
    switch (cursorType) {
      case "view":
        return {
          width: 76,
          height: 76,
          backgroundColor: "#E31B23",
          borderColor: "#E31B23",
          scale: 1,
        };
      case "link":
        return {
          width: 44,
          height: 44,
          backgroundColor: "rgba(245, 245, 245, 0.08)",
          borderColor: "rgba(245, 245, 245, 0.5)",
          scale: 1,
        };
      case "drag":
        return {
          width: 64,
          height: 64,
          backgroundColor: "rgba(227, 27, 35, 0.9)",
          borderColor: "#E31B23",
          scale: 1,
        };
      case "default":
      default:
        return {
          width: 26,
          height: 26,
          backgroundColor: "transparent",
          borderColor: "rgba(245, 245, 245, 0.35)",
          scale: 1,
        };
    }
  };

  return (
    <>
      {/* Outer Follower Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={getVariants()}
        transition={{ type: "spring", damping: 24, stiffness: 280, mass: 0.25 }}
      >
        {cursorType === "view" && (
          <span className="font-mono text-[10px] font-bold tracking-widest text-white uppercase select-none">
            {cursorText || "VIEW"}
          </span>
        )}
      </motion.div>

      {/* Inner Dot Indicator (visible in default & link mode) */}
      {cursorType !== "view" && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 bg-[#E31B23] rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            x: mouseX,
            y: mouseY,
          }}
        />
      )}
    </>
  );
};
