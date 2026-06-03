"use client";

import { useRouter } from "next/navigation";
import { DocumentsCard, type PortalDoc } from "./DocumentsCard";

/**
 * Client wrapper so the portal's (server-rendered) project page can use
 * DocumentsCard — server components can't pass function props directly.
 */
export function ClientDocuments({
  documents,
  basePath,
}: {
  documents: PortalDoc[];
  basePath: string;
}) {
  const router = useRouter();
  return (
    <DocumentsCard
      documents={documents}
      basePath={basePath}
      uploaderLabel={(role) => (role === "CLIENT" ? "You" : "SIDEC Team")}
      onChange={() => router.refresh()}
    />
  );
}
