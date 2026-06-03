import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { updateClientSchema } from "@/lib/validations";
import { deleteObjects } from "@/lib/storage";

async function getClientOr404(id: string) {
  return prisma.user.findFirst({ where: { id, role: "CLIENT" } });
}

// GET /api/admin/clients/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const client = await prisma.user.findFirst({
    where: { id, role: "CLIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      createdAt: true,
      lastLoginAt: true,
      projects: {
        select: { id: true, title: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: client });
}

// PUT /api/admin/clients/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await getClientOr404(id);
  if (!existing) {
    return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.email) {
    const normalized = data.email.toLowerCase().trim();
    if (normalized !== existing.email) {
      const clash = await prisma.user.findUnique({ where: { email: normalized } });
      if (clash) {
        return NextResponse.json(
          { success: false, error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }
    data.email = normalized;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.companyName !== undefined && {
        companyName: data.companyName?.trim() || null,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

// DELETE /api/admin/clients/[id]  — cascades to their projects/docs/messages
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await getClientOr404(id);
  if (!existing) {
    return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
  }

  // Best-effort storage cleanup for all of this client's project documents.
  const docs = await prisma.portalDocument.findMany({
    where: { project: { clientId: id } },
    select: { storagePath: true },
  });
  await deleteObjects(docs.map((d) => d.storagePath)).catch((err) =>
    console.error("Failed to delete client storage objects:", err)
  );

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
