import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Mail,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Fetch dashboard analytics directly from database
async function getDashboardData() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel
    const [
      totalInquiries,
      newInquiries,
      previousPeriodInquiries,
      unreadInquiries,
      publishedPosts,
      draftPosts,
      recentInquiries,
      recentPosts,
      serviceInterestsCounts,
    ] = await Promise.all([
      // Total inquiries
      prisma.contactInquiry.count(),
      // New inquiries (last 30 days)
      prisma.contactInquiry.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      // Previous period inquiries (30-60 days ago)
      prisma.contactInquiry.count({
        where: {
          createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
      // Unread inquiries
      prisma.contactInquiry.count({
        where: { isRead: false },
      }),
      // Published posts
      prisma.blogPost.count({
        where: { status: "PUBLISHED" },
      }),
      // Draft posts
      prisma.blogPost.count({
        where: { status: "DRAFT" },
      }),
      // Recent inquiries
      prisma.contactInquiry.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
          serviceInterest: true,
          status: true,
          isRead: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // Recent posts
      prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      // Service interests
      prisma.contactInquiry.groupBy({
        by: ["serviceInterest"],
        _count: { serviceInterest: true },
        orderBy: { _count: { serviceInterest: "desc" } },
      }),
    ]);

    // Calculate trend
    const inquiryTrend = previousPeriodInquiries > 0
      ? Math.round(((newInquiries - previousPeriodInquiries) / previousPeriodInquiries) * 100)
      : newInquiries > 0 ? 100 : 0;

    // Format service interests
    const serviceInterests = serviceInterestsCounts.map((item) => ({
      service: item.serviceInterest,
      count: item._count.serviceInterest,
    })).slice(0, 7);

    return {
      stats: {
        totalInquiries,
        newInquiries,
        unreadInquiries,
        publishedPosts,
        draftPosts,
        inquiryTrend,
      },
      recentInquiries,
      recentPosts,
      serviceInterests,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return empty data on error
    return {
      stats: {
        totalInquiries: 0,
        newInquiries: 0,
        unreadInquiries: 0,
        publishedPosts: 0,
        draftPosts: 0,
        inquiryTrend: 0,
      },
      recentInquiries: [],
      recentPosts: [],
      serviceInterests: [],
    };
  }
}

// Format relative time
function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Format date
function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Service interest display names
const serviceDisplayNames: Record<string, string> = {
  "manufacturing-engineering": "Manufacturing Engineering",
  "quality-regulatory": "Quality & Regulatory",
  "injection-molding": "Process Excellence",
  "equipment-maintenance": "Equipment Maintenance",
  "facility-design": "Facility Design",
  "supplier-development": "Supplier Development",
  "strategic-advisory": "Strategic Advisory",
  "general": "General Inquiry",
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const { stats, recentInquiries, recentPosts, serviceInterests } = data;

  // Calculate max for chart scaling
  const maxServiceCount = serviceInterests.length > 0 
    ? Math.max(...serviceInterests.map(s => s.count)) 
    : 1;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your website today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time submissions
            </p>
          </CardContent>
        </Card>

        {/* New Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Inquiries
            </CardTitle>
            {stats.inquiryTrend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newInquiries}</div>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
              {stats.inquiryTrend !== 0 && (
                <span className={`text-xs font-medium ${stats.inquiryTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.inquiryTrend > 0 ? "+" : ""}{stats.inquiryTrend}%
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unread Inquiries */}
        <Card className={stats.unreadInquiries > 0 ? "border-destructive/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Inquiries
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.unreadInquiries > 0 ? "text-destructive" : ""}`}>
              {stats.unreadInquiries}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        {/* Published Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.draftPosts} drafts pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Inquiries - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </div>
            <Link href="/admin/inquiries">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {!inquiry.isRead && (
                        <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {serviceDisplayNames[inquiry.serviceInterest] || inquiry.serviceInterest}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge
                        variant={
                          inquiry.status === "NEW" ? "destructive" : 
                          inquiry.status === "IN_PROGRESS" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {inquiry.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
                        {formatRelativeTime(inquiry.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No inquiries yet</p>
                <p className="text-sm">Inquiries will appear here when visitors submit the contact form.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Interests Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Top Services</CardTitle>
            </div>
            <CardDescription>Most requested service areas</CardDescription>
          </CardHeader>
          <CardContent>
            {serviceInterests.length > 0 ? (
              <div className="space-y-3">
                {serviceInterests.map((item, index) => (
                  <div key={item.service} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">
                        {serviceDisplayNames[item.service] || item.service}
                      </span>
                      <span className="font-medium ml-2">{item.count}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(item.count / maxServiceCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <CardDescription>Latest blog articles</CardDescription>
          </div>
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant={
                        post.status === "PUBLISHED" ? "default" : 
                        post.status === "DRAFT" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {post.status}
                    </Badge>
                    {post.category && (
                      <Badge variant="outline" className="text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium line-clamp-2 flex-1">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {post.status === "PUBLISHED" && post.publishedAt
                      ? `Published ${formatDate(post.publishedAt)}`
                      : `Created ${formatDate(post.createdAt)}`
                    }
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No posts yet</p>
              <Link href="/admin/posts/new">
                <Button variant="link" className="mt-2">
                  Create your first post
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/posts/new">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Create Blog Post</span>
                </div>
              </Button>
            </Link>
            <Link href="/admin/inquiries">
              <Button variant="outline" className="w-full h-auto py-4 relative">
                <div className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span>View Inquiries</span>
                </div>
                {stats.unreadInquiries > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                  >
                    {stats.unreadInquiries}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Manage Categories</span>
                </div>
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="flex flex-col items-center gap-2">
                  <Eye className="h-6 w-6" />
                  <span>View Website</span>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
