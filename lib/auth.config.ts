import type { NextAuthConfig } from "next-auth";

/**
 * Base auth configuration shared between the full auth setup and middleware.
 * This file must remain Edge-compatible — no Prisma, bcrypt, or Node.js-only imports.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthPage =
        pathname === "/admin/login" ||
        pathname === "/admin/forgot-password" ||
        pathname === "/admin/reset-password";

      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminApi = pathname.startsWith("/api/admin");

      // Redirect authenticated users away from login page
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      // Protect admin pages — redirect to login
      if (isAdminRoute && !isAuthPage && !isLoggedIn) {
        const loginUrl = new URL("/admin/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      // Protect admin API routes — return 401 JSON
      if (isAdminApi && !isLoggedIn) {
        return new Response(
          JSON.stringify({ success: false, error: "Authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      return true;
    },
  },
  providers: [], // Providers are added in the full auth.ts
};
