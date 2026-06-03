import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FolderKanban } from "lucide-react";
import { getPortalUser } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { PROJECT_STATUS_META, type ProjectStatus } from "@/lib/portal-status";

export const metadata = { title: "Your Projects" };

export default async function PortalDashboard() {
  const user = await getPortalUser();
  if (!user) redirect("/portal/login");

  const projects = await prisma.project.findMany({
    where: { clientId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      targetDate: true,
      updatedAt: true,
      milestones: { select: { status: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Client Portal</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your engagements, review deliverables, and message our team.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="card-technical rounded-none">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FolderKanban className="mb-3 h-10 w-10 text-signal opacity-70" />
            <p className="font-display text-lg font-semibold">No active projects yet</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              When we begin an engagement, it will appear here with its milestones,
              documents, and a direct line to our team.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const total = p.milestones.length;
            const done = p.milestones.filter((m) => m.status === "COMPLETED").length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const meta = PROJECT_STATUS_META[p.status as ProjectStatus];
            return (
              <Link key={p.id} href={`/portal/projects/${p.id}`} className="group">
                <Card className="card-technical h-full rounded-none transition-colors group-hover:border-signal/60">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                      <span className={meta.badge}>{meta.label}</span>
                    </div>
                    {p.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                    <div className="mt-auto space-y-3">
                      {total > 0 && (
                        <div>
                          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                            <span>Milestones</span>
                            <span>
                              {done}/{total}
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-sm bg-muted">
                            <div
                              className="h-full bg-signal transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                          {p.targetDate
                            ? `Target ${new Date(p.targetDate).toLocaleDateString()}`
                            : `Updated ${new Date(p.updatedAt).toLocaleDateString()}`}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">
                          Open
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
