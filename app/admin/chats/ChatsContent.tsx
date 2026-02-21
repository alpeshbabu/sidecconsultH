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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
  CONVERTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
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
          <h1 className="text-2xl font-bold tracking-tight">Chat Transcripts</h1>
          <p className="text-sm text-muted-foreground">
            View AI chatbot conversations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
          <span className="text-sm text-muted-foreground">
            {pagination.total} conversation{pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Conversations Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bot className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openTranscript(conv.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", statusColors[conv.status])}
                      >
                        {conv.status}
                      </Badge>
                      {conv.convertedTo && (
                        <Badge variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {conv.convertedTo}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.pageUrl || "Unknown page"} &middot;{" "}
                      {conv.messageCount} message{conv.messageCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(conv.createdAt)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchConversations(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
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
          <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 shrink-0">
              <div>
                <CardTitle className="text-lg">Chat Transcript</CardTitle>
                {selectedChat && (
                  <CardDescription>
                    {formatDate(selectedChat.createdAt)} &middot;{" "}
                    {selectedChat.messageCount} messages
                    {selectedChat.pageUrl && ` &middot; ${selectedChat.pageUrl}`}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-1">
                {selectedChat && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteConversation(selectedChat.id)}
                    title="Delete conversation"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedChat(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-6">
              {isLoadingDetail ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : selectedChat?.messages?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
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
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        msg.role === "assistant"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
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
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                        msg.role === "assistant"
                          ? "rounded-tl-sm bg-muted"
                          : "rounded-tr-sm bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
