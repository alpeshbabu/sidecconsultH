"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Trash2,
  Plus,
  Edit,
  ChevronUp,
  ChevronDown,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_META,
  PROJECT_STATUS_OPTIONS,
  MILESTONE_STATUS_META,
  MILESTONE_STATUS_OPTIONS,
  type ProjectStatus,
  type MilestoneStatus,
} from "@/lib/portal-status";
import { DocumentsCard, type PortalDoc } from "@/components/portal/DocumentsCard";
import { MessagesCard } from "@/components/portal/MessagesCard";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  dueDate: string | null;
  completedAt: string | null;
  sortOrder: number;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  targetDate: string | null;
  client: { id: string; name: string | null; email: string; companyName: string | null };
  milestones: Milestone[];
  documents: PortalDoc[];
}

const LABEL = "font-mono text-xs uppercase tracking-[0.12em]";
const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const toIso = (d: string) => (d ? new Date(`${d}T00:00:00.000Z`).toISOString() : null);

export function ProjectEditor({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Details form
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "ACTIVE" as ProjectStatus,
    startDate: "",
    targetDate: "",
  });

  // Milestone dialog
  const [msDialogOpen, setMsDialogOpen] = useState(false);
  const [editingMs, setEditingMs] = useState<Milestone | null>(null);
  const [msForm, setMsForm] = useState({
    title: "",
    description: "",
    status: "PENDING" as MilestoneStatus,
    dueDate: "",
  });
  const [msSaving, setMsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`);
      const data = await res.json();
      if (data.success) {
        const p: Project = data.data;
        setProject(p);
        setForm({
          title: p.title,
          description: p.description || "",
          status: p.status,
          startDate: toDateInput(p.startDate),
          targetDate: toDateInput(p.targetDate),
        });
      } else {
        toast.error(data.error || "Failed to load project");
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveDetails = async () => {
    if (form.title.trim().length < 2) {
      toast.error("Title must be at least 2 characters");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          status: form.status,
          startDate: toIso(form.startDate),
          targetDate: toIso(form.targetDate),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success("Project saved");
      load();
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async () => {
    if (!confirm("Delete this project and all its milestones, documents, and messages?"))
      return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to delete");
        return;
      }
      toast.success("Project deleted");
      router.push("/admin/projects");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ---- Milestones ----
  const openMsDialog = (ms?: Milestone) => {
    if (ms) {
      setEditingMs(ms);
      setMsForm({
        title: ms.title,
        description: ms.description || "",
        status: ms.status,
        dueDate: toDateInput(ms.dueDate),
      });
    } else {
      setEditingMs(null);
      setMsForm({ title: "", description: "", status: "PENDING", dueDate: "" });
    }
    setMsDialogOpen(true);
  };

  const saveMilestone = async () => {
    if (msForm.title.trim().length < 2) {
      toast.error("Milestone title must be at least 2 characters");
      return;
    }
    setMsSaving(true);
    try {
      const url = editingMs
        ? `/api/admin/projects/${projectId}/milestones/${editingMs.id}`
        : `/api/admin/projects/${projectId}/milestones`;
      const res = await fetch(url, {
        method: editingMs ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: msForm.title.trim(),
          description: msForm.description.trim() || null,
          status: msForm.status,
          dueDate: toIso(msForm.dueDate),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to save milestone");
        return;
      }
      toast.success(editingMs ? "Milestone updated" : "Milestone added");
      setMsDialogOpen(false);
      load();
    } catch {
      toast.error("Failed to save milestone");
    } finally {
      setMsSaving(false);
    }
  };

  const updateMilestone = async (id: string, payload: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to update milestone");
        return;
      }
      load();
    } catch {
      toast.error("Failed to update milestone");
    }
  };

  const deleteMilestone = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to delete milestone");
        return;
      }
      toast.success("Milestone deleted");
      load();
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  const moveMilestone = (index: number, dir: "up" | "down") => {
    if (!project) return;
    const list = project.milestones;
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const a = list[index];
    const b = list[target];
    // Swap sort orders.
    updateMilestone(a.id, { sortOrder: b.sortOrder });
    updateMilestone(b.id, { sortOrder: a.sortOrder });
  };

  if (isLoading || !project) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-signal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn("mb-2 -ml-2 text-muted-foreground", LABEL)}
          >
            <Link href={`/admin/projects?clientId=${project.client.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">
            {project.client.name || project.client.email}
            {project.client.companyName ? ` · ${project.client.companyName}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={PROJECT_STATUS_META[project.status].badge}>
            {PROJECT_STATUS_META[project.status].label}
          </span>
          <Button
            variant="outline"
            onClick={deleteProject}
            className="rounded-sm border-hairline text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Details */}
      <Card className="card-technical rounded-none">
        <CardHeader>
          <CardTitle className="font-display text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className={LABEL}>Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="rounded-sm border-hairline focus-visible:ring-signal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc" className={LABEL}>Description</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="min-h-[90px] rounded-sm border-hairline focus-visible:ring-signal"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className={LABEL}>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v as ProjectStatus }))}
              >
                <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start" className={LABEL}>Start date</Label>
              <Input
                id="start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target" className={LABEL}>Target date</Label>
              <Input
                id="target"
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm((p) => ({ ...p, targetDate: e.target.value }))}
                className="rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>
          </div>
          <Button variant="technical" onClick={saveDetails} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save changes
          </Button>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="card-technical rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-display text-lg">Milestones</CardTitle>
          <Button variant="outline" size="sm" onClick={() => openMsDialog()} className={cn("rounded-sm border-hairline", LABEL)}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.milestones.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Flag className="mb-2 h-8 w-8 text-signal opacity-70" />
              <p className={cn(LABEL, "text-muted-foreground")}>No milestones yet</p>
            </div>
          ) : (
            project.milestones.map((ms, index) => (
              <div
                key={ms.id}
                className="flex flex-col gap-3 border border-hairline p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={MILESTONE_STATUS_META[ms.status].badge}>
                      {MILESTONE_STATUS_META[ms.status].label}
                    </span>
                    <span className="truncate font-medium">{ms.title}</span>
                  </div>
                  {ms.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ms.description}</p>
                  )}
                  {ms.dueDate && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      Due {new Date(ms.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Select
                    value={ms.status}
                    onValueChange={(v) => updateMilestone(ms.id, { status: v })}
                  >
                    <SelectTrigger className="h-8 w-[150px] rounded-sm border-hairline text-xs focus-visible:ring-signal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MILESTONE_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm" onClick={() => moveMilestone(index, "up")} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm" onClick={() => moveMilestone(index, "down")} disabled={index === project.milestones.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm hover:text-signal" onClick={() => openMsDialog(ms)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-destructive" onClick={() => deleteMilestone(ms.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <DocumentsCard
        documents={project.documents}
        basePath={`/api/admin/projects/${projectId}/documents`}
        canDelete
        uploaderLabel={(role) => (role === "ADMIN" ? "Team" : "Client")}
        onChange={load}
      />

      {/* Messages */}
      <MessagesCard
        basePath={`/api/admin/projects/${projectId}/messages`}
        currentRole="ADMIN"
      />

      {/* Milestone dialog */}
      <Dialog open={msDialogOpen} onOpenChange={setMsDialogOpen}>
        <DialogContent className="rounded-sm border-hairline sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              {editingMs ? "Edit Milestone" : "Add Milestone"}
            </DialogTitle>
            <DialogDescription>
              Milestones form the engagement timeline your client sees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ms-title" className={LABEL}>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ms-title"
                value={msForm.title}
                onChange={(e) => setMsForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Discovery & scoping"
                className="rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ms-desc" className={LABEL}>Description</Label>
              <Textarea
                id="ms-desc"
                value={msForm.description}
                onChange={(e) => setMsForm((p) => ({ ...p, description: e.target.value }))}
                className="min-h-[70px] rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className={LABEL}>Status</Label>
                <Select
                  value={msForm.status}
                  onValueChange={(v) => setMsForm((p) => ({ ...p, status: v as MilestoneStatus }))}
                >
                  <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MILESTONE_STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ms-due" className={LABEL}>Due date</Label>
                <Input
                  id="ms-due"
                  type="date"
                  value={msForm.dueDate}
                  onChange={(e) => setMsForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="rounded-sm border-hairline focus-visible:ring-signal"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMsDialogOpen(false)} className={cn("rounded-sm border-hairline", LABEL)}>
              Cancel
            </Button>
            <Button variant="technical" onClick={saveMilestone} disabled={msSaving}>
              {msSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingMs ? "Save" : "Add Milestone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
