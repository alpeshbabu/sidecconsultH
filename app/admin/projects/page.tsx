import { Suspense } from "react";
import { ProjectsContent } from "./ProjectsContent";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsContent />
    </Suspense>
  );
}
