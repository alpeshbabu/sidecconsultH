"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { X, RotateCcw, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatMessageList } from "./ChatMessageList";
import type { UIMessage } from "ai";

interface ChatbotPanelProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onSendMessage: (text: string) => void;
  onClose: () => void;
  onConversion: (type: "contact" | "schedule") => void;
  onNewChat: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "Help with ISO 13485",
  "Injection molding consulting",
  "Facility design help",
];

export function ChatbotPanel({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClose,
  onConversion,
  onNewChat,
}: ChatbotPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;
      onSendMessage(trimmed);
      setInput("");
    },
    [input, isLoading, onSendMessage]
  );

  const handleSuggestedClick = useCallback(
    (question: string) => {
      onSendMessage(question);
    },
    [onSendMessage]
  );

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[60] flex flex-col",
        "w-[380px] h-[520px]",
        "sm:w-[400px] sm:h-[560px]",
        "max-sm:inset-x-3 max-sm:bottom-3 max-sm:w-auto max-sm:h-[80vh]",
        "max-h-[calc(100vh-3rem)]",
        "rounded-2xl border bg-card shadow-2xl",
        "animate-in slide-in-from-bottom-4 fade-in duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="font-semibold text-sm">SIDEC Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNewChat}
            title="New conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            title="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onConversion={onConversion}
        suggestedQuestions={messages.length === 0 ? SUGGESTED_QUESTIONS : undefined}
        onSuggestedClick={messages.length === 0 ? handleSuggestedClick : undefined}
      />

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 text-xs text-destructive bg-destructive/10 border-t shrink-0">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t shrink-0"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our services..."
          className="flex-1 text-sm"
          disabled={isLoading}
          maxLength={500}
        />
        <Button
          type="submit"
          size="icon-sm"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
