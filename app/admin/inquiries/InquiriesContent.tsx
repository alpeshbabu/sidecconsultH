"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Archive,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Types
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  serviceInterest: string;
  projectTimeline: string | null;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESPONDED" | "ARCHIVED";
  isRead: boolean;
  internalNotes: string | null;
  supplierAddress: string | null;
  estimatedBudget: string | null;
  otherSites: string | null;
  otherSiteLocations: string | null;
  expectedDocuments: string | null;
  regulatoryStandards: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Service display names
const serviceDisplayNames: Record<string, string> = {
  "manufacturing-engineering": "Manufacturing Engineering",
  "quality-regulatory": "Quality & Regulatory",
  "injection-molding": "Process Excellence",
  "equipment-maintenance": "Equipment Maintenance",
  "facility-design": "Facility Design",
  "supplier-development": "Supplier Development",
  "strategic-advisory": "Strategic Advisory",
  "general": "General Inquiry",
};

// Status config
const statusConfig = {
  NEW: { label: "New", color: "destructive" as const, icon: MessageSquare },
  IN_PROGRESS: { label: "In Progress", color: "default" as const, icon: Clock },
  RESPONDED: { label: "Responded", color: "secondary" as const, icon: CheckCircle },
  ARCHIVED: { label: "Archived", color: "outline" as const, icon: Archive },
};

