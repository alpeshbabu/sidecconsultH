import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getPortalUser, getOwnedProject } from "@/lib/portal-auth";
import { isAllowedUpload, objectExists } from "@/lib/storage";
import { notifyDocumentUploaded } from "@/lib/portal-notify";

const schema = z.object({
  path: z.string().min(1),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(150),
  sizeBytes: z.number().int().positive(),
});

// POST /api/portal/projects/[id]/documents → record a client-uploaded document
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
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
  const { path, fileName, mimeType, sizeBytes } = parsed.data;

  const reason = isAllowedUpload(mimeType, sizeBytes);
  if (reason) {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

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
      uploadedById: user.id,
      uploadedByRole: "CLIENT",
    },
  });

  const full = await prisma.project.findUnique({
    where: { id: projectId },
    include: { client: { select: { name: true, email: true } } },
  });
  if (full) {
    notifyDocumentUploaded(
      { id: full.id, title: full.title, client: full.client },
      "CLIENT",
      fileName
    );
  }

  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
