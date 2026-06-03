"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Clock,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Sparkles,
  Upload,
  X,
  Plus,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  readingTime: number | null;
  categoryId: string | null;
  category: Category | null;
  tags?: TagItem[];
}

interface PostEditorProps {
  post: Post | null;
  categories: Category[];
  allTags: TagItem[];
  isNew: boolean;
}

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to calculate reading time
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function PostEditor({ post, categories, allTags, isNew }: PostEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tag state
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post?.tags?.map((t) => t.id) || []
  );
  const [availableTags, setAvailableTags] = useState<TagItem[]>(allTags);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    featuredImage: post?.featuredImage || "",
    status: post?.status || "DRAFT",
    categoryId: post?.categoryId || "",
    metaTitle: post?.metaTitle || "",
    metaDescription: post?.metaDescription || "",
  });

  // Track changes
  useEffect(() => {
    if (isNew) {
      setHasChanges(formData.title.length > 0 || formData.content.length > 0 || selectedTagIds.length > 0);
    } else {
      const originalTagIds = (post?.tags || []).map((t) => t.id).sort().join(",");
      const currentTagIds = [...selectedTagIds].sort().join(",");
      const tagsChanged = originalTagIds !== currentTagIds;
      const changed =
        formData.title !== (post?.title || "") ||
        formData.slug !== (post?.slug || "") ||
        formData.excerpt !== (post?.excerpt || "") ||
        formData.content !== (post?.content || "") ||
        formData.featuredImage !== (post?.featuredImage || "") ||
        formData.status !== (post?.status || "DRAFT") ||
        formData.categoryId !== (post?.categoryId || "") ||
        formData.metaTitle !== (post?.metaTitle || "") ||
        formData.metaDescription !== (post?.metaDescription || "") ||
        tagsChanged;
      setHasChanges(changed);
    }
  }, [formData, post, isNew, selectedTagIds]);

  // Close tag dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isNew && !prev.slug ? generateSlug(title) : prev.slug,
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  // Update form field
  const updateField = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError(null);

    // Validate file type client-side
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit");
      return;
    }

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (!result.success) {
        setUploadError(result.error || "Upload failed");
        return;
      }

      // Set the uploaded image URL
      updateField("featuredImage", result.data.url);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove featured image
  const removeImage = () => {
    updateField("featuredImage", "");
    setUploadError(null);
  };

  // Tag helpers
  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const removeTag = (tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
  };

  const createAndAddTag = async () => {
    const name = tagSearchQuery.trim();
    if (!name) return;

    setIsCreatingTag(true);
    try {
      const slug = generateSlug(name);
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const data = await response.json();
      if (data.success) {
        const newTag: TagItem = data.data;
        setAvailableTags((prev) => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
        setSelectedTagIds((prev) => [...prev, newTag.id]);
        setTagSearchQuery("");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsCreatingTag(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
      !selectedTagIds.includes(tag.id)
  );

  const selectedTags = availableTags.filter((tag) => selectedTagIds.includes(tag.id));

  const tagSearchHasExactMatch = availableTags.some(
    (tag) => tag.name.toLowerCase() === tagSearchQuery.trim().toLowerCase()
  );

  // Save post
  const savePost = async (publish: boolean = false) => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const status = publish ? "PUBLISHED" : formData.status;
      const readingTime = calculateReadingTime(formData.content);

      const payload = {
        ...formData,
        status,
        readingTime,
        categoryId: formData.categoryId || null,
        tagIds: selectedTagIds,
      };

      const url = isNew ? "/api/admin/posts" : `/api/admin/posts/${post?.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.error?.includes("slug")) {
          setErrors({ slug: data.error });
        } else {
          alert(data.error || "Failed to save post");
        }
        return;
      }

      // Redirect to posts list or stay on edit page
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate stats
  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = calculateReadingTime(formData.content);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-sm hover:text-signal" asChild>
            <Link href="/admin/posts">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">
              {isNew ? "Create" : "Edit"}
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
            {post && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "rounded-sm font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 inline-flex items-center border",
                    post.status === "PUBLISHED"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : post.status === "ARCHIVED"
                      ? "bg-muted text-muted-foreground border-hairline"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  )}
                >
                  {post.status}
                </span>
                {post.publishedAt && (
                  <span className="text-sm text-muted-foreground">
                    Published {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && post?.status === "PUBLISHED" && (
            <Button variant="outline" className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]" asChild>
              <Link href={`/resources/${post.slug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
            onClick={() => savePost(false)}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button variant="technical" onClick={() => savePost(true)} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      {/* Unsaved changes warning */}
      {hasChanges && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="font-mono text-xs uppercase tracking-[0.12em]">You have unsaved changes</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="card-technical rounded-none">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className={cn("rounded-sm border-hairline focus-visible:ring-signal", errors.title && "border-destructive")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      /resources/
                    </span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      className={cn("pl-24 rounded-sm border-hairline focus-visible:ring-signal", errors.slug && "border-destructive")}
                      placeholder="post-slug"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-sm border-hairline hover:text-signal"
                    onClick={() => updateField("slug", generateSlug(formData.title))}
                    title="Generate from title"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-hairline text-signal">
                  <FileText className="h-4 w-4" />
                </span>
                Content
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Write your post content. You can use markdown formatting.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Write your post content here..."
                  className={cn(
                    "min-h-[400px] font-mono text-sm rounded-sm border-hairline focus-visible:ring-signal",
                    errors.content && "border-destructive"
                  )}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  {wordCount} words
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight">Excerpt</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                A brief summary that appears in blog listings and social shares.
              </p>
            </div>
            <div className="p-6">
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Enter a brief summary..."
                className="min-h-[100px] rounded-sm border-hairline focus-visible:ring-signal"
                maxLength={300}
              />
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground mt-2">
                {formData.excerpt.length}/300 characters
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Category */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight">Settings</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Category</Label>
                <Select
                  value={formData.categoryId || "none"}
                  onValueChange={(value) => updateField("categoryId", value === "none" ? "" : value)}
                >
                  <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-hairline text-signal">
                  <TagIcon className="h-4 w-4" />
                </span>
                Tags
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Add tags for cross-cutting classification
              </p>
            </div>
            <div className="p-6 space-y-3">
              {/* Selected tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="gap-1 pr-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.1em]"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag search and dropdown */}
              <div className="relative" ref={tagDropdownRef}>
                <Input
                  placeholder="Search or create tags..."
                  value={tagSearchQuery}
                  onChange={(e) => {
                    setTagSearchQuery(e.target.value);
                    setShowTagDropdown(true);
                  }}
                  onFocus={() => setShowTagDropdown(true)}
                  className="text-sm rounded-sm border-hairline focus-visible:ring-signal"
                />

                {showTagDropdown && (tagSearchQuery || filteredTags.length > 0) && (
                  <div className="absolute z-50 mt-1 w-full rounded-sm border border-hairline bg-popover shadow-md max-h-48 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => {
                          toggleTag(tag.id);
                          setTagSearchQuery("");
                          setShowTagDropdown(false);
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                    {tagSearchQuery.trim() && !tagSearchHasExactMatch && (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-signal hover:bg-accent transition-colors hairline-t"
                        onClick={() => {
                          createAndAddTag();
                          setShowTagDropdown(false);
                        }}
                        disabled={isCreatingTag}
                      >
                        {isCreatingTag ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                        Create &quot;{tagSearchQuery.trim()}&quot;
                      </button>
                    )}
                    {filteredTags.length === 0 && !tagSearchQuery.trim() && (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        No more tags available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-hairline text-signal">
                  <ImageIcon className="h-4 w-4" />
                </span>
                Featured Image
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {formData.featuredImage ? (
                <div className="relative aspect-video bg-muted rounded-sm overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "aspect-video bg-muted/20 rounded-sm flex flex-col items-center justify-center cursor-pointer border border-dashed border-hairline hover:border-signal/60 hover:bg-muted/40 transition-colors",
                    isUploading && "pointer-events-none opacity-50"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-signal animate-spin" />
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-signal opacity-70" />
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG, GIF, WebP (max 5MB)
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload error message */}
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}

              {/* Upload button */}
              {!formData.featuredImage && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              )}

              {/* Or enter URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-hairline" />
                </div>
                <div className="relative flex justify-center font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span className="bg-card px-2 text-muted-foreground">Or enter URL</span>
                </div>
              </div>

              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) => updateField("featuredImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="rounded-sm border-hairline focus-visible:ring-signal"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="card-technical rounded-none">
            <div className="p-6 pb-0">
              <h2 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-hairline text-signal">
                  <Eye className="h-4 w-4" />
                </span>
                SEO Settings
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Optimize for search engines
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => updateField("metaTitle", e.target.value)}
                  placeholder={formData.title || "Enter meta title..."}
                  maxLength={60}
                  className="rounded-sm border-hairline focus-visible:ring-signal"
                />
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => updateField("metaDescription", e.target.value)}
                  placeholder={formData.excerpt || "Enter meta description..."}
                  className="min-h-[80px] rounded-sm border-hairline focus-visible:ring-signal"
                  maxLength={160}
                />
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <Separator className="bg-hairline" />

              {/* SEO Preview */}
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">Search Preview</Label>
                <div className="p-3 bg-muted/20 rounded-sm border border-hairline space-y-1">
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium line-clamp-1">
                    {formData.metaTitle || formData.title || "Post Title"}
                  </p>
                  <p className="text-green-700 dark:text-green-500 text-xs">
                    sidecconsult.com/resources/{formData.slug || "slug"}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {formData.metaDescription || formData.excerpt || "Meta description will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
