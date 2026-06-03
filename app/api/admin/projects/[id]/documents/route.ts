import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { isAllowedUpload, objectExists } from "@/lib/storage";
import { notifyDocumentUploaded } from "@/lib/portal-notify";

const schema = z.object({
  path: z.string().min(1),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(150),
  sizeBytes: z.number().int().positive(),
});

// POST /api/admin/projects/[id]/documents → record an uploaded document
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
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
  const { path, fileName, mimeType, sizeBytes } = parsed.data;

  const reason = isAllowedUpload(mimeType, sizeBytes);
  if (reason) {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

  // Confirm the object was actually uploaded, and that its path is in this
  // project's folder (defense against a forged path).
  if (!path.startsWith(`projects/${projectId}/`) || !(await objectExists(path))) {
    return NextResponse.json(
      { success: false, error: "Upload not found. Please try again." },
      { status: 400 }
    );
  }

  const doc = await prisma.portalDocument.create({
    data: {
      projectId,
      fileName,
      storagePath: path,
      mimeType,
      sizeBytes,
      uploadedById: session.user.id,
      uploadedByRole: "ADMIN",
    },
  });

  notifyDocumentUploaded(
    { id: project.id, title: project.title, client: project.client },
    "ADMIN",
    fileName
  );

  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
