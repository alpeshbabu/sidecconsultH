"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, Trash2, RefreshCw, Download, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

const statusChipBase =
  "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]";

export function SubscribersContent() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [total, setTotal] = useState(0);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const response = await fetch(`/api/admin/subscribers?${params}`);
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleUnsubscribe = async (id: string) => {
    if (!confirm("Are you sure you want to unsubscribe this user?")) return;
    try {
      const response = await fetch(`/api/admin/subscribers?id=${id}&action=unsubscribe`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Subscriber unsubscribed");
        fetchSubscribers();
      } else {
        toast.error(data.error || "Failed to unsubscribe");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error("Failed to unsubscribe");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this subscriber?")) return;
    try {
      const response = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Subscriber deleted");
        fetchSubscribers();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      const response = await fetch("/api/admin/subscribers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Subscriber reactivated");
        fetchSubscribers();
      } else {
        toast.error(data.error || "Failed to reactivate");
      }
    } catch (error) {
      console.error("Error reactivating:", error);
      toast.error("Failed to reactivate");
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed At"];
    const rows = subscribers.map((s) => [
      s.email,
      s.isActive ? "Active" : "Inactive",
      formatDate(s.subscribedAt),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Newsletter
          </p>
          <h1 className="font-display text-2xl tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">
            Manage your newsletter subscribers
          </p>
        </div>
        <Button
          variant="technical"
          onClick={exportToCSV}
          disabled={subscribers.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-technical rounded-none p-6">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Total Subscribers
          </p>
          <div className="mt-2 font-display text-2xl tracking-tight">{total}</div>
        </div>
        <div className="card-technical rounded-none p-6">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Active
          </p>
          <div className="mt-2 font-display text-2xl tracking-tight text-emerald-600">
            {activeCount}
          </div>
        </div>
        <div className="card-technical rounded-none p-6">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Unsubscribed
          </p>
          <div className="mt-2 font-display text-2xl tracking-tight text-muted-foreground">
            {total - activeCount}
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="border border-hairline">
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 hairline-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-hairline text-signal">
            <Mail className="h-4 w-4" />
          </div>
          <h2 className="mr-auto font-display text-lg tracking-tight">Subscribers</h2>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className={cn(
                  "w-32 rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60",
                  statusFilter !== "all" && "border-signal bg-signal/10 text-foreground"
                )}
              >
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm hover:text-signal"
              onClick={fetchSubscribers}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="h-40 bg-muted animate-pulse" />
          ) : subscribers.length === 0 ? (
            <div className="py-12 text-center">
              <Mail className="h-10 w-10 mx-auto mb-2 text-signal opacity-60" />
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                No subscribers found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hairline-b hover:bg-transparent">
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Email</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Status</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Subscribed</TableHead>
                    <TableHead className="text-right font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="hairline-b hover:bg-muted/40">
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            statusChipBase,
                            subscriber.isActive
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                              : "bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/30"
                          )}
                        >
                          {subscriber.isActive ? "Subscribed" : "Unsubscribed"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {formatDate(subscriber.subscribedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {subscriber.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
                              onClick={() => handleUnsubscribe(subscriber.id)}
                              title="Unsubscribe"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
                              onClick={() => handleReactivate(subscriber.id)}
                              title="Reactivate"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-sm hover:text-signal"
                            onClick={() => handleDelete(subscriber.id)}
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
