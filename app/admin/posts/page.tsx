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
        <div className="h-8 w-32 bg-muted/40 animate-pulse rounded-sm" />
        <div className="h-10 w-32 bg-muted/40 animate-pulse rounded-sm" />
      </div>
      <div className="h-96 border border-hairline bg-muted/20 animate-pulse" />
    </div>
  );
}
