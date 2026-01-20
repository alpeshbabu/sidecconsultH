import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes (admin routes except login)
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAuthApiRoute = pathname.startsWith("/api/auth");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  // Allow auth API routes to pass through
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Check for session token cookie (NextAuth uses this)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Redirect logged-in users away from login page
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect admin routes (except login page)
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/admin/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  // Protect admin API routes
  if (isAdminApiRoute && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes
    "/admin/:path*",
    // Match admin API routes
    "/api/admin/:path*",
    // Match auth API routes
    "/api/auth/:path*",
  ],
};
