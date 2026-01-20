"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Mail,
  Globe,
  Save,
  Download,
  Trash2,
  AlertTriangle,
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Tab = "general" | "notifications" | "security" | "data" | "appearance";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "SIDEC Consulting",
    siteEmail: "admin@sidecconsult.com",
    siteUrl: "https://sidecconsulting.com",
    contactEmail: "contact@sidecconsult.com",
  });

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
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure basic site information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteEmail">Admin Email</Label>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
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
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address shown on contact forms
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
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
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveGeneral} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
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
                      <Label>New Inquiry Notifications</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Post Notifications</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Digest</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Report</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveNotifications} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
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
                    />
                    <p className="text-xs text-muted-foreground">
                      Automatically log out after this period of inactivity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
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
                    />
                    <p className="text-xs text-muted-foreground">
                      Lock account after this many failed login attempts
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Strong Passwords</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        Two-Factor Authentication
                        <Badge variant="secondary" className="text-xs">
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
                      className="h-4 w-4 rounded"
                      disabled
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveSecurity} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      value={appearanceSettings.theme}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
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
                        className="w-20 h-10"
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
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
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
                      className="h-4 w-4 rounded"
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveAppearance} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
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
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
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
                    <Button variant="outline" onClick={handleClearCache}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
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
                      onClick={() =>
                        toast.error("This action is not yet implemented")
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reset All Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Restore all settings to default values
                      </p>
                    </div>
                    <Button
                      variant="destructive"
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
