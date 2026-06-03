"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Service {
  id: string;
  categoryName: string;
  categorySlug: string;
  serviceId: string;
  title: string;
  tagline: string | null;
  description: string;
  isActive: boolean;
  sortOrder: number;
  keyOfferings: string[];
  outcomes: string[];
  createdAt: string;
  updatedAt: string;
}

const SERVICE_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "manufacturing-operations", label: "Manufacturing & Operations" },
  { value: "quality-compliance", label: "Quality & Compliance" },
  { value: "process-technical", label: "Process & Technical Excellence" },
  { value: "strategy-supply-chain", label: "Strategy & Supply Chain" },
];

export function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchServices();
  }, [search, categoryFilter, statusFilter, page]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/services?${params}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(errorData.error || "Failed to fetch services");
      }

      const data = await response.json();
      setServices(data.services);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete service");
      }

      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete service");
    }
  };

  const toggleStatus = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update service");
      }

      toast.success(`Service ${!service.isActive ? "activated" : "deactivated"}`);
      fetchServices();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update service status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow mb-2">Service Catalog</span>
          <h1 className="font-display text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage consulting service offerings displayed on the public website
          </p>
        </div>
        <Button asChild variant="technical">
          <Link href="/admin/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-technical rounded-none">
        <CardHeader>
          <CardTitle className="font-display text-lg tracking-tight">Filters</CardTitle>
          <CardDescription className="font-mono text-xs uppercase tracking-[0.12em]">
            Search and filter services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 rounded-sm border-hairline focus-visible:ring-signal"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="card-technical rounded-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hairline-b hover:bg-transparent">
                <TableHead className="w-[50px] font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Order</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Service</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Category</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Offerings</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Updated</TableHead>
                <TableHead className="text-right font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Loading services...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    No services found.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id} className="hairline-b hover:bg-muted/40">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {service.sortOrder}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.title}</div>
                        {service.tagline && (
                          <div className="text-sm text-muted-foreground">
                            {service.tagline}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          ID: {service.serviceId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-sm border-hairline font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{service.categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {service.keyOfferings.length} offerings
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.outcomes.length} outcomes
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(service)}
                        className="h-8 gap-2 rounded-sm hover:text-signal"
                      >
                        {service.isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-600">
                            <Eye className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                            <EyeOff className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(service.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild className="rounded-sm hover:text-signal">
                          <Link href={`/admin/services/${service.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id, service.title)}
                          className="rounded-sm text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
          >
            Previous
          </Button>
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
