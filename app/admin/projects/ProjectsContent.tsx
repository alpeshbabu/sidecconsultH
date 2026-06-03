"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  RefreshCw,
  FolderKanban,
  Loader2,
  FileText,
  MessageSquare,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_META,
  PROJECT_STATUS_OPTIONS,
  type ProjectStatus,
} from "@/lib/portal-status";

interface ProjectRow {
  id: string;
  title: string;
  status: ProjectStatus;
  updatedAt: string;
  client: { id: string; name: string | null; email: string; companyName: string | null };
  _count: { milestones: number; documents: number; messages: number };
}

interface ClientOption {
  id: string;
  name: string | null;
  email: string;
  companyName: string | null;
}

const LABEL = "font-mono text-xs uppercase tracking-[0.12em]";
const HEAD = "font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground";

export function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get("clientId") || "";

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    description: "",
    status: "ACTIVE" as ProjectStatus,
  });

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (clientFilter) params.set("clientId", clientFilter);
      const res = await fetch(`/api/admin/projects?${params}`);
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, [clientFilter]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clients?limit=100");
      const data = await res.json();
      if (data.success) setClients(data.data);
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filterClient = clients.find((c) => c.id === clientFilter);

  const openDialog = () => {
    setForm({
      clientId: clientFilter || "",
      title: "",
      description: "",
      status: "ACTIVE",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.clientId) e.clientId = "Select a client";
    if (form.title.trim().length < 2) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.clientId,
          title: form.title.trim(),
          description: form.description.trim() || null,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to create project");
        return;
      }
      toast.success("Project created");
      setIsDialogOpen(false);
      router.push(`/admin/projects/${data.data.id}`);
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow mb-2">Portal</span>
          <h1 className="font-display text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            {filterClient
              ? `Engagements for ${filterClient.name || filterClient.email}`
              : "Manage client engagements, milestones, documents, and messages"}
          </p>
        </div>
        <div className="flex gap-2">
          {clientFilter && (
            <Button
              variant="outline"
              asChild
              className={cn("rounded-sm border-hairline", LABEL)}
            >
              <Link href="/admin/projects">All projects</Link>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={fetchProjects}
            disabled={isLoading}
            className={cn("rounded-sm border-hairline", LABEL)}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="technical" onClick={openDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Card className="card-technical rounded-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hairline-b hover:bg-transparent">
                <TableHead className={HEAD}>Project</TableHead>
                <TableHead className={cn("hidden md:table-cell", HEAD)}>Client</TableHead>
                <TableHead className={HEAD}>Status</TableHead>
                <TableHead className={cn("text-center", HEAD)}>Activity</TableHead>
                <TableHead className={cn("hidden lg:table-cell", HEAD)}>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-signal" />
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <FolderKanban className="mx-auto mb-2 h-10 w-10 text-signal opacity-70" />
                    <p className={HEAD}>No projects yet</p>
                    <Button variant="link" className="mt-2 text-signal" onClick={openDialog}>
                      Create your first project
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow
                    key={p.id}
                    className="hairline-b cursor-pointer hover:bg-muted/40"
                    onClick={() => router.push(`/admin/projects/${p.id}`)}
                  >
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {p.client.name || p.client.email}
                      {p.client.companyName ? ` · ${p.client.companyName}` : ""}
                    </TableCell>
                    <TableCell>
                      <span className={PROJECT_STATUS_META[p.status].badge}>
                        {PROJECT_STATUS_META[p.status].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1" title="Milestones">
                          <Flag className="h-3.5 w-3.5" />
                          {p._count.milestones}
                        </span>
                        <span className="flex items-center gap-1" title="Documents">
                          <FileText className="h-3.5 w-3.5" />
                          {p._count.documents}
                        </span>
                        <span className="flex items-center gap-1" title="Messages">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {p._count.messages}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-sm border-hairline sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">New Project</DialogTitle>
            <DialogDescription>
              Create an engagement for a client. You can add milestones next.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={LABEL}>
                Client <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.clientId}
                onValueChange={(v) => setForm((p) => ({ ...p, clientId: v }))}
              >
                <SelectTrigger className={cn("rounded-sm border-hairline focus-visible:ring-signal", errors.clientId && "border-destructive")}>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No clients — create one first
                    </div>
                  ) : (
                    clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || c.email}
                        {c.companyName ? ` · ${c.companyName}` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-sm text-destructive">{errors.clientId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className={LABEL}>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="ISO 13485 Gap Assessment"
                className={cn("rounded-sm border-hairline focus-visible:ring-signal", errors.title && "border-destructive")}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc" className={LABEL}>Description</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Scope and objectives of this engagement"
                className="min-h-[80px] rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>

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
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className={cn("rounded-sm border-hairline", LABEL)}
            >
              Cancel
            </Button>
            <Button variant="technical" onClick={save} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
