import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for MedDevice Consulting website.",
};

export default function TermsPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 4...</p>
    </div>
  );
}