export function InquiriesContent() {
  // State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Detail modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [followUpInfo, setFollowUpInfo] = useState({
    supplierAddress: "",
    estimatedBudget: "",
    otherSites: "",
    otherSiteLocations: "",
    expectedDocuments: "",
    regulatoryStandards: "",
  });
  const [followUpInputs, setFollowUpInputs] = useState({
    otherSiteName: "",
    otherSiteAddress: "",
    expectedDocuments: "",
    regulatoryStandards: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingFollowUp, setIsSavingFollowUp] = useState(false);

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/admin/inquiries?${params}`);
      const data = await response.json();

      if (data.success) {
        setInquiries(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open inquiry detail
  const openInquiryDetail = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setInternalNotes(inquiry.internalNotes || "");
    setFollowUpInfo({
      supplierAddress: inquiry.supplierAddress || "",
      estimatedBudget: inquiry.estimatedBudget || "",
      otherSites: inquiry.otherSites || "",
      otherSiteLocations: inquiry.otherSiteLocations || "",
      expectedDocuments: inquiry.expectedDocuments || "",
      regulatoryStandards: inquiry.regulatoryStandards || "",
    });
    setFollowUpInputs({
      otherSiteName: "",
      otherSiteAddress: "",
      expectedDocuments: "",
      regulatoryStandards: "",
    });
    setIsDetailOpen(true);

    // Mark as read if unread
    if (!inquiry.isRead) {
      await updateInquiry(inquiry.id, { isRead: true });
    }
  };

  // Update inquiry
  const updateInquiry = async (id: string, data: Partial<Inquiry>) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          const result = await response.json();
          setSelectedInquiry(result.data);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating inquiry:", error);
      return false;
    }
  };

  // Save internal notes
  const saveInternalNotes = async () => {
    if (!selectedInquiry) return;
    setIsSaving(true);
    await updateInquiry(selectedInquiry.id, { internalNotes });
    setIsSaving(false);
  };

  const saveFollowUpInfo = async () => {
    if (!selectedInquiry) return;
    setIsSavingFollowUp(true);
    await updateInquiry(selectedInquiry.id, {
      supplierAddress: followUpInfo.supplierAddress,
      estimatedBudget: followUpInfo.estimatedBudget,
      otherSites: followUpInfo.otherSites,
      otherSiteLocations: followUpInfo.otherSiteLocations,
      expectedDocuments: followUpInfo.expectedDocuments,
      regulatoryStandards: followUpInfo.regulatoryStandards,
    });
    setIsSavingFollowUp(false);
  };

  const appendListValue = (current: string, nextValue: string) => {
    const existing = current
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    return [...existing, nextValue].join("\n");
  };

  const addFollowUpListItem = async (
    field: "expectedDocuments" | "regulatoryStandards",
    value: string
  ) => {
    const trimmed = value.trim();
    if (!trimmed || !selectedInquiry) return;

    const updatedValue = appendListValue(followUpInfo[field], trimmed);
    setFollowUpInfo((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));
    setFollowUpInputs((prev) => ({
      ...prev,
      [field]: "",
    }));

    setIsSavingFollowUp(true);
    await updateInquiry(selectedInquiry.id, { [field]: updatedValue });
    setIsSavingFollowUp(false);
  };

  const addSiteWithAddress = async () => {
    if (!selectedInquiry) return;
    const siteName = followUpInputs.otherSiteName.trim();
    const siteAddress = followUpInputs.otherSiteAddress.trim();
    if (!siteName || !siteAddress) return;

    const updatedSites = appendListValue(followUpInfo.otherSites, siteName);
    const updatedLocations = appendListValue(
      followUpInfo.otherSiteLocations,
      siteAddress
    );

    setFollowUpInfo((prev) => ({
      ...prev,
      otherSites: updatedSites,
      otherSiteLocations: updatedLocations,
    }));
    setFollowUpInputs((prev) => ({
      ...prev,
      otherSiteName: "",
      otherSiteAddress: "",
    }));

    setIsSavingFollowUp(true);
    await updateInquiry(selectedInquiry.id, {
      otherSites: updatedSites,
      otherSiteLocations: updatedLocations,
    });
    setIsSavingFollowUp(false);
  };

  // Change status
  const changeStatus = async (id: string, status: Inquiry["status"]) => {
    await updateInquiry(id, { status });
  };

  // Delete inquiry
  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?.id === id) {
          setIsDetailOpen(false);
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Timeline",
      "Message",
      "Supplier Address",
      "Estimated Budget",
      "Other Sites",
      "Other Site Locations",
      "Expected Documents",
      "Regulatory Standards",
      "Status",
      "Date",
    ];
    const rows = inquiries.map((inquiry) => [
      inquiry.name,
      inquiry.email,
      inquiry.phone || "",
      inquiry.companyName || "",
      serviceDisplayNames[inquiry.serviceInterest] || inquiry.serviceInterest,
      inquiry.projectTimeline || "",
      `"${inquiry.message.replace(/"/g, '""')}"`,
      `"${(inquiry.supplierAddress || "").replace(/"/g, '""')}"`,
      inquiry.estimatedBudget || "",
      `"${(inquiry.otherSites || "").replace(/"/g, '""')}"`,
      `"${(inquiry.otherSiteLocations || "").replace(/"/g, '""')}"`,
      `"${(inquiry.expectedDocuments || "").replace(/"/g, '""')}"`,
      `"${(inquiry.regulatoryStandards || "").replace(/"/g, '""')}"`,
      inquiry.status,
      new Date(inquiry.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInquiries} disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESPONDED">Responded</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder as "asc" | "desc");
            }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No inquiries found</p>
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      !inquiry.isRead && "bg-primary/5"
                    )}
                    onClick={() => openInquiryDetail(inquiry)}
                  >
                    <TableCell>
                      {!inquiry.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        {inquiry.companyName && (
                          <p className="text-sm text-muted-foreground">{inquiry.companyName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {inquiry.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {serviceDisplayNames[inquiry.serviceInterest] || inquiry.serviceInterest}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[inquiry.status].color}>
                        {statusConfig[inquiry.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            openInquiryDetail(inquiry);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${inquiry.email}?subject=Re: Your Inquiry to SIDEC Consulting`;
                          }}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(inquiry.id, "ARCHIVED");
                          }}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteInquiry(inquiry.id);
                            }}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} inquiries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedInquiry.name}</DialogTitle>
                    <DialogDescription>
                      Submitted on {formatDate(selectedInquiry.createdAt)}
                    </DialogDescription>
                  </div>
                  <Badge variant={statusConfig[selectedInquiry.status].color}>
                    {statusConfig[selectedInquiry.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedInquiry.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedInquiry.companyName || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Service Interest</Label>
                    <p className="font-medium">
                      {serviceDisplayNames[selectedInquiry.serviceInterest] || selectedInquiry.serviceInterest}
                    </p>
                  </div>
                  {selectedInquiry.projectTimeline && (
                    <div>
                      <Label className="text-muted-foreground">Timeline</Label>
                      <p className="font-medium">{selectedInquiry.projectTimeline}</p>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <div className="mt-2 p-4 rounded-lg bg-muted">
                    <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Status Change */}
                <div>
                  <Label className="text-muted-foreground">Update Status</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                      <Button
                        key={status}
                        variant={selectedInquiry.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeStatus(selectedInquiry.id, status)}
                      >
                        {statusConfig[status].label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Follow-up Details */}
                <div>
                  <Label className="text-muted-foreground">Follow-up Details</Label>
                  <div className="mt-2 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Address</Label>
                      <Textarea
                        value={followUpInfo.supplierAddress}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            supplierAddress: e.target.value,
                          }))
                        }
                        placeholder="Street, city, state, postal code"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Estimated Budget</Label>
                      <Input
                        value={followUpInfo.estimatedBudget}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            estimatedBudget: e.target.value,
                          }))
                        }
                        placeholder="e.g. $50k–$100k"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Other Sites</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={followUpInputs.otherSiteName}
                          onChange={(e) =>
                            setFollowUpInputs((prev) => ({
                              ...prev,
                              otherSiteName: e.target.value,
                            }))
                          }
                          placeholder="Site name"
                        />
                        <Input
                          value={followUpInputs.otherSiteAddress}
                          onChange={(e) =>
                            setFollowUpInputs((prev) => ({
                              ...prev,
                              otherSiteAddress: e.target.value,
                            }))
                          }
                          placeholder="Site address"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addSiteWithAddress}
                          disabled={isSavingFollowUp}
                        >
                          Add
                        </Button>
                      </div>
                      <Textarea
                        value={followUpInfo.otherSites}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            otherSites: e.target.value,
                          }))
                        }
                        placeholder="Site names, one per line"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Other Site Addresses</Label>
                      <Textarea
                        value={followUpInfo.otherSiteLocations}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            otherSiteLocations: e.target.value,
                          }))
                        }
                        placeholder="Site addresses, one per line"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Expected Documents</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={followUpInputs.expectedDocuments}
                          onChange={(e) =>
                            setFollowUpInputs((prev) => ({
                              ...prev,
                              expectedDocuments: e.target.value,
                            }))
                          }
                          placeholder="Add one document"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addFollowUpListItem(
                              "expectedDocuments",
                              followUpInputs.expectedDocuments
                            )
                          }
                          disabled={isSavingFollowUp}
                        >
                          Add
                        </Button>
                      </div>
                      <Textarea
                        value={followUpInfo.expectedDocuments}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            expectedDocuments: e.target.value,
                          }))
                        }
                        placeholder="One document per line"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Regulatory Standards</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={followUpInputs.regulatoryStandards}
                          onChange={(e) =>
                            setFollowUpInputs((prev) => ({
                              ...prev,
                              regulatoryStandards: e.target.value,
                            }))
                          }
                          placeholder="Add one standard"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addFollowUpListItem(
                              "regulatoryStandards",
                              followUpInputs.regulatoryStandards
                            )
                          }
                          disabled={isSavingFollowUp}
                        >
                          Add
                        </Button>
                      </div>
                      <Textarea
                        value={followUpInfo.regulatoryStandards}
                        onChange={(e) =>
                          setFollowUpInfo((prev) => ({
                            ...prev,
                            regulatoryStandards: e.target.value,
                          }))
                        }
                        placeholder="One standard per line (e.g. FDA, ISO 13485)"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={saveFollowUpInfo}
                    disabled={isSavingFollowUp}
                    className="mt-2"
                    size="sm"
                  >
                    {isSavingFollowUp ? "Saving..." : "Save Follow-up Details"}
                  </Button>
                </div>

                {/* Internal Notes */}
                <div>
                  <Label className="text-muted-foreground">Internal Notes</Label>
                  <Textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Add private notes about this inquiry..."
                    className="mt-2"
                    rows={4}
                  />
                  <Button
                    onClick={saveInternalNotes}
                    disabled={isSaving}
                    className="mt-2"
                    size="sm"
                  >
                    {isSaving ? "Saving..." : "Save Notes"}
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      window.location.href = `mailto:${selectedInquiry.email}?subject=Re: Your Inquiry to SIDEC Consulting`;
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                  {selectedInquiry.phone && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.location.href = `tel:${selectedInquiry.phone}`;
                      }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => changeStatus(selectedInquiry.id, "ARCHIVED")}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
