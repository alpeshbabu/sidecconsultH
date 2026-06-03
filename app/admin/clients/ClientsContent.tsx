"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Loader2,
  Send,
  FolderKanban,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string | null;
  email: string;
  companyName: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  _count?: { projects: number };
}

const LABEL = "font-mono text-xs uppercase tracking-[0.12em]";
const HEAD = "font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground";

export function ClientsContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    sendInvite: true,
  });

  const fetchClients = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      const res = await fetch(`/api/admin/clients?${params}`);
      const data = await res.json();
      if (data.success) setClients(data.data);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchClients(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchClients]);

  const openDialog = (client?: Client) => {
    if (client) {
      setEditing(client);
      setForm({
        name: client.name || "",
        email: client.email,
        companyName: client.companyName || "",
        sendInvite: false,
      });
    } else {
      setEditing(null);
      setForm({ name: "", email: "", companyName: "", sendInvite: true });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditing(null);
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Valid email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const url = editing
        ? `/api/admin/clients/${editing.id}`
        : "/api/admin/clients";
      const method = editing ? "PUT" : "POST";
      const payload = editing
        ? {
            name: form.name.trim(),
            email: form.email.toLowerCase().trim(),
            companyName: form.companyName.trim() || null,
          }
        : {
            name: form.name.trim(),
            email: form.email.toLowerCase().trim(),
            companyName: form.companyName.trim() || null,
            sendInvite: form.sendInvite,
          };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.error?.toLowerCase().includes("email")) {
          setErrors({ email: data.error });
        } else {
          toast.error(data.error || "Failed to save client");
        }
        return;
      }
      toast.success(
        editing
          ? "Client updated"
          : form.sendInvite
          ? "Client created — invite sent"
          : "Client created"
      );
      closeDialog();
      fetchClients(search);
    } catch {
      toast.error("Failed to save client");
    } finally {
      setIsSaving(false);
    }
  };

  const sendInvite = async (client: Client) => {
    const tid = toast.loading("Sending invite...");
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/invite`, {
        method: "POST",
      });
      const data = await res.json();
      toast.dismiss(tid);
      if (!data.success) {
        toast.error(data.error || "Failed to send invite");
        return;
      }
      toast.success(`Invite sent to ${client.email}`);
    } catch {
      toast.dismiss(tid);
      toast.error("Failed to send invite");
    }
  };

  const deleteClient = async (client: Client) => {
    const count = client._count?.projects ?? 0;
    if (
      !confirm(
        count > 0
          ? `Delete ${client.name || client.email}? This will also delete their ${count} project(s) and all associated documents and messages.`
          : `Delete ${client.name || client.email}?`
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to delete client");
        return;
      }
      toast.success("Client deleted");
      fetchClients(search);
    } catch {
      toast.error("Failed to delete client");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow mb-2">Portal</span>
          <h1 className="font-display text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage client portal accounts and send sign-in invites
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchClients(search)}
            disabled={isLoading}
            className={cn("rounded-sm border-hairline", LABEL)}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="technical" onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search by name, email, or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-sm border-hairline focus-visible:ring-signal"
      />

      <Card className="card-technical rounded-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hairline-b hover:bg-transparent">
                <TableHead className={HEAD}>Name</TableHead>
                <TableHead className={HEAD}>Email</TableHead>
                <TableHead className={cn("hidden md:table-cell", HEAD)}>Company</TableHead>
                <TableHead className={cn("text-center", HEAD)}>Projects</TableHead>
                <TableHead className={cn("hidden lg:table-cell", HEAD)}>Last Login</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-signal" />
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Users className="mx-auto mb-2 h-10 w-10 text-signal opacity-70" />
                    <p className={cn(HEAD)}>No clients yet</p>
                    <Button variant="link" className="mt-2 text-signal" onClick={() => openDialog()}>
                      Add your first client
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="hairline-b hover:bg-muted/40">
                    <TableCell className="font-medium">{client.name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {client.companyName || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="rounded-sm border border-hairline font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                      >
                        {client._count?.projects ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {client.lastLoginAt
                        ? new Date(client.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm hover:text-signal">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-sm border-hairline">
                          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDialog(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => sendInvite(client)}>
                            <Send className="mr-2 h-4 w-4" />
                            Send sign-in link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/projects?clientId=${client.id}`}>
                              <FolderKanban className="mr-2 h-4 w-4" />
                              View projects
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteClient(client)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-sm border-hairline sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              {editing ? "Edit Client" : "New Client"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the client's details."
                : "Create a portal account. Clients sign in with a one-time email link — no password needed."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={LABEL}>
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Doe"
                className={cn("rounded-sm border-hairline focus-visible:ring-signal", errors.name && "border-destructive")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={LABEL}>
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="jane@company.com"
                className={cn("rounded-sm border-hairline focus-visible:ring-signal", errors.email && "border-destructive")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className={LABEL}>Company</Label>
              <Input
                id="company"
                value={form.companyName}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="Acme Medical Devices"
                className="rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>

            {!editing && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.sendInvite}
                  onChange={(e) => setForm((p) => ({ ...p, sendInvite: e.target.checked }))}
                  className="h-4 w-4 rounded-sm border-hairline accent-[var(--signal)]"
                />
                Send a portal sign-in link now
              </label>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className={cn("rounded-sm border-hairline", LABEL)}>
              Cancel
            </Button>
            <Button variant="technical" onClick={save} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create Client"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
