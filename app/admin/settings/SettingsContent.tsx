"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  Download,
  Trash2,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { US_TIMEZONES as TIMEZONES, DEFAULT_TIMEZONE } from "@/lib/timezone";

type Tab = "general" | "notifications" | "security" | "data" | "appearance";

const SECTION_TITLE = "font-display tracking-tight flex items-center gap-2";
const FIELD_LABEL =
  "font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground";
const ICON_BOX =
  "flex h-8 w-8 shrink-0 items-center justify-center border border-hairline text-primary";
const INPUT_CLS = "rounded-sm border-hairline focus-visible:ring-signal";
const CHECKBOX_CLS =
  "h-4 w-4 rounded-sm border-hairline accent-[var(--signal)]";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [loadingTimezone, setLoadingTimezone] = useState(true);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Timezone state
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [savingTimezone, setSavingTimezone] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "SIDEC Consulting",
    siteEmail: "admin@sidecconsult.com",
    siteUrl: "https://sidecconsulting.com",
    contactEmail: "contact@sidecconsult.com",
  });

  // Load timezone from settings
  useEffect(() => {
    async function loadTimezone() {
      try {
        const res = await fetch("/api/admin/appointments/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.data?.timezone) {
            setTimezone(data.data.timezone);
          }
        }
      } catch (error) {
        console.error("Failed to load timezone:", error);
      } finally {
        setLoadingTimezone(false);
      }
    }
    loadTimezone();
  }, []);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewInquiry: true,
    emailOnNewPost: false,
    emailOnComment: false,
    dailyDigest: true,
    weeklyReport: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    requireStrongPassword: true,
    enableTwoFactor: false,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    accentColor: "#3b82f6",
    compactMode: false,
  });

  // Handle password change
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle timezone save
  const handleSaveTimezone = async () => {
    try {
      setSavingTimezone(true);
      const res = await fetch("/api/admin/appointments/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone }),
      });

      if (!res.ok) {
        throw new Error("Failed to save timezone");
      }

      toast.success("Timezone saved successfully");
    } catch (error) {
      toast.error("Failed to save timezone");
    } finally {
      setSavingTimezone(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      // TODO: Implement API call to save general settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      // TODO: Implement API call to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setSaving(true);
      // TODO: Implement API call to save security settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    try {
      setSaving(true);
      // TODO: Implement API call to save appearance settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Appearance settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    toast.info("Data export feature coming soon");
  };

  const handleClearCache = async () => {
    try {
      toast.success("Cache cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cache");
    }
  };

  const tabs = [
    { id: "general" as Tab, label: "General", icon: Settings },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
    { id: "security" as Tab, label: "Security", icon: Shield },
    { id: "appearance" as Tab, label: "Appearance", icon: Palette },
    { id: "data" as Tab, label: "Data", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="eyebrow mb-2">Settings</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 space-y-2">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] rounded-sm border transition-colors ${
                    activeTab === tab.id
                      ? "border-signal/40 bg-signal/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      activeTab === tab.id ? "text-signal" : ""
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <>
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Settings className="h-4 w-4" />
                  </span>
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure basic site information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className={FIELD_LABEL}>
                      Site Name
                    </Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteName: e.target.value,
                        })
                      }
                      placeholder="Enter site name"
                      className={INPUT_CLS}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteEmail" className={FIELD_LABEL}>
                      Admin Email
                    </Label>
                    <Input
                      id="siteEmail"
                      type="email"
                      value={generalSettings.siteEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteEmail: e.target.value,
                        })
                      }
                      placeholder="admin@example.com"
                      className={INPUT_CLS}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className={FIELD_LABEL}>
                      Contact Email
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="contact@example.com"
                      className={INPUT_CLS}
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address shown on contact forms
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl" className={FIELD_LABEL}>
                      Site URL
                    </Label>
                    <Input
                      id="siteUrl"
                      type="url"
                      value={generalSettings.siteUrl}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleSaveGeneral}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Timezone Settings */}
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Clock className="h-4 w-4" />
                  </span>
                  Business Timezone
                </CardTitle>
                <CardDescription>
                  Set the default timezone for appointment scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className={FIELD_LABEL}>
                      Default Timezone
                    </Label>
                    {loadingTimezone ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className={INPUT_CLS}>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Appointment slots will be displayed in this timezone
                    </p>
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleSaveTimezone}
                  disabled={savingTimezone || loadingTimezone}
                >
                  {savingTimezone ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {savingTimezone ? "Saving..." : "Save Timezone"}
                </Button>
              </CardContent>
            </Card>
            </>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Bell className="h-4 w-4" />
                  </span>
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>
                        New Inquiry Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone submits a contact inquiry
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnNewInquiry}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailOnNewInquiry: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>New Post Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a new blog post is published
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailOnNewPost}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailOnNewPost: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily summary of activity
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailyDigest}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          dailyDigest: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>Weekly Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly analytics report
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReport}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weeklyReport: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleSaveNotifications}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <>
            {/* Password Change Card */}
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Shield className="h-4 w-4" />
                  </span>
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your admin account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className={FIELD_LABEL}>
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className={INPUT_CLS}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 rounded-sm hover:bg-transparent hover:text-signal"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className={FIELD_LABEL}>
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className={INPUT_CLS}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 rounded-sm hover:bg-transparent hover:text-signal"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className={FIELD_LABEL}>
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                      className={INPUT_CLS}
                    />
                    {passwordData.newPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword === passwordData.confirmPassword && (
                        <p className="text-xs font-mono text-signal flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Passwords match
                        </p>
                      )}
                    {passwordData.newPassword &&
                      passwordData.confirmPassword &&
                      passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-xs font-mono text-destructive">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                >
                  {changingPassword ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  {changingPassword ? "Changing..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>

            {/* Other Security Settings Card */}
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Settings className="h-4 w-4" />
                  </span>
                  Security Preferences
                </CardTitle>
                <CardDescription>
                  Manage security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className={FIELD_LABEL}>
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                      }
                      min="5"
                      max="1440"
                      className={INPUT_CLS}
                    />
                    <p className="text-xs text-muted-foreground">
                      Automatically log out after this period of inactivity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className={FIELD_LABEL}>
                      Max Login Attempts
                    </Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: e.target.value,
                        })
                      }
                      min="3"
                      max="10"
                      className={INPUT_CLS}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lock account after this many failed login attempts
                    </p>
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>
                        Require Strong Passwords
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enforce minimum password complexity requirements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.requireStrongPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          requireStrongPassword: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={`${FIELD_LABEL} flex items-center gap-2`}>
                        Two-Factor Authentication
                        <Badge
                          variant="secondary"
                          className="rounded-sm font-mono text-[10px] uppercase tracking-[0.12em]"
                        >
                          Coming Soon
                        </Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enableTwoFactor}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableTwoFactor: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                      disabled
                    />
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleSaveSecurity}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
            </>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className={SECTION_TITLE}>
                  <span className={ICON_BOX}>
                    <Palette className="h-4 w-4" />
                  </span>
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className={FIELD_LABEL}>
                      Theme
                    </Label>
                    <select
                      id="theme"
                      value={appearanceSettings.theme}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: e.target.value,
                        })
                      }
                      className="w-full rounded-sm border border-hairline bg-background px-3 py-2 text-sm focus-visible:ring-signal focus-visible:ring-[3px] outline-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor" className={FIELD_LABEL}>
                      Accent Color
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={appearanceSettings.accentColor}
                        onChange={(e) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            accentColor: e.target.value,
                          })
                        }
                        className={`w-20 h-10 ${INPUT_CLS}`}
                      />
                      <Input
                        type="text"
                        value={appearanceSettings.accentColor}
                        onChange={(e) =>
                          setAppearanceSettings({
                            ...appearanceSettings,
                            accentColor: e.target.value,
                          })
                        }
                        className={`flex-1 ${INPUT_CLS}`}
                      />
                    </div>
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className={FIELD_LABEL}>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more condensed layout
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearanceSettings.compactMode}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          compactMode: e.target.checked,
                        })
                      }
                      className={CHECKBOX_CLS}
                    />
                  </div>
                </div>

                <Separator className="hairline-t border-0" />

                <Button
                  variant="technical"
                  onClick={handleSaveAppearance}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <Card className="card-technical rounded-none">
                <CardHeader>
                  <CardTitle className={SECTION_TITLE}>
                    <span className={ICON_BOX}>
                      <Database className="h-4 w-4" />
                    </span>
                    Data Export
                  </CardTitle>
                  <CardDescription>
                    Download your data in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export All Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download all inquiries, posts, and settings as JSON
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-technical rounded-none">
                <CardHeader>
                  <CardTitle className={SECTION_TITLE}>
                    <span className={ICON_BOX}>
                      <Database className="h-4 w-4" />
                    </span>
                    Cache Management
                  </CardTitle>
                  <CardDescription>
                    Clear cached data to improve performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Clear Application Cache</p>
                      <p className="text-sm text-muted-foreground">
                        Remove all cached data and temporary files
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleClearCache}
                      className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-technical rounded-none border-destructive">
                <CardHeader>
                  <CardTitle
                    className={`${SECTION_TITLE} text-destructive`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-destructive/40 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete All Inquiries</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all contact inquiries
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                      onClick={() =>
                        toast.error("This action is not yet implemented")
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <Separator className="hairline-t border-0" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reset All Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Restore all settings to default values
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="rounded-sm font-mono text-xs uppercase tracking-[0.12em]"
                      onClick={() =>
                        toast.error("This action is not yet implemented")
                      }
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
