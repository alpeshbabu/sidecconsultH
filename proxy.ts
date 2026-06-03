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

  // Allow auth API routes to pass through (NextAuth handlers)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Lightweight cookie-existence check (Edge-safe). Role is verified later in
  // layouts/handlers via auth() — the proxy only distinguishes logged-in vs not.
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  const withPathname = () => {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  };

  // ---------------------------------------------------------------------------
  // Client portal
  // ---------------------------------------------------------------------------
  const isPortalRoute = pathname.startsWith("/portal");
  const isPortalApiRoute = pathname.startsWith("/api/portal");
  if (isPortalRoute || isPortalApiRoute) {
    const isPortalPublicPage =
      pathname === "/portal/login" || pathname.startsWith("/portal/auth");
    const isPortalPublicApi = pathname.startsWith("/api/portal/auth");

    if (isPortalPublicPage || isPortalPublicApi) {
      // Don't show the login/verify pages to an already-authenticated user.
      if (isPortalPublicPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
      return withPathname();
    }

    if (!isLoggedIn) {
      if (isPortalApiRoute) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }

    return withPathname();
  }

  // ---------------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------------
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isPublicAdminPage = PUBLIC_ADMIN_PAGES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

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

  return withPathname();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
    "/portal/:path*",
    "/api/portal/:path*",
  ],
};
