import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "25+ years of expertise in medical device manufacturing. M.Sc. in Organic Chemistry with Polymer specialization. Expert in ISO 13485, FDA regulations, and injection molding processes.",
};

export default function AboutPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 3...</p>
    </div>
  );
}
