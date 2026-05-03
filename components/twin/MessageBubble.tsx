"use client";

import Markdown from "react-markdown";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser 
            ? "bg-gradient-to-r from-[var(--blue-primary)] to-[var(--sky-blue)] text-white" 
            : "bg-[var(--bg-card)] border-l-3 border-[var(--sky-blue)] shadow-[var(--glow-sky)]"
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <Markdown>{content}</Markdown>
          </div>
        )}
        {timestamp && (
          <p className="text-xs text-[var(--text-muted)] mt-2 font-mono">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}