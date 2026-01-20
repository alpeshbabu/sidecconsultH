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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

// Admin navigation items
const navItems = [
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
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold">SIDEC</span>
                <span className="text-xs text-muted-foreground">Admin</span>
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.disabled && "cursor-not-allowed opacity-50",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isCollapsed && "h-5 w-5")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                    {item.disabled && (
                      <span className="text-xs text-muted-foreground">Soon</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse/Expand Toggle */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "w-full h-10 hover:bg-primary/10",
              isCollapsed && "bg-muted"
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
          <div className="border-t p-4">
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full text-xs" size="sm">
                View Website
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AdminSidebar;
