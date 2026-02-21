import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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

// Admin pages that don't require authentication
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const isPublicPage = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // Server-side JWT validation (defense-in-depth beyond the proxy cookie check).
  // The proxy checks cookie existence; this validates the actual JWT session.
  if (!isPublicPage) {
    const session = await auth();
    if (!session?.user) {
      redirect("/admin/login");
    }
  }

  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
