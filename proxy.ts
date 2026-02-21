import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth pages that unauthenticated users should be able to access
const PUBLIC_ADMIN_PAGES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAuthApiRoute = pathname.startsWith("/api/auth");
  const isPublicAdminPage = PUBLIC_ADMIN_PAGES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Allow auth API routes to pass through (NextAuth handlers)
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Check for session token cookie (NextAuth v5 / Auth.js)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  // Redirect logged-in users away from public auth pages
  if (isPublicAdminPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect admin pages — redirect unauthenticated users to login
  if (isAdminRoute && !isPublicAdminPage && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin API routes — return 401 JSON
  if (isAdminApiRoute && !isLoggedIn) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  // Forward the pathname as a request header for server-side auth checks
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
