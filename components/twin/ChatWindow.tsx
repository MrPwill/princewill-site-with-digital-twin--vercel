"use client";

import { useState, useRef, useEffect } from "react";
import { profileData } from "@/data/profile";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { InputBar } from "./InputBar";
import { StarterChips } from "./StarterChips";
import { readStream } from "@/lib/twin/stream";
import { getOrCreateSessionId, clearSessionId } from "@/lib/twin/memory";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForFirstChunk, setIsWaitingForFirstChunk] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (hasInteracted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, [messages.length, hasInteracted]);
  
  const handleSend = async (content: string) => {
    if (!sessionId) return;
    
    setHasInteracted(true);
    
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsWaitingForFirstChunk(true);
    
    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/twin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          session_id: sessionId,
          history: history,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      await readStream(response, {
        onChunk: (text) => {
          setIsWaitingForFirstChunk(false);
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "assistant") {
              updated[updated.length - 1] = {
                ...lastMsg,
                content: lastMsg.content + text,
              };
            }
            return updated;
          });
        },
        onDone: () => {
          setIsLoading(false);
          setIsWaitingForFirstChunk(false);
        },
        onError: (error) => {
          setIsLoading(false);
          setIsWaitingForFirstChunk(false);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
              timestamp: new Date(),
            },
          ]);
        },
      });
    } catch (error) {
      setIsLoading(false);
      setIsWaitingForFirstChunk(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your message. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };
  
  const handleNewConversation = async () => {
    if (sessionId) {
      try {
        const url = new URL("/api/twin", window.location.origin);
        url.searchParams.set("session_id", sessionId);
        await fetch(url.toString(), {
          method: "DELETE",
        });
      } catch {
        // Ignore errors
      }
    }
    clearSessionId();
    setSessionId(getOrCreateSessionId());
    setMessages([]);
  };
  
  return (
    <div className="flex flex-col min-h-[500px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--sky-blue)] shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            <img
              src={profileData.photo}
              alt={profileData.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Digital Twin</h3>
            <p className="text-xs text-[var(--text-muted)]">AI representation of Princewill</p>
          </div>
        </div>
        <button
          onClick={handleNewConversation}
          className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] rounded-lg transition-colors"
        >
          New Conversation
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)] mb-4">
              Ask me anything about Princewill&apos;s experience, projects, or skills!
            </p>
            <div className="flex justify-center">
              <StarterChips onSelect={handleSend} />
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        
        {isWaitingForFirstChunk && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}