import type { Metadata } from "next";
import { Suspense } from "react";
import { PostsContent } from "./PostsContent";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Manage blog posts and articles",
};

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<PostsLoading />}>
      <PostsContent />
    </Suspense>
  );
}

function PostsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
