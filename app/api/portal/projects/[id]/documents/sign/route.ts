import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPortalUser, getOwnedProject } from "@/lib/portal-auth";
import {
  buildStoragePath,
  createSignedUpload,
  isAllowedUpload,
  isStorageConfigured,
  STORAGE_BUCKET,
} from "@/lib/storage";

const schema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(150),
  sizeBytes: z.number().int().positive(),
});

// POST /api/portal/projects/[id]/documents/sign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { success: false, error: "Document storage is not configured." },
      { status: 503 }
    );
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

  const reason = isAllowedUpload(parsed.data.mimeType, parsed.data.sizeBytes);
  if (reason) {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

  const path = buildStoragePath(projectId, parsed.data.fileName);
  const { token } = await createSignedUpload(path);

  return NextResponse.json({ success: true, data: { path, token, bucket: STORAGE_BUCKET } });
}
