import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { milestoneSchema } from "@/lib/validations";

// POST /api/admin/projects/[id]/milestones
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id: projectId } = await params;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = milestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, description, status, dueDate, sortOrder } = parsed.data;

  // Default sortOrder to end of list when not provided.
  let order = sortOrder;
  if (order === undefined) {
    const last = await prisma.milestone.findFirst({
      where: { projectId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    order = (last?.sortOrder ?? -1) + 1;
  }

  const milestone = await prisma.milestone.create({
    data: {
      projectId,
      title: title.trim(),
      description: description?.trim() || null,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      completedAt: status === "COMPLETED" ? new Date() : null,
      sortOrder: order,
    },
  });

  return NextResponse.json({ success: true, data: milestone }, { status: 201 });
}
