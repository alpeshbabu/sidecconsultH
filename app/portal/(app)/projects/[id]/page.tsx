import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Flag } from "lucide-react";
import { getPortalUser } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PortalDoc } from "@/components/portal/DocumentsCard";
import { ClientDocuments } from "@/components/portal/ClientDocuments";
import { MessagesCard } from "@/components/portal/MessagesCard";
import {
  PROJECT_STATUS_META,
  MILESTONE_STATUS_META,
  type ProjectStatus,
  type MilestoneStatus,
} from "@/lib/portal-status";

export const metadata = { title: "Project" };

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getPortalUser();
  if (!user) redirect("/portal/login");

  const { id } = await params;

  // Ownership is enforced by the clientId filter.
  const project = await prisma.project.findFirst({
    where: { id, clientId: user.id },
    include: {
      milestones: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!project) notFound();

  const statusMeta = PROJECT_STATUS_META[project.status as ProjectStatus];

  const docs: PortalDoc[] = project.documents.map((d) => ({
    id: d.id,
    fileName: d.fileName,
    mimeType: d.mimeType,
    sizeBytes: d.sizeBytes,
    uploadedByRole: d.uploadedByRole as "ADMIN" | "CLIENT",
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-2 -ml-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground"
        >
          <Link href="/portal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All projects
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight">{project.title}</h1>
          <span className={statusMeta.badge}>{statusMeta.label}</span>
        </div>
        {project.description && (
          <p className="mt-2 max-w-3xl text-muted-foreground">{project.description}</p>
        )}
        {(project.startDate || project.targetDate) && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            {project.startDate && `Start ${new Date(project.startDate).toLocaleDateString()}`}
            {project.startDate && project.targetDate && " · "}
            {project.targetDate && `Target ${new Date(project.targetDate).toLocaleDateString()}`}
          </p>
        )}
      </div>

      {/* Milestone timeline */}
      <Card className="card-technical rounded-none">
        <CardHeader>
          <CardTitle className="font-display text-lg">Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          {project.milestones.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Flag className="mb-2 h-8 w-8 text-signal opacity-70" />
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Milestones will appear here as your engagement is planned.
              </p>
            </div>
          ) : (
            <ol className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-24px)] before:w-px before:bg-hairline">
              {project.milestones.map((ms) => {
                const meta = MILESTONE_STATUS_META[ms.status as MilestoneStatus];
                return (
                  <li key={ms.id} className="relative flex gap-4">
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border ${meta.dot}`}
                    >
                      <Flag className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{ms.title}</span>
                        <span className={meta.badge}>{meta.label}</span>
                      </div>
                      {ms.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{ms.description}</p>
                      )}
                      <div className="mt-1 flex gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        {ms.dueDate && <span>Due {new Date(ms.dueDate).toLocaleDateString()}</span>}
                        {ms.completedAt && (
                          <span>Completed {new Date(ms.completedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <ClientDocuments
        documents={docs}
        basePath={`/api/portal/projects/${project.id}/documents`}
      />

      {/* Messages */}
      <MessagesCard
        basePath={`/api/portal/projects/${project.id}/messages`}
        currentRole="CLIENT"
      />
    </div>
  );
}
