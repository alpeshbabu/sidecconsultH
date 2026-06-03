"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortalShellProps {
  userName?: string | null;
  companyName?: string | null;
  children: React.ReactNode;
}

export function PortalShell({ userName, companyName, children }: PortalShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/portal";

  return (
    <div className="relative min-h-screen bg-muted/20">
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="grid-blueprint absolute inset-0 opacity-50" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/90 backdrop-blur">
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Link href="/portal" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-hairline text-signal">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold">
                SIDEC Client Portal
              </span>
              {companyName && (
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {companyName}
                </span>
              )}
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant={isDashboard ? "secondary" : "ghost"}
              size="sm"
              className="rounded-sm font-mono text-xs uppercase tracking-[0.1em]"
            >
              <Link href="/portal">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Projects
              </Link>
            </Button>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.1em]"
              onClick={() => signOut({ callbackUrl: "/portal/login", redirect: true })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container-wide py-8">{children}</main>
    </div>
  );
}
