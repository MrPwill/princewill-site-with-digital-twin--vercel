import React from "react";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function GradientButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: GradientButtonProps) {
  const variantClass =
    variant === "accent"
      ? "bg-gradient-to-r from-[#6D4AFF] to-[#F5B942]"
      : variant === "ghost"
      ? "bg-transparent border border-[var(--blue-primary)] text-[var(--blue-primary)] hover:bg-[var(--blue-primary)]/10"
      : "bg-gradient-to-r from-[#2EA8FF] to-[#6D4AFF] text-white";

  const sizeClass =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
      ? "px-8 py-4 text-lg"
      : "px-6 py-3 text-base";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClass}
        ${sizeClass}
        rounded-lg
        font-medium
        transition-all duration-300
        hover:opacity-90
        hover:shadow-[var(--glow-blue)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}