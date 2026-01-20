"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ServiceEditorProps {
  serviceId: string;
}

const SERVICE_CATEGORIES = [
  {
    name: "Manufacturing & Operations",
    slug: "manufacturing-operations",
    icon: "Factory",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
  },
  {
    name: "Quality & Compliance",
    slug: "quality-compliance",
    icon: "Scale",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/30",
  },
  {
    name: "Process & Technical Excellence",
    slug: "process-technical",
    icon: "Layers",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/30",
  },
  {
    name: "Strategy & Supply Chain",
    slug: "strategy-supply-chain",
    icon: "Rocket",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/30",
  },
];

const ICON_OPTIONS = [
  "Settings",
  "Wrench",
  "ShieldCheck",
  "Cog",
  "Building",
  "Globe",
  "Lightbulb",
  "Factory",
  "Scale",
  "Layers",
  "Rocket",
  "Sparkles",
  "Target",
  "Users",
  "Zap",
];

export function ServiceEditor({ serviceId }: ServiceEditorProps) {
  const router = useRouter();
  const isNew = serviceId === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    categoryName: "",
    categorySlug: "",
    categoryIcon: "",
    categoryColor: "",
    categoryBorder: "",
    serviceId: "",
    icon: "",
    title: "",
    tagline: "",
    description: "",
    keyOfferings: [""],
    outcomes: [""],
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (!isNew) {
      fetchService();
    }
  }, [serviceId, isNew]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch service");
      }

      const service = await response.json();
      setFormData({
        categoryName: service.categoryName,
        categorySlug: service.categorySlug,
        categoryIcon: service.categoryIcon || "",
        categoryColor: service.categoryColor || "",
        categoryBorder: service.categoryBorder || "",
        serviceId: service.serviceId,
        icon: service.icon || "",
        title: service.title,
        tagline: service.tagline || "",
        description: service.description,
        keyOfferings: service.keyOfferings.length > 0 ? service.keyOfferings : [""],
        outcomes: service.outcomes.length > 0 ? service.outcomes : [""],
        isActive: service.isActive,
        sortOrder: service.sortOrder,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug: string) => {
    const category = SERVICE_CATEGORIES.find((c) => c.slug === slug);
    if (category) {
      setFormData((prev) => ({
        ...prev,
        categoryName: category.name,
        categorySlug: category.slug,
        categoryIcon: category.icon,
        categoryColor: category.color,
        categoryBorder: category.border,
      }));
    }
  };

  const handleArrayAdd = (field: "keyOfferings" | "outcomes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleArrayRemove = (field: "keyOfferings" | "outcomes", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (
    field: "keyOfferings" | "outcomes",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categorySlug) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.serviceId) {
      toast.error("Please enter a service ID");
      return;
    }
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.description) {
      toast.error("Please enter a description");
      return;
    }

    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      keyOfferings: formData.keyOfferings.filter((item) => item.trim() !== ""),
      outcomes: formData.outcomes.filter((item) => item.trim() !== ""),
    };

    try {
      setSaving(true);
      const url = isNew
        ? "/api/admin/services"
        : `/api/admin/services/${serviceId}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to save service");
      }

      toast.success(isNew ? "Service created successfully" : "Service updated successfully");
      router.push("/admin/services");
      router.refresh();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg font-medium">Loading service...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/services")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "Add New Service" : "Edit Service"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNew
                ? "Create a new service offering"
                : "Update service information"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential service details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categorySlug}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service ID */}
            <div className="space-y-2">
              <Label htmlFor="serviceId">Service ID *</Label>
              <Input
                id="serviceId"
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
                placeholder="e.g., manufacturing-engineering"
                disabled={!isNew}
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier used in URLs. Cannot be changed after creation.
              </p>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData({ ...formData, icon: value })
                }
              >
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Manufacturing Engineering & Operations"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g., Build World-Class Manufacturing Capabilities"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description of the service..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Offerings */}
        <Card>
          <CardHeader>
            <CardTitle>Key Offerings</CardTitle>
            <CardDescription>
              List of what you deliver in this service area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.keyOfferings.map((offering, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={offering}
                  onChange={(e) =>
                    handleArrayChange("keyOfferings", index, e.target.value)
                  }
                  placeholder="Enter a key offering..."
                />
                {formData.keyOfferings.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove("keyOfferings", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("keyOfferings")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Offering
            </Button>
          </CardContent>
        </Card>

        {/* Expected Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Outcomes</CardTitle>
            <CardDescription>
              Measurable results clients can expect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.outcomes.map((outcome, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={outcome}
                  onChange={(e) =>
                    handleArrayChange("outcomes", index, e.target.value)
                  }
                  placeholder="Enter an expected outcome..."
                />
                {formData.outcomes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove("outcomes", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("outcomes")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Outcome
            </Button>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Control how and where this service appears
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first. Use this to control the display order.
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-4">
              <Label htmlFor="isActive">Status</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="font-normal">
                  {formData.isActive ? (
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
