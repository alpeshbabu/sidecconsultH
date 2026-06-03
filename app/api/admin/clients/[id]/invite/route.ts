import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { createMagicLink } from "@/lib/magic-link";
import { sendEmail } from "@/lib/email";
import { portalInviteEmail } from "@/lib/email-templates";

// POST /api/admin/clients/[id]/invite — (re)send a portal sign-in link
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const client = await prisma.user.findFirst({ where: { id, role: "CLIENT" } });
  if (!client) {
    return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
  }

  const token = await createMagicLink(client.id);
  const base = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  const link = `${base}/portal/auth/verify?token=${token}&email=${encodeURIComponent(
    client.email
  )}`;
  const tpl = portalInviteEmail({ name: client.name, link });

  try {
    await sendEmail({ to: client.email, subject: tpl.subject, html: tpl.html });
  } catch (err) {
    console.error("Failed to send portal invite:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send invite email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Invite sent" });
}
