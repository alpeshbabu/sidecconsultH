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
  Calendar,
  Users,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import {
  MonthlyActivityChart,
  InquiryStatusChart,
  ConversionFunnel,
} from "@/components/admin/charts";

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
      // Appointment queries
      totalAppointments,
      appointmentsThisMonth,
      // Subscriber queries
      activeSubscribers,
      newSubscribers,
      // Chat queries
      totalChats,
      activeChats,
      convertedChats,
      chatsThisMonth,
      // Inquiry status breakdown
      inquiryStatusCounts,
      respondedInquiries,
      // Monthly time-series (raw SQL)
      monthlyInquiriesRaw,
      monthlyAppointmentsRaw,
      monthlySubscribersRaw,
      monthlyChatsRaw,
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
      // Total appointments (CLIENT + ADMIN only, not BLOCKED)
      prisma.appointment.count({
        where: { bookingType: { in: ["CLIENT", "ADMIN"] } },
      }),
      // Appointments this month
      prisma.appointment.count({
        where: {
          bookingType: { in: ["CLIENT", "ADMIN"] },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      // Active subscribers
      prisma.subscriber.count({
        where: { isActive: true },
      }),
      // New subscribers this month
      prisma.subscriber.count({
        where: { subscribedAt: { gte: thirtyDaysAgo } },
      }),
      // Total chat conversations
      prisma.chatConversation.count(),
      // Active chats
      prisma.chatConversation.count({
        where: { status: "ACTIVE" },
      }),
      // Converted chats
      prisma.chatConversation.count({
        where: { status: "CONVERTED" },
      }),
      // Chats this month
      prisma.chatConversation.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      // Inquiry status breakdown
      prisma.contactInquiry.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      // Responded inquiries (for conversion funnel)
      prisma.contactInquiry.count({
        where: { status: "RESPONDED" },
      }),
      // Monthly inquiries (6 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*) as count
        FROM contact_inquiries
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
      // Monthly appointments (6 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*) as count
        FROM appointments
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
          AND "bookingType" IN ('CLIENT', 'ADMIN')
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
      // Monthly subscribers (6 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "subscribedAt"), 'YYYY-MM') as month,
          COUNT(*) as count
        FROM subscribers
        WHERE "subscribedAt" >= NOW() - INTERVAL '6 months'
          AND "isActive" = true
        GROUP BY DATE_TRUNC('month', "subscribedAt")
        ORDER BY month ASC
      `,
      // Monthly chats (6 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*) as count
        FROM chat_conversations
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
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

    // Format inquiry status for donut chart
    const statusDisplayNames: Record<string, string> = {
      NEW: "New",
      IN_PROGRESS: "In Progress",
      RESPONDED: "Responded",
      ARCHIVED: "Archived",
    };
    const inquiryStatusBreakdown = inquiryStatusCounts.map((item) => ({
      name: statusDisplayNames[item.status] || item.status,
      value: item._count.status,
    }));

    // Build monthly activity time-series
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const toMap = (raw: Array<{ month: string; count: bigint }>) =>
      Object.fromEntries(raw.map((r) => [r.month, Number(r.count)]));

    const inquiryMap = toMap(monthlyInquiriesRaw);
    const appointmentMap = toMap(monthlyAppointmentsRaw);
    const subscriberMap = toMap(monthlySubscribersRaw);
    const chatMap = toMap(monthlyChatsRaw);

    const monthlyActivity = months.map((month) => ({
      month,
      label: new Date(month + "-01").toLocaleDateString("en-US", { month: "short" }),
      inquiries: inquiryMap[month] || 0,
      appointments: appointmentMap[month] || 0,
      subscribers: subscriberMap[month] || 0,
      chats: chatMap[month] || 0,
    }));

    return {
      stats: {
        totalInquiries,
        newInquiries,
        unreadInquiries,
        publishedPosts,
        draftPosts,
        inquiryTrend,
        totalAppointments,
        appointmentsThisMonth,
        activeSubscribers,
        newSubscribers,
        totalChats,
        activeChats,
        convertedChats,
        chatsThisMonth,
        respondedInquiries,
      },
      recentInquiries,
      recentPosts,
      serviceInterests,
      inquiryStatusBreakdown,
      monthlyActivity,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        totalInquiries: 0,
        newInquiries: 0,
        unreadInquiries: 0,
        publishedPosts: 0,
        draftPosts: 0,
        inquiryTrend: 0,
        totalAppointments: 0,
        appointmentsThisMonth: 0,
        activeSubscribers: 0,
        newSubscribers: 0,
        totalChats: 0,
        activeChats: 0,
        convertedChats: 0,
        chatsThisMonth: 0,
        respondedInquiries: 0,
      },
      recentInquiries: [],
      recentPosts: [],
      serviceInterests: [],
      inquiryStatusBreakdown: [],
      monthlyActivity: [],
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

// Mono chip helper for inquiry status badges
function inquiryStatusChipClass(status: string): string {
  switch (status) {
    case "NEW":
      return "border border-destructive/30 bg-destructive/10 text-destructive";
    case "IN_PROGRESS":
      return "border border-primary/30 bg-primary/10 text-primary";
    default:
      return "border border-hairline text-muted-foreground";
  }
}

// Mono chip helper for post status badges
function postStatusChipClass(status: string): string {
  switch (status) {
    case "PUBLISHED":
      return "border border-primary/30 bg-primary/10 text-primary";
    case "DRAFT":
      return "border border-hairline bg-muted/20 text-muted-foreground";
    default:
      return "border border-hairline text-muted-foreground";
  }
}

const sectionLabelClass =
  "font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const {
    stats,
    recentInquiries,
    recentPosts,
    serviceInterests,
    inquiryStatusBreakdown,
    monthlyActivity,
  } = data;

  // Calculate max for service chart scaling
  const maxServiceCount = serviceInterests.length > 0
    ? Math.max(...serviceInterests.map(s => s.count))
    : 1;

  const chatConversionRate = stats.totalChats > 0
    ? Math.round((stats.convertedChats / stats.totalChats) * 100)
    : 0;

  // Stat card config
  const statCards = [
    {
      label: "Total Inquiries",
      value: stats.totalInquiries,
      caption: "All time submissions",
      icon: MessageSquare,
    },
    {
      label: "Published Posts",
      value: stats.publishedPosts,
      caption: `${stats.draftPosts} drafts pending`,
      icon: FileText,
    },
    {
      label: "Appointments",
      value: stats.totalAppointments,
      caption: `${stats.appointmentsThisMonth} this month`,
      icon: Calendar,
    },
    {
      label: "Subscribers",
      value: stats.activeSubscribers,
      caption: `+${stats.newSubscribers} this month`,
      icon: Users,
    },
    {
      label: "Chat Sessions",
      value: stats.totalChats,
      caption: `${stats.activeChats} active now`,
      icon: Bot,
    },
    {
      label: "Chat Conversions",
      value: stats.convertedChats,
      caption: `${chatConversionRate}% conversion rate`,
      icon: ArrowRight,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Admin Overview</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your website today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="technical">
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* New Inquiries (with trend) */}
        <div className="card-technical rounded-none p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-px bg-signal" />
              <span className={sectionLabelClass}>New Inquiries</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center border border-hairline text-primary">
              {stats.inquiryTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          <div className="mt-4 font-display text-3xl font-bold tracking-tight">
            {stats.newInquiries}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              Last 30 days
            </p>
            {stats.inquiryTrend !== 0 && (
              <span
                className={`font-mono text-[11px] font-medium ${stats.inquiryTrend >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {stats.inquiryTrend > 0 ? "+" : ""}{stats.inquiryTrend}%
              </span>
            )}
          </div>
        </div>

        {/* Unread Inquiries (alert-aware) */}
        <div
          className={`card-technical rounded-none p-5 ${stats.unreadInquiries > 0 ? "border-destructive/50" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-px bg-signal" />
              <span className={sectionLabelClass}>Unread Inquiries</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center border border-hairline text-primary">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`mt-4 font-display text-3xl font-bold tracking-tight ${stats.unreadInquiries > 0 ? "text-destructive" : ""}`}
          >
            {stats.unreadInquiries}
          </div>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            Awaiting review
          </p>
        </div>

        {/* Remaining stat cards */}
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-technical rounded-none p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-px bg-signal" />
                  <span className={sectionLabelClass}>{card.label}</span>
                </div>
                <div className="flex h-9 w-9 items-center justify-center border border-hairline text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 font-display text-3xl font-bold tracking-tight">
                {card.value}
              </div>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {card.caption}
              </p>
            </div>
          );
        })}
      </div>

      {/* Monthly Activity Chart */}
      <div className="card-technical rounded-none">
        <div className="p-5 hairline-b">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Monthly Activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Inquiries, appointments, subscribers, and chats over the last 6 months
          </p>
        </div>
        <div className="p-5">
          {monthlyActivity.length > 0 &&
          monthlyActivity.some(
            (m) => m.inquiries + m.appointments + m.subscribers + m.chats > 0
          ) ? (
            <MonthlyActivityChart data={monthlyActivity} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p className="font-mono text-xs uppercase tracking-[0.12em]">
                No activity data yet. Charts will appear as data accumulates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Inquiries + Inquiry Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Inquiries - Takes 2 columns */}
        <div className="card-technical rounded-none lg:col-span-2">
          <div className="flex flex-row items-center justify-between p-5 hairline-b">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Recent Inquiries
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest contact form submissions
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-sm hover:text-signal"
              asChild
            >
              <Link href="/admin/inquiries">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="p-5">
            {recentInquiries.length > 0 ? (
              <div className="space-y-px border border-hairline">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-muted/20"
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
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${inquiryStatusChipClass(inquiry.status)}`}
                      >
                        {inquiry.status.replace("_", " ")}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap hidden sm:inline">
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
          </div>
        </div>

        {/* Inquiry Status Donut Chart */}
        <div className="card-technical rounded-none">
          <div className="p-5 hairline-b">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Inquiry Status
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Breakdown by current status
            </p>
          </div>
          <div className="p-5">
            <InquiryStatusChart data={inquiryStatusBreakdown} />
          </div>
        </div>
      </div>

      {/* Conversion Funnel + Top Services + Chat Engagement */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversion Funnel */}
        <div className="card-technical rounded-none">
          <div className="p-5 hairline-b">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Conversion Funnel
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              From inquiry to appointment
            </p>
          </div>
          <div className="p-5">
            <ConversionFunnel
              totalInquiries={stats.totalInquiries}
              respondedInquiries={stats.respondedInquiries}
              totalAppointments={stats.totalAppointments}
            />
          </div>
        </div>

        {/* Top Services */}
        <div className="card-technical rounded-none">
          <div className="p-5 hairline-b">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Top Services
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Most requested service areas
            </p>
          </div>
          <div className="p-5">
            {serviceInterests.length > 0 ? (
              <div className="space-y-3">
                {serviceInterests.map((item) => (
                  <div key={item.service} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1">
                        {serviceDisplayNames[item.service] || item.service}
                      </span>
                      <span className="font-mono text-xs ml-2">{item.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-none border border-hairline bg-muted/20">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(item.count / maxServiceCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="font-mono text-xs uppercase tracking-[0.12em]">No data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Engagement */}
        <div className="card-technical rounded-none">
          <div className="p-5 hairline-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Chat Engagement
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              AI chatbot performance
            </p>
          </div>
          <div className="p-5">
            {stats.totalChats > 0 ? (
              <div className="divide-y divide-[var(--hairline-color)] border border-hairline">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    Total Sessions
                  </span>
                  <span className="font-display font-bold">{stats.totalChats}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    Active Now
                  </span>
                  <span className="font-display font-bold text-green-600">{stats.activeChats}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    Converted
                  </span>
                  <span className="font-display font-bold">{stats.convertedChats}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    Conversion Rate
                  </span>
                  <span className="font-display font-bold">{chatConversionRate}%</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-display font-bold">{stats.chatsThisMonth}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="font-mono text-xs uppercase tracking-[0.12em]">No chat data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card-technical rounded-none">
        <div className="flex flex-row items-center justify-between p-5 hairline-b">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Recent Posts
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest blog articles</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-sm hover:text-signal"
            asChild
          >
            <Link href="/admin/posts">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="p-5">
          {recentPosts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col card-technical rounded-none p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${postStatusChipClass(post.status)}`}
                    >
                      {post.status}
                    </span>
                    {post.category && (
                      <span className="rounded-sm border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <p className="font-medium line-clamp-2 flex-1">{post.title}</p>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
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
              <Button variant="link" className="mt-2 hover:text-signal" asChild>
                <Link href="/admin/posts/new">
                  Create your first post
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-technical rounded-none">
        <div className="p-5 hairline-b">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Quick Actions
          </h2>
        </div>
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/posts/new"
              className="group card-technical rounded-none flex flex-col items-center gap-3 py-6"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                <FileText className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-semibold transition-colors group-hover:text-signal">
                Create Blog Post
              </span>
            </Link>
            <Link
              href="/admin/inquiries"
              className="group card-technical rounded-none relative flex flex-col items-center gap-3 py-6"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                <MessageSquare className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-semibold transition-colors group-hover:text-signal">
                View Inquiries
              </span>
              {stats.unreadInquiries > 0 && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-sm border border-destructive/30 bg-destructive/10 font-mono text-[10px] font-medium text-destructive">
                  {stats.unreadInquiries}
                </span>
              )}
            </Link>
            <Link
              href="/admin/categories"
              className="group card-technical rounded-none flex flex-col items-center gap-3 py-6"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                <Plus className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-semibold transition-colors group-hover:text-signal">
                Manage Categories
              </span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="group card-technical rounded-none flex flex-col items-center gap-3 py-6"
            >
              <span className="flex h-11 w-11 items-center justify-center border border-hairline text-primary transition-colors group-hover:border-signal/60 group-hover:text-signal">
                <Eye className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-semibold transition-colors group-hover:text-signal">
                View Website
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
