import React from "react";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "glow" | "pulse";
  color?: "blue" | "sky" | "gold";
  className?: string;
}

export function AnimatedBadge({
  children,
  variant = "default",
  color = "sky",
  className = "",
}: AnimatedBadgeProps) {
  const colorClass =
    color === "blue"
      ? "bg-[var(--blue-primary)]/20 text-[var(--blue-primary)] border-[var(--blue-primary)]"
      : color === "gold"
      ? "bg-[var(--gold-accent)]/20 text-[var(--gold-accent)] border-[var(--gold-accent)]"
      : "bg-[var(--sky-blue)]/20 text-[var(--sky-blue)] border-[var(--sky-blue)]";

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1
        text-xs font-medium uppercase tracking-wider
        border rounded-full
        ${colorClass}
        ${variant === "glow" ? "shadow-[var(--glow-sky)]" : ""}
        ${variant === "pulse" ? "animate-pulse" : ""}
        ${className}
      `}
    >
      {children}
    </span>
  );
}