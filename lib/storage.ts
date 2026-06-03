import "server-only";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Server-side Supabase client (service role) — used only to sign upload/download
// URLs and delete objects. Never import this in client components.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "client-documents";

export function isStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function getClient() {
  if (!isStorageConfigured()) {
    throw new Error(
      "Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Upload constraints.
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB
export const ALLOWED_MIME_TYPES = new Set<string>([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream", // STEP/IGES/DWG and other CAD exports
]);

export function isAllowedUpload(mimeType: string, sizeBytes: number): string | null {
  if (sizeBytes <= 0) return "File is empty.";
  if (sizeBytes > MAX_FILE_BYTES) return "File exceeds the 25 MB limit.";
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return "This file type is not allowed.";
  return null;
}

// Sanitize a filename for use within a storage key (keep the original for display).
function safeName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "file";
}

export function buildStoragePath(projectId: string, fileName: string): string {
  return `projects/${projectId}/${randomUUID()}-${safeName(fileName)}`;
}

/**
 * Create a one-time signed upload URL the browser can upload directly to,
 * bypassing the serverless request-body size limit.
 */
export async function createSignedUpload(path: string) {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(error?.message || "Failed to create upload URL");
  }
  return { path: data.path, token: data.token };
}

/** Confirm an object actually exists at `path` (called before recording metadata). */
export async function objectExists(path: string): Promise<boolean> {
  const supabase = getClient();
  const slash = path.lastIndexOf("/");
  const dir = slash >= 0 ? path.slice(0, slash) : "";
  const name = slash >= 0 ? path.slice(slash + 1) : path;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(dir, { search: name, limit: 1 });
  if (error) return false;
  return Boolean(data?.some((f) => f.name === name));
}

/** Short-lived signed URL for downloading a private object. */
export async function getSignedDownloadUrl(
  path: string,
  fileName: string,
  expiresInSeconds = 60
): Promise<string> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds, { download: fileName });
  if (error || !data) {
    throw new Error(error?.message || "Failed to create download URL");
  }
  return data.signedUrl;
}

/** Best-effort deletion of objects (e.g. when a document/project is removed). */
export async function deleteObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const supabase = getClient();
  await supabase.storage.from(STORAGE_BUCKET).remove(paths);
}
