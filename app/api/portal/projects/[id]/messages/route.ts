import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPortalUser, getOwnedProject } from "@/lib/portal-auth";
import { portalMessageSchema } from "@/lib/validations";
import { notifyNewMessage } from "@/lib/portal-notify";

// GET /api/portal/projects/[id]/messages — list thread; mark admin messages read
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id: projectId } = await params;

  const project = await getOwnedProject(projectId, user.id);
  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  await prisma.portalMessage.updateMany({
    where: { projectId, authorRole: "ADMIN", readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.portalMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ success: true, data: messages });
}

// POST /api/portal/projects/[id]/messages — client posts a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id: projectId } = await params;

  const project = await getOwnedProject(projectId, user.id);
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
      authorId: user.id,
      authorRole: "CLIENT",
      body: parsed.data.body.trim(),
    },
  });

  const full = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: { select: { name: true, email: true } } },
  });
  if (full) {
    notifyNewMessage(
      { id: full.id, title: full.title, client: full.client },
      "CLIENT",
      message.body
    );
  }

  return NextResponse.json({ success: true, data: message }, { status: 201 });
}
