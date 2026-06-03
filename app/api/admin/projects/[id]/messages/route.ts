import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { portalMessageSchema } from "@/lib/validations";
import { notifyNewMessage } from "@/lib/portal-notify";

// GET /api/admin/projects/[id]/messages — list thread; mark client messages read
export async function GET(
  _request: NextRequest,
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

  await prisma.portalMessage.updateMany({
    where: { projectId, authorRole: "CLIENT", readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.portalMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ success: true, data: messages });
}

// POST /api/admin/projects/[id]/messages — admin posts a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id: projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: { select: { name: true, email: true } } },
  });
  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = portalMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const message = await prisma.portalMessage.create({
    data: {
      projectId,
      authorId: session.user.id,
      authorRole: "ADMIN",
      body: parsed.data.body.trim(),
    },
  });

  notifyNewMessage(
    { id: project.id, title: project.title, client: project.client },
    "ADMIN",
    message.body
  );

  return NextResponse.json({ success: true, data: message }, { status: 201 });
}
