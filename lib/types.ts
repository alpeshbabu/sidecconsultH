// ============================================
// Database Model Types
// ============================================

export type Role = "ADMIN" | "EDITOR" | "VIEWER";

export type InquiryStatus = "NEW" | "IN_PROGRESS" | "RESPONDED" | "ARCHIVED";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  serviceInterest: string;
  projectTimeline: string;
  message: string;
  status: InquiryStatus;
  isRead: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  categoryId: string;
  category?: Category;
  authorId: string;
  author?: User;
  status: PostStatus;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: Date | null;
  readingTime?: number | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  blogPosts?: BlogPost[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Form Types
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest: string;
  projectTimeline: string;
  message: string;
  privacyAccepted: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryId: string;
  status: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  order?: number;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Component Prop Types
// ============================================

export interface ServiceArea {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  unreadInquiries: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PostFilters {
  status?: PostStatus;
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// ============================================
// SEO Types
// ============================================

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noIndex?: boolean;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}
