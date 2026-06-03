"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Mail,
  Bot,
  Users,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Nav item type
interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
  badge?: string;
}

// Admin navigation items
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Subscribers",
    href: "/admin/subscribers",
    icon: Mail,
  },
  {
    title: "Chat Transcripts",
    href: "/admin/chats",
    icon: Bot,
  },
  {
    title: "Blog Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Sparkles,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "surface-ink fixed left-0 top-0 z-40 h-screen border-r border-white/10 transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-white/10 px-4",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 text-signal">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-wide text-ink-foreground">
                  SIDEC
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-ink-foreground"
                    : "text-ink-muted hover:bg-white/5 hover:text-ink-foreground",
                  item.disabled && "cursor-not-allowed opacity-50",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
                title={isCollapsed ? item.title : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 bg-signal" />
                )}
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-signal")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-sm bg-destructive px-2 py-0.5 font-mono text-[10px] text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                    {item.disabled && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                        Soon
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse/Expand Toggle */}
        <div className="border-t border-white/10 p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-10 w-full rounded-sm text-ink-muted hover:bg-white/10 hover:text-ink-foreground",
              isCollapsed && "bg-white/5"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-white/10 p-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-sm border-white/20 bg-transparent font-mono text-[10px] uppercase tracking-[0.12em] text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
            >
              <Link href="/" target="_blank">
                View Website
              </Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;
