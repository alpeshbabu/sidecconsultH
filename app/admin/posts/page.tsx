import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
};

export default function AdminPostsPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 5...</p>
    </div>
  );
}
