import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface PortalUser {
  id: string;
  email: string;
  name?: string | null;
}

/**
 * Returns the current CLIENT user, or null if not authenticated as a client.
 * Use in portal server components and API handlers. The proxy already enforces
 * a logged-in session; this additionally enforces the CLIENT role.
 */
export async function getPortalUser(): Promise<PortalUser | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

/**
 * Fetch a project only if it belongs to the given client. Returns null if it
 * doesn't exist or isn't owned by them — the core ownership check for the portal.
 */
export async function getOwnedProject(projectId: string, clientId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, clientId },
  });
}
