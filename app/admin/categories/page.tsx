import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoriesContent } from "./CategoriesContent";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage blog categories",
};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesContent />
    </Suspense>
  );
}

function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-36 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-64 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
