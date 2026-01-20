import type { Metadata } from "next";
import { ServiceEditor } from "./ServiceEditor";

export const metadata: Metadata = {
  title: "Edit Service",
};

interface PageProps {
  params: { id: string };
}

export default function ServiceEditorPage({ params }: PageProps) {
  return <ServiceEditor serviceId={params.id} />;
}
