import { z } from "zod/v4";

// ============================================
// Contact Inquiry Form Schema
// ============================================

export const contactInquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),

  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .optional(),

  companyName: z
    .string()
    .max(200, "Company name must be less than 200 characters")
    .optional(),

  serviceInterest: z
    .string()
    .min(1, "Please select a service area"),

  projectTimeline: z
    .string()
    .min(1, "Please select a timeline"),

  message: z
    .string()
    .min(500, "Please provide more details (at least 500 characters)")
    .max(5000, "Message must be less than 5000 characters"),

  // Service-specific optional fields
  supplierAddress: z
    .string()
    .max(1000, "Address must be less than 1000 characters")
    .optional()
    .or(z.literal("")),

  estimatedBudget: z
    .string()
    .max(200, "Budget must be less than 200 characters")
    .optional()
    .or(z.literal("")),

  otherSites: z
    .string()
    .max(2000, "Other sites must be less than 2000 characters")
    .optional()
    .or(z.literal("")),

  otherSiteLocations: z
    .string()
    .max(2000, "Site locations must be less than 2000 characters")
    .optional()
    .or(z.literal("")),

  expectedDocuments: z
    .string()
    .max(3000, "Expected documents must be less than 3000 characters")
    .optional()
    .or(z.literal("")),

  regulatoryStandards: z
    .string()
    .max(3000, "Regulatory standards must be less than 3000 characters")
    .optional()
    .or(z.literal("")),

  privacyAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the privacy policy to submit",
    }),
});

export type ContactInquiryFormValues = z.infer<typeof contactInquirySchema>;

// ============================================
// Login Form Schema
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================
// Blog Post Form Schema
// ============================================

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),

  content: z
    .string()
    .min(100, "Content must be at least 100 characters"),

  featuredImage: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),

  categoryId: z
    .string()
    .min(1, "Please select a category"),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    message: "Please select a valid status",
  }),

  metaTitle: z
    .string()
    .max(70, "Meta title should be less than 70 characters for SEO")
    .optional(),

  metaDescription: z
    .string()
    .max(160, "Meta description should be less than 160 characters for SEO")
    .optional(),

  publishedAt: z.coerce.date().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Create variant for creating new posts (slug can be auto-generated)
export const createBlogPostSchema = blogPostSchema.extend({
  slug: z
    .string()
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
});

export type CreateBlogPostFormValues = z.infer<typeof createBlogPostSchema>;

// ============================================
// Category Form Schema
// ============================================

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order must be 0 or greater")
    .default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// Create variant for creating new categories (slug can be auto-generated)
export const createCategorySchema = categorySchema.extend({
  slug: z
    .string()
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

// ============================================
// Admin Inquiry Update Schema
// ============================================

export const updateInquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "ARCHIVED"], {
    message: "Please select a valid status",
  }).optional(),

  isRead: z.boolean().optional(),

  internalNotes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional(),

  supplierAddress: z
    .string()
    .max(1000, "Address must be less than 1000 characters")
    .optional(),

  estimatedBudget: z
    .string()
    .max(200, "Estimated budget must be less than 200 characters")
    .optional(),

  otherSites: z
    .string()
    .max(2000, "Other sites must be less than 2000 characters")
    .optional(),

  otherSiteLocations: z
    .string()
    .max(2000, "Site locations must be less than 2000 characters")
    .optional(),

  expectedDocuments: z
    .string()
    .max(3000, "Expected documents must be less than 3000 characters")
    .optional(),

  regulatoryStandards: z
    .string()
    .max(3000, "Regulatory standards must be less than 3000 characters")
    .optional(),
});

export type UpdateInquiryFormValues = z.infer<typeof updateInquirySchema>;

// ============================================
// Password Reset Schemas
// ============================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// ============================================
// Newsletter Subscription Schema
// ============================================

export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),

  firstName: z
    .string()
    .max(50, "First name must be less than 50 characters")
    .optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Calculate estimated reading time for content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Validate that a slug is unique (to be used with database check)
 */
export function createUniqueSlugValidator(
  checkFn: (slug: string) => Promise<boolean>
) {
  return z.string().refine(async (slug) => await checkFn(slug), {
    message: "This slug is already in use",
  });
}
