import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPortalUser, getOwnedProject } from "@/lib/portal-auth";
import { getSignedDownloadUrl } from "@/lib/storage";

// GET /api/portal/projects/[id]/documents/[docId]/download
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id: projectId, docId } = await params;

  // Ownership: the project must belong to this client.
  const project = await getOwnedProject(projectId, user.id);
  if (!project) {
    return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
  }

  const doc = await prisma.portalDocument.findFirst({
    where: { id: docId, projectId },
  });
  if (!doc) {
    return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
  }

  const url = await getSignedDownloadUrl(doc.storagePath, doc.fileName);
  return NextResponse.redirect(url);
}
