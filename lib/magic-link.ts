import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";

// Single-use magic links expire quickly.
const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a single-use magic-link token for a user and return the raw token.
 * Only the SHA-256 hash is persisted, so a DB leak can't be replayed.
 */
export async function createMagicLink(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.magicLinkToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return token;
}

/**
 * Verify a raw token for the given email. If valid (unexpired, unused, owned by
 * a CLIENT user with that email), mark it used and return the user. Otherwise null.
 */
export async function verifyAndConsumeMagicLink(email: string, token: string) {
  if (!email || !token) return null;

  const record = await prisma.magicLinkToken.findFirst({
    where: {
      tokenHash: hashToken(token),
      usedAt: null,
      expiresAt: { gt: new Date() },
      user: { email: email.toLowerCase(), role: "CLIENT" },
    },
    include: { user: true },
  });

  if (!record) return null;

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  await prisma.user.update({
    where: { id: record.userId },
    data: { lastLoginAt: new Date() },
  });

  return record.user;
}
