"use client";

import { useRef, useEffect, type JSX } from "react";
import Link from "next/link";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UIMessage } from "ai";

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  onConversion: (type: "contact" | "schedule") => void;
  suggestedQuestions?: string[];
  onSuggestedClick?: (question: string) => void;
}

/** Extract plain text from a UIMessage's parts array */
function getMessageText(message: UIMessage): string {
  if (!message.parts) return "";
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("");
}

function renderMessageContent(
  content: string,
  onConversion: (type: "contact" | "schedule") => void
) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const text = match[1];
    const href = match[2];

    const handleClick = () => {
      if (href === "/contact") onConversion("contact");
      if (href === "/schedule") onConversion("schedule");
    };

    parts.push(
      <Link
        key={match.index}
        href={href}
        onClick={handleClick}
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {text}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

export function ChatMessageList({
  messages,
  isLoading,
  onConversion,
  suggestedQuestions,
  onSuggestedClick,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
              <p>
                Hi! I&apos;m the SIDEC Consulting assistant. I can help you
                learn about our medical device manufacturing consulting
                services. How can I help you today?
              </p>
            </div>
          </div>
          {suggestedQuestions && onSuggestedClick && (
            <div className="flex flex-wrap gap-2 pl-9">
              {suggestedQuestions.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3"
                  onClick={() => onSuggestedClick(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => {
        const text = getMessageText(message);
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                message.role === "assistant"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {message.role === "assistant" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                message.role === "assistant"
                  ? "rounded-tl-sm bg-muted"
                  : "rounded-tr-sm bg-primary text-primary-foreground"
              )}
            >
              {message.role === "assistant"
                ? renderMessageContent(text, onConversion)
                : text}
            </div>
          </div>
        );
      })}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
