"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Save,
  Trash2,
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

interface Appointment {
  id: string;
  bookedAt: string;
  bookedEndAt: string;
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
}

const statusStyles = {
  REQUESTED: { label: "Requested", color: "secondary" as const, icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "default" as const, icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "destructive" as const, icon: XCircle },
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AvailabilitySettings>({
    startTime: "08:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSettings();
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/appointments/settings");
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          startTime: data.data.startTime,
          endTime: data.data.endTime,
          slotDurationMinutes: data.data.slotDurationMinutes,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchAppointments = async () => {
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
  };

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
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Appointment deleted");
        fetchAppointments();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage availability settings and view booked appointments
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

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booked Appointments
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
              No appointments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
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
                          <div>{appointment.name}</div>
                          {appointment.companyName && (
                            <div className="text-xs text-muted-foreground">
                              {appointment.companyName}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{appointment.email}</div>
                          {appointment.phone && (
                            <div className="text-xs text-muted-foreground">
                              {appointment.phone}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {appointment.serviceInterest || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusStyles[appointment.status].color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusStyles[appointment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {appointment.status === "REQUESTED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatus(appointment.id, "CONFIRMED")
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {appointment.status !== "CANCELLED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatus(appointment.id, "CANCELLED")
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteAppointment(appointment.id)}
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
