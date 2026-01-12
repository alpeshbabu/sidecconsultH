import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive consulting services for medical device manufacturing: Manufacturing Engineering, Quality & Regulatory Compliance, Injection Molding Process Excellence, Facility Design, and more.",
};

export default function ServicesPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">Services</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 3...</p>
    </div>
  );
}
