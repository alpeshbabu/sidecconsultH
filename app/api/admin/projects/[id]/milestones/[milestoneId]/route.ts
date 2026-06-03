import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { updateMilestoneSchema } from "@/lib/validations";

// PUT /api/admin/projects/[id]/milestones/[milestoneId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id: projectId, milestoneId } = await params;

  const existing = await prisma.milestone.findFirst({
    where: { id: milestoneId, projectId },
  });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Milestone not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateMilestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;

  // Keep completedAt in sync with status transitions.
  let completedAt: Date | null | undefined;
  if (d.status !== undefined) {
    if (d.status === "COMPLETED") {
      completedAt = existing.completedAt ?? new Date();
    } else {
      completedAt = null;
    }
  }

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      ...(d.title !== undefined && { title: d.title.trim() }),
      ...(d.description !== undefined && { description: d.description?.trim() || null }),
      ...(d.status !== undefined && { status: d.status }),
      ...(d.dueDate !== undefined && { dueDate: d.dueDate ? new Date(d.dueDate) : null }),
      ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
      ...(completedAt !== undefined && { completedAt }),
    },
  });

  return NextResponse.json({ success: true, data: milestone });
}

// DELETE /api/admin/projects/[id]/milestones/[milestoneId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id: projectId, milestoneId } = await params;

  const existing = await prisma.milestone.findFirst({
    where: { id: milestoneId, projectId },
  });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Milestone not found" }, { status: 404 });
  }

  await prisma.milestone.delete({ where: { id: milestoneId } });
  return NextResponse.json({ success: true });
}
