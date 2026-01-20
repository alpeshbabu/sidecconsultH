import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for collecting Web Vitals metrics
 * Receives metrics from the client and can store them or forward to analytics services
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, value, rating, delta, id, navigationType } = body;

    // Validate required fields
    if (!name || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log vitals in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals API]", {
        name,
        value: Math.round(name === "CLS" ? value * 1000 : value),
        rating,
        navigationType,
      });
    }

    // In production, you could:
    // 1. Store in database for analytics dashboard
    // 2. Forward to external analytics service (Google Analytics, Vercel Analytics, etc.)
    // 3. Send alerts if metrics exceed thresholds
    
    // Example: Store in database (uncomment when ready)
    // await prisma.webVital.create({
    //   data: {
    //     name,
    //     value,
    //     rating,
    //     delta,
    //     metricId: id,
    //     navigationType,
    //     url: request.headers.get("referer") || "",
    //     userAgent: request.headers.get("user-agent") || "",
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording web vital:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record metric" },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
