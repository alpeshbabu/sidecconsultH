import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch for medical device manufacturing consulting. Schedule a consultation to discuss your ISO 13485, injection molding, or facility design needs.",
};

export default function ContactPage() {
  return (
    <div className="container-wide section-padding">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 3...</p>
    </div>
  );
}
