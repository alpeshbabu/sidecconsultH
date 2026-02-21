"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatbotButtonProps {
  onClick: () => void;
}

export function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full shadow-lg
                 hover:shadow-xl transition-all duration-300 hover:scale-105"
      size="icon"
      aria-label="Open chat assistant"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
