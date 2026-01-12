import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <p className="mt-4 text-center text-muted-foreground">Coming in Phase 2...</p>
      </div>
    </div>
  );
}
