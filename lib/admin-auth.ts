import { auth } from "@/lib/auth";

/**
 * Returns the session if the current user is an ADMIN or EDITOR, otherwise null.
 * The proxy only verifies that a session cookie exists (it can't read the role),
 * so admin API handlers that touch sensitive data must call this to keep CLIENT
 * users out.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return null;
  }
  return session;
}
