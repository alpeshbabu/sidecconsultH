"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bot,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface ChatConversation {
  id: string;
  sessionId: string;
  status: string;
  pageUrl: string | null;
  convertedTo: string | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const statusChipBase =
  "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
  CLOSED: "bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/30",
  CONVERTED: "bg-primary/10 text-primary border border-primary/30",
};

export function ChatsContent() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchConversations = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/admin/chats?${params}`);
        const data = await res.json();

        if (data.success) {
          setConversations(data.data);
          setPagination(data.pagination);
        }
      } catch {
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const openTranscript = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/chats/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedChat(data.data);
      }
    } catch {
      toast.error("Failed to load transcript");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Delete this conversation and all its messages?")) return;
    try {
      const res = await fetch(`/api/admin/chats/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Conversation deleted");
        setSelectedChat(null);
        fetchConversations(pagination?.page || 1);
      }
    } catch {
      toast.error("Failed to delete conversation");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            AI Chatbot
          </p>
          <h1 className="font-display text-2xl tracking-tight">Chat Transcripts</h1>
          <p className="text-sm text-muted-foreground">
            View AI chatbot conversations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className={cn(
              "w-[160px] rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60",
              statusFilter !== "all" && "border-signal bg-signal/10 text-foreground"
            )}
          >
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
          </SelectContent>
        </Select>
        {pagination && (
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {pagination.total} conversation{pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Conversations Table */}
      <div className="border border-hairline">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-signal" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="h-10 w-10 mx-auto mb-3 text-signal opacity-60" />
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              No conversations yet
            </p>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => openTranscript(conv.id)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hairline-b hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(statusChipBase, statusColors[conv.status])}>
                      {conv.status}
                    </span>
                    {conv.convertedTo && (
                      <span
                        className={cn(
                          statusChipBase,
                          "border border-hairline text-muted-foreground"
                        )}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {conv.convertedTo}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.pageUrl || "Unknown page"} &middot;{" "}
                    {conv.messageCount} message{conv.messageCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(conv.createdAt)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
            disabled={pagination.page <= 1}
            onClick={() => fetchConversations(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs tracking-[0.12em] text-signal">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
            disabled={!pagination.hasMore}
            onClick={() => fetchConversations(pagination.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Transcript Dialog (modal overlay) */}
      {(selectedChat || isLoadingDetail) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card-technical rounded-sm w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
            <div className="flex items-center justify-between gap-4 p-6 pb-3 shrink-0 hairline-b">
              <div>
                <h2 className="font-display text-lg tracking-tight">Chat Transcript</h2>
                {selectedChat && (
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {formatDate(selectedChat.createdAt)} &middot;{" "}
                    {selectedChat.messageCount} messages
                    {selectedChat.pageUrl && ` · ${selectedChat.pageUrl}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {selectedChat && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-sm hover:text-signal"
                    onClick={() => deleteConversation(selectedChat.id)}
                    title="Delete conversation"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-sm hover:text-signal"
                  onClick={() => setSelectedChat(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-6 pt-4">
              {isLoadingDetail ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-signal" />
                </div>
              ) : selectedChat?.messages?.length === 0 ? (
                <p className="text-center font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground py-8">
                  No messages in this conversation
                </p>
              ) : (
                selectedChat?.messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border",
                        msg.role === "assistant"
                          ? "border-hairline bg-muted/40 text-foreground"
                          : "border-signal/30 bg-signal/10 text-signal"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-sm border px-3 py-2 text-sm whitespace-pre-wrap",
                        msg.role === "assistant"
                          ? "border-hairline bg-muted/40"
                          : "border-signal/30 bg-signal/10"
                      )}
                    >
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        {msg.role === "assistant" ? "Assistant" : "User"}
                        <span className="ml-2 text-muted-foreground/70">
                          {formatDate(msg.createdAt)}
                        </span>
                      </p>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
