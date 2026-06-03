"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="grid-blueprint absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
      </div>

      <div className="absolute left-4 top-4">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Website
          </Link>
        </Button>
      </div>

      <Card className="card-technical w-full max-w-md rounded-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-sm border border-hairline text-signal">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="eyebrow-plain mb-2 text-signal">
            <span aria-hidden>// </span>Client Portal
          </p>
          <CardTitle className="font-display text-2xl">
            {sent ? "Check your email" : "Sign in"}
          </CardTitle>
          <CardDescription>
            {sent
              ? "We've sent a secure sign-in link to your inbox."
              : "Enter your email and we'll send you a secure sign-in link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-sm border border-hairline bg-muted/40 p-4">
                <Mail className="h-5 w-5 shrink-0 text-signal" />
                <p className="text-sm text-muted-foreground">
                  If an account exists for{" "}
                  <span className="font-medium text-foreground">{email}</span>, a
                  one-time link is on its way. It expires in 15 minutes.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-center font-mono text-xs text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  className="rounded-sm border-hairline focus-visible:ring-signal"
                />
              </div>
              <Button
                type="submit"
                variant="technical"
                className="h-11 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send sign-in link"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 border border-hairline bg-muted/40 p-4 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              Passwordless &middot; Links are single-use and time-limited
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        © {new Date().getFullYear()} SIDEC Consulting
      </p>
    </div>
  );
}
