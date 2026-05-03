import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="h-1 w-20 bg-gradient-to-r from-[var(--blue-primary)] to-[var(--sky-blue)] rounded mt-4 mx-auto" />
    </div>
  );
}