import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export async function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ success: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMs);

  const count = await prisma.rateLimitEntry.count({
    where: {
      key,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= limit) {
    return { success: false, remaining: 0 };
  }

  // Record this request
  await prisma.rateLimitEntry.create({
    data: { key },
  });

  // Probabilistic cleanup (~10% of requests)
  if (Math.random() < 0.1) {
    prisma.rateLimitEntry
      .deleteMany({
        where: { createdAt: { lt: windowStart } },
      })
      .catch((err) => console.error("Rate limit cleanup failed:", err));
  }

  return { success: true, remaining: limit - count - 1 };
}
