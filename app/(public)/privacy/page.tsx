import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for MedDevice Consulting website.",
};

export default function PrivacyPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 4...</p>
    </div>
  );
}
