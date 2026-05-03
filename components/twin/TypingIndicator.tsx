"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[var(--bg-card)] border-l-3 border-[var(--sky-blue)] rounded-2xl px-4 py-4 flex items-center gap-1">
        <span className="w-2 h-2 bg-[var(--sky-blue)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-[var(--sky-blue)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-[var(--sky-blue)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}