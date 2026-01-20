import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ClientAdminLayout } from "@/components/admin/ClientAdminLayout";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin - SIDEC Consulting",
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
