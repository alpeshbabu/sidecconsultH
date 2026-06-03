import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { updateProjectSchema } from "@/lib/validations";
import { deleteObjects } from "@/lib/storage";

// GET /api/admin/projects/[id] — full project with milestones, documents, messages
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true, companyName: true } },
      milestones: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      documents: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: project });
}

// PUT /api/admin/projects/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(d.title !== undefined && { title: d.title.trim() }),
      ...(d.description !== undefined && { description: d.description?.trim() || null }),
      ...(d.status !== undefined && { status: d.status }),
      ...(d.startDate !== undefined && { startDate: d.startDate ? new Date(d.startDate) : null }),
      ...(d.targetDate !== undefined && { targetDate: d.targetDate ? new Date(d.targetDate) : null }),
    },
    include: {
      client: { select: { id: true, name: true, email: true, companyName: true } },
    },
  });

  return NextResponse.json({ success: true, data: project });
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const existing = await prisma.project.findUnique({
    where: { id },
    include: { documents: { select: { storagePath: true } } },
  });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  // Best-effort storage cleanup before the cascading DB delete.
  await deleteObjects(existing.documents.map((d) => d.storagePath)).catch((err) =>
    console.error("Failed to delete project storage objects:", err)
  );
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
