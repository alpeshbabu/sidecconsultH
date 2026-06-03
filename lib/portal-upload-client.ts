"use client";

import { createClient } from "@supabase/supabase-js";

// Lazily-created browser Supabase client (anon key is public by design).
let browserClient: ReturnType<typeof createClient> | null = null;
function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase is not configured for uploads.");
  }
  if (!browserClient) {
    browserClient = createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return browserClient;
}

interface UploadResult {
  ok: boolean;
  error?: string;
  doc?: unknown;
}

/**
 * Three-step direct upload that bypasses the serverless body-size limit:
 *  1) ask our API for a one-time signed upload URL (also enforces auth/limits)
 *  2) upload the file straight to Supabase Storage from the browser
 *  3) tell our API to record the document metadata (and notify the other party)
 *
 * `basePath` is the documents endpoint base, e.g.
 * `/api/portal/projects/<id>/documents` or `/api/admin/projects/<id>/documents`.
 */
export async function uploadDocument(
  basePath: string,
  file: File
): Promise<UploadResult> {
  const mimeType = file.type || "application/octet-stream";

  // 1) sign
  const signRes = await fetch(`${basePath}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, mimeType, sizeBytes: file.size }),
  });
  const signData = await signRes.json();
  if (!signRes.ok || !signData.success) {
    return { ok: false, error: signData.error || "Could not start upload." };
  }
  const { path, token, bucket } = signData.data as {
    path: string;
    token: string;
    bucket: string;
  };

  // 2) upload to Supabase
  try {
    const supabase = getBrowserClient();
    const { error } = await supabase.storage
      .from(bucket)
      .uploadToSignedUrl(path, token, file, { contentType: mimeType });
    if (error) {
      return { ok: false, error: error.message || "Upload failed." };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Upload failed.",
    };
  }

  // 3) record metadata
  const recordRes = await fetch(basePath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, fileName: file.name, mimeType, sizeBytes: file.size }),
  });
  const recordData = await recordRes.json();
  if (!recordRes.ok || !recordData.success) {
    return { ok: false, error: recordData.error || "Could not save document." };
  }

  return { ok: true, doc: recordData.data };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
