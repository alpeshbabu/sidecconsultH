"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Shield, Calendar, Save, Lock, Eye, EyeOff } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

const SECTION_TITLE = "font-display tracking-tight flex items-center gap-2";
const FIELD_LABEL =
  "font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground";
const ICON_BOX =
  "flex h-8 w-8 shrink-0 items-center justify-center border border-hairline text-primary";
const INPUT_CLS = "rounded-sm border-hairline focus-visible:ring-signal";

export function ProfileContent() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/profile", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      setProfileForm({
        name: data.name || "",
        email: data.email,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!profileForm.email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      // Update session if email changed
      if (updatedProfile.email !== session?.user?.email) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedProfile.name,
            email: updatedProfile.email,
          },
        });
      }

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!passwordForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await fetch("/api/admin/profile/password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="eyebrow mb-2">Account</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Profile Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and security settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information */}
        <Card className="card-technical rounded-none">
          <CardHeader>
            <CardTitle className={SECTION_TITLE}>
              <span className={ICON_BOX}>
                <User className="h-4 w-4" />
              </span>
              Account Information
            </CardTitle>
            <CardDescription>
              View your account details and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className={FIELD_LABEL}>User ID</Label>
              <div className="text-sm font-mono bg-muted/20 px-3 py-2 rounded-sm border border-hairline">
                {profile?.id}
              </div>
            </div>

            <div className="space-y-2">
              <Label className={FIELD_LABEL}>Role</Label>
              <div>
                <Badge
                  variant="default"
                  className="rounded-sm bg-signal/10 text-foreground border-signal/30 font-mono text-xs uppercase tracking-[0.12em]"
                >
                  <Shield className="h-3 w-3 mr-1 text-signal" />
                  {profile?.role}
                </Badge>
              </div>
            </div>

            <Separator className="hairline-t border-0" />

            <div className="space-y-2">
              <Label className={`${FIELD_LABEL} flex items-center gap-2`}>
                <Calendar className="h-4 w-4" />
                Account Created
              </Label>
              <div className="text-sm">{formatDate(profile?.createdAt || null)}</div>
            </div>

            <div className="space-y-2">
              <Label className={`${FIELD_LABEL} flex items-center gap-2`}>
                <Calendar className="h-4 w-4" />
                Last Updated
              </Label>
              <div className="text-sm">{formatDate(profile?.updatedAt || null)}</div>
            </div>

            <div className="space-y-2">
              <Label className={`${FIELD_LABEL} flex items-center gap-2`}>
                <Calendar className="h-4 w-4" />
                Last Login
              </Label>
              <div className="text-sm">{formatDate(profile?.lastLoginAt || null)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="card-technical rounded-none">
          <CardHeader>
            <CardTitle className={SECTION_TITLE}>
              <span className={ICON_BOX}>
                <Mail className="h-4 w-4" />
              </span>
              Edit Profile
            </CardTitle>
            <CardDescription>
              Update your name and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={FIELD_LABEL}>
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                  className={INPUT_CLS}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={FIELD_LABEL}>
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                  className={INPUT_CLS}
                />
                <p className="text-xs text-muted-foreground">
                  Changing your email will require you to log in again
                </p>
              </div>

              <Button
                type="submit"
                variant="technical"
                disabled={saving}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change Password */}
      <Card className="card-technical rounded-none">
        <CardHeader>
          <CardTitle className={SECTION_TITLE}>
            <span className={ICON_BOX}>
              <Lock className="h-4 w-4" />
            </span>
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className={FIELD_LABEL}>
                Current Password *
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  required
                  className={INPUT_CLS}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 rounded-sm hover:text-signal"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className={FIELD_LABEL}>
                New Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className={INPUT_CLS}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 rounded-sm hover:text-signal"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={FIELD_LABEL}>
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className={INPUT_CLS}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 rounded-sm hover:text-signal"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="technical"
              disabled={changingPassword}
            >
              <Lock className="mr-2 h-4 w-4" />
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
