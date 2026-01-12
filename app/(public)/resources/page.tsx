import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Expert insights on medical device manufacturing, ISO 13485 compliance, injection molding processes, and industry best practices.",
};

export default function ResourcesPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">Resources</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 4...</p>
    </div>
  );
}
