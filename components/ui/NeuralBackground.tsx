import React from "react";

interface NeuralBackgroundProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function NeuralBackground({
  children,
  className = "",
  intensity = "medium",
}: NeuralBackgroundProps) {
  const intensityClass =
    intensity === "low"
      ? "bg-[radial-gradient(ellipse_at_20%_50%,rgba(109,74,255,0.04)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(46,168,255,0.03)_0%,transparent_55%)]"
      : intensity === "high"
      ? "bg-[radial-gradient(ellipse_at_20%_50%,rgba(109,74,255,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(46,168,255,0.10)_0%,transparent_55%)]"
      : "bg-[radial-gradient(ellipse_at_20%_50%,rgba(109,74,255,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(46,168,255,0.06)_0%,transparent_55%)]";

  return (
    <div
      className={`
        relative min-h-screen
        bg-[var(--bg-base)]
        ${intensityClass}
        ${className}
      `}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}