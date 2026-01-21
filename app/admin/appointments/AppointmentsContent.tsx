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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
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
  REQUESTED: { label: "Requested", color: "secondary" as const, icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "default" as const, icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "destructive" as const, icon: XCircle },
};

const bookingTypeStyles = {
  CLIENT: { label: "Client", color: "default" as const },
  ADMIN: { label: "Admin Booking", color: "secondary" as const },
  BLOCKED: { label: "Blocked", color: "destructive" as const },
};

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
    timezone: "America/New_York",
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
          timezone: data.data.timezone || "America/New_York",
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
        timeZone: settings.timezone || "America/New_York",
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
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage availability settings, block slots, and view booked appointments
          </p>
        </div>
      </div>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Set your daily availability. These settings apply to every day.
            Clients can book any slot within this time range.
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="duration">Slot Duration (minutes)</Label>
              <Select
                value={settings.slotDurationMinutes.toString()}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    slotDurationMinutes: parseInt(value, 10),
                  }))
                }
              >
                <SelectTrigger id="duration">
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
              <Button onClick={saveSettings} disabled={isSavingSettings}>
                <Save className="mr-2 h-4 w-4" />
                {isSavingSettings ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block/Book Slots Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              Block or Book Slots
            </CardTitle>
            <Dialog open={bulkBlockDialogOpen} onOpenChange={setBulkBlockDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Ban className="mr-2 h-4 w-4" />
                  Bulk Block
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Block Slots</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={bulkBlockForm.startDate}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={bulkBlockForm.endDate}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={bulkBlockForm.startTime}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={bulkBlockForm.endTime}
                        onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Reason (Optional)</Label>
                    <Input
                      value={bulkBlockForm.reason}
                      onChange={(e) => setBulkBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                      placeholder="e.g., Holiday, Vacation, etc."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleBulkBlock} disabled={isSubmitting}>
                    {isSubmitting ? "Blocking..." : "Block Slots"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <Label htmlFor="selectDate">Select Date</Label>
                <Input
                  id="selectDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>
              <div className="text-sm text-muted-foreground pt-6">
                Timezone: {settings.timezone || "America/New_York"}
              </div>
            </div>

            {isLoadingSlots ? (
              <div className="h-32 rounded-lg bg-muted animate-pulse" />
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No slots available for this date (check your settings).
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => !slot.isBooked && openBlockDialog(slot)}
                    disabled={slot.isBooked}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      slot.isBooked
                        ? "bg-muted text-muted-foreground cursor-not-allowed border-muted"
                        : "bg-background hover:bg-primary hover:text-primary-foreground border-input hover:border-primary cursor-pointer"
                    }`}
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
        </CardContent>
      </Card>

      {/* Block/Book Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSlot?.localTime} on {selectedDate}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Action Type</Label>
              <Select
                value={blockForm.bookingType}
                onValueChange={(value: "BLOCKED" | "ADMIN") =>
                  setBlockForm((prev) => ({ ...prev, bookingType: value }))
                }
              >
                <SelectTrigger>
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
                <Label>Reason (Optional)</Label>
                <Input
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Personal time, Lunch break"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label>Client Name *</Label>
                  <Input
                    value={blockForm.clientName}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label>Client Email *</Label>
                  <Input
                    type="email"
                    value={blockForm.clientEmail}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <Label>Client Phone</Label>
                  <Input
                    value={blockForm.clientPhone}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="(optional)"
                  />
                </div>
                <div>
                  <Label>Service Interest</Label>
                  <Input
                    value={blockForm.serviceInterest}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, serviceInterest: e.target.value }))}
                    placeholder="(optional)"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={blockForm.reason}
                    onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleBlockSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : blockForm.bookingType === "BLOCKED" ? "Block Slot" : "Book Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booked Appointments & Blocked Slots
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 rounded-lg bg-muted animate-pulse" />
          ) : appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No appointments or blocked slots found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const StatusIcon = statusStyles[appointment.status].icon;
                    const bookingType = appointment.bookingType || "CLIENT";
                    const isBlocked = bookingType === "BLOCKED";
                    return (
                      <TableRow key={appointment.id}>
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
                          <Badge variant={bookingTypeStyles[bookingType].color}>
                            {bookingTypeStyles[bookingType].label}
                          </Badge>
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
                          <Badge variant={statusStyles[appointment.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusStyles[appointment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!isBlocked && appointment.status === "REQUESTED" && (
                              <Button
                                size="sm"
                                variant="outline"
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
        </CardContent>
      </Card>
    </div>
  );
}
