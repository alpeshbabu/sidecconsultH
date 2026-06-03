"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Save,
  Trash2,
  Ban,
  UserPlus,
  CalendarPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  bookedAt: string;
  bookedEndAt: string;
  bookingType?: "CLIENT" | "ADMIN" | "BLOCKED";
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceInterest?: string | null;
  notes?: string | null;
  timeZone?: string | null;
  status: "REQUESTED" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

interface AvailabilitySettings {
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  timezone?: string;
}

interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  isBooked: boolean;
  localTime?: string;
}

const statusStyles = {
  REQUESTED: {
    label: "Requested",
    icon: Clock,
    chip: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle,
    chip: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    chip: "bg-destructive/10 text-destructive border border-destructive/30",
  },
};

const bookingTypeStyles = {
  CLIENT: {
    label: "Client",
    chip: "bg-primary/10 text-primary border border-primary/30",
  },
  ADMIN: {
    label: "Admin Booking",
    chip: "bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/30",
  },
  BLOCKED: {
    label: "Blocked",
    chip: "bg-destructive/10 text-destructive border border-destructive/30",
  },
};

const chipBase =
  "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AvailabilitySettings>({
    startTime: "08:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
    timezone: "America/Los_Angeles",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Booking/Blocking form state
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // Single slot block/book dialog
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [blockForm, setBlockForm] = useState({
    bookingType: "BLOCKED" as "BLOCKED" | "ADMIN",
    reason: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceInterest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Bulk block dialog
  const [bulkBlockDialogOpen, setBulkBlockDialogOpen] = useState(false);
  const [bulkBlockForm, setBulkBlockForm] = useState({
    startDate: formatDateKey(new Date()),
    endDate: formatDateKey(new Date()),
    startTime: "08:00",
    endTime: "17:00",
    reason: "",
  });

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/appointments/settings");
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          slotDurationMinutes: data.data.slotDurationMinutes,
          timezone: data.data.timezone || "America/Los_Angeles",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const response = await fetch(`/api/admin/appointments?${params}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const fetchSlotsForDate = useCallback(async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const response = await fetch(`/api/appointments/slots?date=${date}`);
      const data = await response.json();
      if (data.success) {
        setSlots(data.data.slots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchAppointments();
  }, [fetchSettings, fetchAppointments]);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, fetchAppointments]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchSlotsForDate]);

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch("/api/admin/appointments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Availability settings saved");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Appointment ${status.toLowerCase()}`);
        fetchAppointments();
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment/block?")) return;
    try {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Appointment/block deleted");
        fetchAppointments();
        fetchSlotsForDate(selectedDate);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const openBlockDialog = (slot: Slot) => {
    setSelectedSlot(slot);
    setBlockForm({
      bookingType: "BLOCKED",
      reason: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      serviceInterest: "",
    });
    setBlockDialogOpen(true);
  };

  const handleBlockSubmit = async () => {
    if (!selectedSlot) return;
    
    if (blockForm.bookingType === "ADMIN") {
      if (!blockForm.clientName.trim() || !blockForm.clientEmail.trim()) {
        toast.error("Client name and email are required for admin booking");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Extract time from the slot
      const startDate = new Date(selectedSlot.startAt);
      const endDate = new Date(selectedSlot.endAt);
      
      // Format in business timezone
      const timeFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: settings.timezone || "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      
      const startTime = timeFormatter.format(startDate);
      const endTime = timeFormatter.format(endDate);

      const response = await fetch("/api/admin/appointments/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          startTime,
          endTime,
          bookingType: blockForm.bookingType,
          reason: blockForm.reason,
          clientName: blockForm.clientName,
          clientEmail: blockForm.clientEmail,
          clientPhone: blockForm.clientPhone,
          serviceInterest: blockForm.serviceInterest,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(blockForm.bookingType === "BLOCKED" ? "Slot blocked" : "Appointment booked");
        setBlockDialogOpen(false);
        fetchAppointments();
        fetchSlotsForDate(selectedDate);
      } else {
        toast.error(data.error || "Failed to block/book slot");
      }
    } catch (error) {
      console.error("Error blocking/booking slot:", error);
      toast.error("Failed to block/book slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkBlock = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/appointments/block", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bulkBlockForm),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.data.message);
        setBulkBlockDialogOpen(false);
        fetchAppointments();
        fetchSlotsForDate(selectedDate);
      } else {
        toast.error(data.error || "Failed to bulk block slots");
      }
    } catch (error) {
      console.error("Error bulk blocking slots:", error);
      toast.error("Failed to bulk block slots");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Scheduling
          </p>
          <h1 className="font-display text-2xl tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage availability settings, block slots, and view booked appointments
          </p>
        </div>
      </div>

      {/* Availability Settings */}
      <div className="card-technical rounded-none">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center border border-hairline text-primary">
              <Clock className="h-4 w-4" />
            </span>
            Availability Settings
          </h2>
        </div>
        <div className="p-6 pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Set your daily availability. These settings apply to every day.
            Clients can book any slot within this time range.
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="startTime" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.startTime}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
              className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.endTime}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
              className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Slot Duration (minutes)</Label>
              <Select
                value={settings.slotDurationMinutes.toString()}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    slotDurationMinutes: parseInt(value, 10),
                  }))
                }
              >
                <SelectTrigger id="duration" className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="technical" onClick={saveSettings} disabled={isSavingSettings}>
                <Save className="mr-2 h-4 w-4" />
                {isSavingSettings ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Block/Book Slots Section */}
      <div className="card-technical rounded-none">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="flex items-center gap-2 font-display text-lg tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center border border-hairline text-primary">
                <CalendarPlus className="h-4 w-4" />
              </span>
              Block or Book Slots
            </h2>
            <Dialog open={bulkBlockDialogOpen} onOpenChange={setBulkBlockDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em] hover:border-signal/60 hover:text-signal">
                  <Ban className="mr-2 h-4 w-4" />
                  Bulk Block
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-sm border-hairline">
                <DialogHeader>
                  <DialogTitle className="font-display tracking-tight">Bulk Block Slots</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Start Date</Label>
                      <Input
                        type="date"
                        value={bulkBlockForm.startDate}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">End Date</Label>
                      <Input
                        type="date"
                        value={bulkBlockForm.endDate}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Start Time</Label>
                      <Input
                        type="time"
                        value={bulkBlockForm.startTime}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">End Time</Label>
                      <Input
                        type="time"
                        value={bulkBlockForm.endTime}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Reason (Optional)</Label>
                    <Input
                      value={bulkBlockForm.reason}
                      onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g., Holiday, Vacation, etc."
                    className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em] hover:border-signal/60 hover:text-signal">Cancel</Button>
                  </DialogClose>
                  <Button variant="technical" onClick={handleBulkBlock} disabled={isSubmitting}>
                    {isSubmitting ? "Blocking..." : "Block Slots"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <Label htmlFor="selectDate" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Select Date</Label>
                <Input
                  id="selectDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48 rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                />
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground pt-6">
                Timezone: {settings.timezone || "America/Los_Angeles"}
              </div>
            </div>

            {isLoadingSlots ? (
              <div className="h-32 border border-hairline bg-muted/20 animate-pulse" />
            ) : slots.length === 0 ? (
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground text-center py-8">
                No slots available for this date (check your settings).
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => !slot.isBooked && openBlockDialog(slot)}
                    disabled={slot.isBooked}
                    className={cn(
                      "p-2 font-mono text-xs rounded-sm border transition-colors",
                      slot.isBooked
                        ? "bg-muted/40 text-muted-foreground cursor-not-allowed border-hairline"
                        : "bg-background border-hairline hover:border-signal hover:bg-signal/10 hover:text-foreground cursor-pointer"
                    )}
                  >
                    {slot.localTime || new Date(slot.startAt).toLocaleTimeString([], { timeStyle: "short" })}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Click on an available slot to block it or book an appointment on behalf of a client.
              Grayed out slots are already booked.
            </p>
          </div>
        </div>
      </div>

      {/* Block/Book Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="max-w-md rounded-sm border-hairline">
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">
              {selectedSlot?.localTime} on {selectedDate}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Action Type</Label>
              <Select
                value={blockForm.bookingType}
                onValueChange={(value: "BLOCKED" | "ADMIN") =>
                  setBlockForm((prev) => ({ ...prev, bookingType: value }))
                }
              >
                <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLOCKED">
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4" />
                      Block Slot
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Book for Client
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {blockForm.bookingType === "BLOCKED" ? (
              <div>
                <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Reason (Optional)</Label>
                <Input
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Personal time, Lunch break"
                className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Client Name *</Label>
                  <Input
                    value={blockForm.clientName}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                  />
                </div>
                <div>
                  <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Client Email *</Label>
                  <Input
                    type="email"
                    value={blockForm.clientEmail}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@example.com"
                  className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                  />
                </div>
                <div>
                  <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Client Phone</Label>
                  <Input
                    value={blockForm.clientPhone}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="(optional)"
                  className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                  />
                </div>
                <div>
                  <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Service Interest</Label>
                  <Input
                    value={blockForm.serviceInterest}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, serviceInterest: e.target.value }))}
                    placeholder="(optional)"
                  className="rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60"
                  />
                </div>
                <div>
                  <Label className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Notes</Label>
                  <Textarea
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                    className="rounded-sm border-hairline focus-visible:ring-signal"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em] hover:border-signal/60 hover:text-signal">Cancel</Button>
            </DialogClose>
            <Button variant="technical" onClick={handleBlockSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : blockForm.bookingType === "BLOCKED" ? "Block Slot" : "Book Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointments List */}
      <div className="card-technical rounded-none">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="flex items-center gap-2 font-display text-lg tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center border border-hairline text-primary">
                <Calendar className="h-4 w-4" />
              </span>
              Booked Appointments & Blocked Slots
            </h2>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={cn(
                "w-40 rounded-sm border-hairline focus-visible:ring-signal hover:border-signal/60",
                statusFilter !== "all" && "border-signal bg-signal/10 text-foreground"
              )}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="REQUESTED">Requested</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="h-40 border border-hairline bg-muted/20 animate-pulse" />
          ) : appointments.length === 0 ? (
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground text-center py-8">
              No appointments or blocked slots found.
            </p>
          ) : (
            <div className="overflow-x-auto border border-hairline">
              <Table>
                <TableHeader>
                  <TableRow className="hairline-b hover:bg-transparent">
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Date & Time</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Type</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Name</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Email</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Service</TableHead>
                    <TableHead className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const StatusIcon = statusStyles[appointment.status].icon;
                    const bookingType = appointment.bookingType || "CLIENT";
                    const isBlocked = bookingType === "BLOCKED";
                    return (
                      <TableRow key={appointment.id} className="hairline-b hover:bg-muted/40">
                        <TableCell>
                          <div className="font-medium">
                            {formatDateTime(appointment.bookedAt)}
                          </div>
                          {appointment.timeZone && (
                            <div className="text-xs text-muted-foreground">
                              {appointment.timeZone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={cn(chipBase, bookingTypeStyles[bookingType].chip)}>
                            {bookingTypeStyles[bookingType].label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <>
                              <div>{appointment.name}</div>
                              {appointment.companyName && (
                                <div className="text-xs text-muted-foreground">
                                  {appointment.companyName}
                                </div>
                              )}
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <span className="text-muted-foreground">
                              {appointment.notes || "—"}
                            </span>
                          ) : (
                            <>
                              <div>{appointment.email}</div>
                              {appointment.phone && (
                                <div className="text-xs text-muted-foreground">
                                  {appointment.phone}
                                </div>
                              )}
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            appointment.serviceInterest || "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={cn(chipBase, statusStyles[appointment.status].chip)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusStyles[appointment.status].label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!isBlocked && appointment.status === "REQUESTED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
                                onClick={() =>
                                  updateStatus(appointment.id, "CONFIRMED")
                                }
                                title="Confirm"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {!isBlocked && appointment.status !== "CANCELLED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-sm border-hairline hover:border-signal/60 hover:text-signal"
                                onClick={() =>
                                  updateStatus(appointment.id, "CANCELLED")
                                }
                                title="Cancel"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-sm hover:text-signal"
                              onClick={() => deleteAppointment(appointment.id)}
                              title={isBlocked ? "Unblock" : "Delete"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
