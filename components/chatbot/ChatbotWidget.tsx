"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { ChatbotButton } from "./ChatbotButton";
import { ChatbotPanel } from "./ChatbotPanel";
import {
  trackChatbotOpen,
  trackChatbotMessage,
  trackChatbotConversion,
  trackChatbotClose,
} from "@/lib/analytics";

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Don't render on admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  // Initialize session ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem("sidec_chat_session");
    if (!id) {
      id = generateSessionId();
      localStorage.setItem("sidec_chat_session", id);
    }
    setSessionId(id);
  }, []);

  // Create transport with custom fetch to intercept conversation ID header
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          sessionId,
          conversationId: conversationIdRef.current,
          pageUrl: pathname,
        }),
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const newConvId = response.headers.get("X-Conversation-Id");
          if (newConvId && newConvId !== conversationIdRef.current) {
            conversationIdRef.current = newConvId;
            setConversationId(newConvId);
          }
          return response;
        },
      }),
    [sessionId, pathname]
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
  } = useChat({
    transport,
    onFinish: () => {
      trackChatbotMessage(messages.length + 1);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    trackChatbotOpen();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    trackChatbotClose(messages.length);
  }, [messages.length]);

  const handleConversion = useCallback(
    async (type: "contact" | "schedule") => {
      if (conversationId) {
        fetch("/api/chat/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, convertedTo: type }),
        }).catch(console.error);
      }
      trackChatbotConversion(type);
    },
    [conversationId]
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    conversationIdRef.current = null;
    const newId = generateSessionId();
    localStorage.setItem("sidec_chat_session", newId);
    setSessionId(newId);
  }, [setMessages]);

  if (isAdminPage) return null;

  return (
    <>
      {!isOpen && <ChatbotButton onClick={handleOpen} />}
      {isOpen && (
        <ChatbotPanel
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          onClose={handleClose}
          onConversion={handleConversion}
          onNewChat={handleNewChat}
        />
      )}
    </>
  );
}
