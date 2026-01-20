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

    // Format monthly data
    const monthlyData = inquiriesByMonth.map((item) => ({
      month: item.month,
      count: Number(item.count),
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
