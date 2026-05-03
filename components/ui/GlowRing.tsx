import React from "react";

interface GlowRingProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "sky" | "gold";
  className?: string;
}

export function GlowRing({
  children,
  size = "md",
  color = "sky",
  className = "",
}: GlowRingProps) {
  const sizeClass =
    size === "sm"
      ? "w-16 h-16"
      : size === "lg"
      ? "w-32 h-32"
      : size === "xl"
      ? "w-48 h-48"
      : "w-24 h-24";

  const glowClass =
    color === "blue"
      ? "shadow-[0_0_20px_rgba(46,168,255,0.4)]"
      : color === "gold"
      ? "shadow-[0_0_20px_rgba(245,185,66,0.4)]"
      : "shadow-[0_0_20px_rgba(56,189,248,0.4)]";

  return (
    <div
      className={`
        ${sizeClass}
        rounded-full overflow-hidden
        border-2 border-[var(--sky-blue)]
        ${glowClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}