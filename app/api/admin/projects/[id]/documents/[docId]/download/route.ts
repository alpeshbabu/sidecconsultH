import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { getSignedDownloadUrl } from "@/lib/storage";

// GET /api/admin/projects/[id]/documents/[docId]/download → redirect to signed URL
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const { id: projectId, docId } = await params;

  const doc = await prisma.portalDocument.findFirst({
    where: { id: docId, projectId },
  });
  if (!doc) {
    return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
  }

  const url = await getSignedDownloadUrl(doc.storagePath, doc.fileName);
  return NextResponse.redirect(url);
}
