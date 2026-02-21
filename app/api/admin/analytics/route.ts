import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Fetch all stats in parallel
    const [
      totalInquiries,
      newInquiries,
      previousPeriodInquiries,
      unreadInquiries,
      inquiriesByStatus,
      publishedPosts,
      draftPosts,
      archivedPosts,
      recentInquiries,
      recentPosts,
      serviceInterests,
      inquiriesByMonth,
      // Appointment stats
      totalAppointments,
      appointmentsThisMonth,
      appointmentsByStatus,
      // Subscriber stats
      activeSubscribers,
      totalSubscribers,
      newSubscribers,
      // Chat stats
      totalChats,
      activeChats,
      convertedChats,
      chatsThisMonth,
      // Conversion funnel
      respondedInquiries,
      // Monthly time-series
      monthlyAppointmentsRaw,
      monthlySubscribersRaw,
      monthlyChatsRaw,
    ] = await Promise.all([
      // Total inquiries (all time)
      prisma.contactInquiry.count(),

      // New inquiries (last 30 days)
      prisma.contactInquiry.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Previous period inquiries (30-60 days ago) for trend calculation
      prisma.contactInquiry.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),

      // Unread inquiries
      prisma.contactInquiry.count({
        where: {
          isRead: false,
        },
      }),

      // Inquiries by status
      prisma.contactInquiry.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      // Published posts
      prisma.blogPost.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      // Draft posts
      prisma.blogPost.count({
        where: {
          status: "DRAFT",
        },
      }),

      // Archived posts
      prisma.blogPost.count({
        where: {
          status: "ARCHIVED",
        },
      }),

      // Recent inquiries (5 most recent)
      prisma.contactInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
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
      }),

      // Recent posts (5 most recent)
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),

      // Service interests breakdown
      prisma.contactInquiry.groupBy({
        by: ["serviceInterest"],
        _count: {
          serviceInterest: true,
        },
        orderBy: {
          _count: {
            serviceInterest: "desc",
          },
        },
      }),

      // Inquiries by month (last 6 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          COUNT(*) as count
        FROM contact_inquiries
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,

      // Total appointments (CLIENT + ADMIN only)
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

      // Appointments by status
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { status: true },
        where: { bookingType: { in: ["CLIENT", "ADMIN"] } },
      }),

      // Active subscribers
      prisma.subscriber.count({
        where: { isActive: true },
      }),

      // Total subscribers (including inactive)
      prisma.subscriber.count(),

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

      // Responded inquiries (for conversion funnel)
      prisma.contactInquiry.count({
        where: { status: "RESPONDED" },
      }),

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

    // Calculate trends
    const inquiryTrend = previousPeriodInquiries > 0
      ? Math.round(((newInquiries - previousPeriodInquiries) / previousPeriodInquiries) * 100)
      : newInquiries > 0 ? 100 : 0;

    // Format status counts
    const statusCounts = inquiriesByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Format service interests
    const formattedServiceInterests = serviceInterests.map((item) => ({
      service: item.serviceInterest,
      count: item._count.serviceInterest,
    }));

    // Format monthly inquiry data
    const monthlyData = inquiriesByMonth.map((item) => ({
      month: item.month,
      count: Number(item.count),
    }));

    // Format appointment status counts
    const appointmentStatusCounts = appointmentsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Build unified monthly activity
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const toMap = (raw: Array<{ month: string; count: bigint }>) =>
      Object.fromEntries(raw.map((r) => [r.month, Number(r.count)]));

    const inquiryMap = toMap(inquiriesByMonth);
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

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalInquiries,
          newInquiries,
          unreadInquiries,
          inquiryTrend,
          publishedPosts,
          draftPosts,
          archivedPosts,
          totalPosts: publishedPosts + draftPosts + archivedPosts,
        },
        inquiriesByStatus: statusCounts,
        serviceInterests: formattedServiceInterests,
        monthlyInquiries: monthlyData,
        recentInquiries,
        recentPosts,
        appointmentStats: {
          total: totalAppointments,
          thisMonth: appointmentsThisMonth,
          byStatus: appointmentStatusCounts,
        },
        subscriberStats: {
          active: activeSubscribers,
          total: totalSubscribers,
          newThisMonth: newSubscribers,
        },
        chatStats: {
          total: totalChats,
          active: activeChats,
          converted: convertedChats,
          thisMonth: chatsThisMonth,
          conversionRate: totalChats > 0
            ? Math.round((convertedChats / totalChats) * 100)
            : 0,
        },
        conversionFunnel: {
          totalInquiries,
          responded: respondedInquiries,
          appointments: totalAppointments,
        },
        monthlyActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
