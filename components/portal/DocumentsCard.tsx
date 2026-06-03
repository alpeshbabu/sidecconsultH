"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploadDocument, formatFileSize } from "@/lib/portal-upload-client";

export interface PortalDoc {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedByRole: "ADMIN" | "CLIENT";
  createdAt: string;
}

interface DocumentsCardProps {
  documents: PortalDoc[];
  /** Documents API base, e.g. /api/portal/projects/<id>/documents */
  basePath: string;
  /** Whether the current user may delete documents (admins). */
  canDelete?: boolean;
  /** Label for documents the current side uploaded ("You") vs the other side. */
  uploaderLabel: (role: "ADMIN" | "CLIENT") => string;
  onChange: () => void;
}

const LABEL = "font-mono text-xs uppercase tracking-[0.12em]";

export function DocumentsCard({
  documents,
  basePath,
  canDelete = false,
  uploaderLabel,
  onChange,
}: DocumentsCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let anyOk = false;
    for (const file of Array.from(files)) {
      const result = await uploadDocument(basePath, file);
      if (result.ok) {
        anyOk = true;
        toast.success(`Uploaded ${file.name}`);
      } else {
        toast.error(`${file.name}: ${result.error}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (anyOk) onChange();
  };

  const remove = async (doc: PortalDoc) => {
    if (!confirm(`Delete "${doc.fileName}"?`)) return;
    try {
      const res = await fetch(`${basePath}/${doc.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to delete");
        return;
      }
      toast.success("Document deleted");
      onChange();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <Card className="card-technical rounded-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-display text-lg">Documents</CardTitle>
        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cn("rounded-sm border-hairline", LABEL)}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <FileText className="mb-2 h-8 w-8 text-signal opacity-70" />
            <p className={cn(LABEL, "text-muted-foreground")}>No documents yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Up to 25&nbsp;MB per file. PDF, Office, images, CAD, and zip.
            </p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 border border-hairline p-3"
            >
              <FileText className="h-5 w-5 shrink-0 text-signal" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{doc.fileName}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {formatFileSize(doc.sizeBytes)} ·{" "}
                  {uploaderLabel(doc.uploadedByRole)} ·{" "}
                  {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`${basePath}/${doc.id}/download`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm hover:text-signal">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-destructive"
                  onClick={() => remove(doc)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
        <p className="flex items-center gap-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          <Shield className="h-3 w-3" />
          Encrypted storage · private download links
        </p>
      </CardContent>
    </Card>
  );
}
