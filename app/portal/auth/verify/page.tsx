"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "error">("verifying");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // guard StrictMode double-invoke (token is single-use)
    ran.current = true;

    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) {
      setStatus("error");
      return;
    }

    signIn("magic-link", { email, token, redirect: false })
      .then((result) => {
        if (result?.error) {
          setStatus("error");
          return;
        }
        router.push("/portal");
        router.refresh();
      })
      .catch(() => setStatus("error"));
  }, [params, router]);

  return (
    <Card className="card-technical w-full max-w-md rounded-none">
      <CardHeader className="text-center">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-sm border border-hairline ${
            status === "error" ? "text-destructive" : "text-signal"
          }`}
        >
          {status === "error" ? (
            <XCircle className="h-7 w-7" />
          ) : (
            <ShieldCheck className="h-7 w-7" />
          )}
        </div>
        <CardTitle className="font-display text-2xl">
          {status === "error" ? "Link expired or invalid" : "Signing you in..."}
        </CardTitle>
        <CardDescription>
          {status === "error"
            ? "This sign-in link is invalid, already used, or has expired."
            : "Please wait while we verify your secure link."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" ? (
          <Button
            asChild
            variant="technical"
            className="h-11 w-full"
          >
            <Link href="/portal/login">Request a new link</Link>
          </Button>
        ) : (
          <div className="flex items-center justify-center py-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PortalVerifyPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="grid-blueprint absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <VerifyInner />
      </Suspense>
    </div>
  );
}
