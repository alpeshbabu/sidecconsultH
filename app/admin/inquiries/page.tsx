import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiriesContent } from "./InquiriesContent";

export const metadata: Metadata = {
  title: "Inquiries",
  description: "Manage contact form submissions and inquiries",
};

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<InquiriesLoading />}>
      <InquiriesContent />
    </Suspense>
  );
}

function InquiriesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted/40 animate-pulse rounded-sm" />
        <div className="h-10 w-32 bg-muted/40 animate-pulse rounded-sm" />
      </div>
      <div className="h-96 border border-hairline bg-muted/20 animate-pulse" />
    </div>
  );
}
