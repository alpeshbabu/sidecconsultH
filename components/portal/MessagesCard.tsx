"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  authorRole: "ADMIN" | "CLIENT";
  body: string;
  createdAt: string;
}

interface MessagesCardProps {
  /** Messages API, e.g. /api/portal/projects/<id>/messages */
  basePath: string;
  /** The viewer's role — their own messages align right. */
  currentRole: "ADMIN" | "CLIENT";
}

const LABEL = "font-mono text-xs uppercase tracking-[0.12em]";

export function MessagesCard({ basePath, currentRole }: MessagesCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(basePath);
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch {
      /* non-fatal */
    } finally {
      setIsLoading(false);
    }
  }, [basePath]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  const send = async () => {
    const text = body.trim();
    if (!text) return;
    setSending(true);
    try {
      const res = await fetch(basePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to send message");
        return;
      }
      setBody("");
      load();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const authorName = (role: "ADMIN" | "CLIENT") =>
    role === "ADMIN" ? "SIDEC Team" : "Client";

  return (
    <Card className="card-technical rounded-none">
      <CardHeader>
        <CardTitle className="font-display text-lg">Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-signal" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-signal opacity-70" />
              <p className={cn(LABEL, "text-muted-foreground")}>No messages yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start the conversation below.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.authorRole === currentRole;
              return (
                <div
                  key={m.id}
                  className={cn("flex flex-col", mine ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-sm border p-3 text-sm",
                      mine
                        ? "border-signal/40 bg-signal/10"
                        : "border-hairline bg-muted/40"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  </div>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {authorName(m.authorRole)} ·{" "}
                    {new Date(m.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 border-t border-hairline pt-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a message..."
            rows={3}
            className="rounded-sm border-hairline focus-visible:ring-signal"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
            }}
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              ⌘/Ctrl + Enter to send
            </span>
            <Button variant="technical" onClick={send} disabled={sending || !body.trim()}>
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
