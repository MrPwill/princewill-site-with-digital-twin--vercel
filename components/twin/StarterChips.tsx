"use client";

interface StarterChipsProps {
  onSelect: (message: string) => void;
}

const starters = [
  "Tell me about yourself",
  "What's your most impressive project?",
  "How do you design multi-agent systems?",
  "What makes you different from other AI engineers?",
  "Are you available for freelance work?",
  "What's your experience with RAG pipelines?",
  "How have you delivered business value with AI?",
  "Walk me through your tech stack",
];

export function StarterChips({ onSelect }: StarterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {starters.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-4 py-2 text-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--sky-blue)] hover:shadow-[var(--glow-sky)] transition-all duration-200"
        >
          {text}
        </button>
      ))}
    </div>
  );
}