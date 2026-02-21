"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { cn } from "@/lib/utils";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should NOT have the admin layout (sidebar/topbar)
const noLayoutRoutes = ["/admin/login", "/admin/forgot-password"];

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current route should have admin layout
  const shouldShowLayout = !noLayoutRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // If this is a no-layout route (like login), just render children
  if (!shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop only */}
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Top Bar */}
      <AdminTopBar
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[260px]"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayoutWrapper;
