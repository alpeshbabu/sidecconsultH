import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteObjects } from "@/lib/storage";

// DELETE /api/admin/projects/[id]/documents/[docId]
export async function DELETE(
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

  // Remove the storage object first (best-effort), then the row.
  await deleteObjects([doc.storagePath]).catch((err) =>
    console.error("Failed to delete storage object:", err)
  );
  await prisma.portalDocument.delete({ where: { id: docId } });

  return NextResponse.json({ success: true });
}
