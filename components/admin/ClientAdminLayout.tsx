"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Import AdminLayoutWrapper as client-only to prevent hydration issues
const AdminLayoutWrapper = dynamic(
  () => import("./AdminLayoutWrapper").then((mod) => mod.AdminLayoutWrapper),
  { ssr: false }
);

interface ClientAdminLayoutProps {
  children: ReactNode;
}

export function ClientAdminLayout({ children }: ClientAdminLayoutProps) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
