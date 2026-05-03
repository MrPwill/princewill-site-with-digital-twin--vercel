import React from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "sky" | "gold";
}

export function GlowCard({
  children,
  className = "",
  glowColor = "sky",
}: GlowCardProps) {
  const glowClass =
    glowColor === "blue"
      ? "hover:shadow-[0_0_24px_rgba(46,168,255,0.25)]"
      : glowColor === "gold"
      ? "hover:shadow-[0_0_24px_rgba(245,185,66,0.25)]"
      : "hover:shadow-[0_0_24px_rgba(56,189,248,0.30)]";

  return (
    <div
      className={`
        bg-[var(--bg-card)] 
        border border-[var(--border-subtle)] 
        rounded-lg p-6 
        transition-all duration-300
        ${glowClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}