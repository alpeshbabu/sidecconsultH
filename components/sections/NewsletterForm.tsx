"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

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
    <div className="mt-12 grid gap-6 rounded-lg border border-hairline bg-muted/30 p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-8">
      <div>
        <p className="eyebrow mb-3">Newsletter</p>
        <h3 className="font-display text-xl font-semibold text-foreground">
          Molding insights, in your inbox
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Practical guidance on scientific molding, quality systems, and validation for
          injection molding manufacturing.
        </p>
      </div>
      <div className="w-full md:w-[26rem]">

        {message?.type === "success" ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="h-5 w-5" />
            <span>{message.text}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              aria-label="Email address"
              className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            <Button type="submit" disabled={isLoading} className="h-11 shrink-0">
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
          <p className="mt-3 text-sm text-destructive">{message.text}</p>
        )}
      </div>
    </div>
  );
}
