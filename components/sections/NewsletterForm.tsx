"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Mail } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="surface-ink relative mt-12 overflow-hidden border border-hairline p-8 md:p-10">
      <div className="grid-blueprint absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-md text-center">
        <p className="eyebrow-plain mb-4 text-signal">
          <span aria-hidden>// </span>Newsletter
        </p>
        <h3 className="font-display text-2xl font-semibold text-ink-foreground">
          Stay Updated on Industry Trends
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-muted">
          Subscribe for the latest insights on medical device manufacturing and
          regulatory updates.
        </p>

        {message?.type === "success" ? (
          <div className="mt-6 flex items-center justify-center gap-2 font-mono text-sm text-signal">
            <CheckCircle className="h-5 w-5" />
            <span>{message.text}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="flex h-11 w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2 text-sm text-ink-foreground placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal disabled:opacity-50"
            />
            <Button type="submit" variant="signal" disabled={isLoading} className="h-11 shrink-0">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        )}

        {message?.type === "error" && (
          <p className="mt-3 font-mono text-sm text-destructive">{message.text}</p>
        )}
      </div>
    </div>
  );
}
