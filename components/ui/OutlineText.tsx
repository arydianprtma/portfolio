import React from "react";

interface OutlineTextProps {
  text: string;
  className?: string;
  thick?: boolean;
}

export const OutlineText: React.FC<OutlineTextProps> = ({
  text,
  className = "",
  thick = false,
}) => {
  return (
    <span
      className={`font-display uppercase select-none pointer-events-none tracking-tighter ${
        thick ? "text-outline-stroke-thick" : "text-outline-stroke"
      } ${className}`}
      aria-hidden="true"
    >
      {text}
    </span>
  );
};
