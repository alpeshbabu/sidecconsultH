import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: {
    default: "Client Portal",
    template: "%s | SIDEC Client Portal",
  },
  robots: { index: false, follow: false },
};

export default async function PortalAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/portal/login");
  }
  // Only CLIENT users belong here; admins go to their dashboard.
  if (session.user.role !== "CLIENT") {
    redirect("/admin/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, companyName: true },
  });

  return (
    <PortalShell userName={user?.name} companyName={user?.companyName}>
      {children}
    </PortalShell>
  );
}
