import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header will be added in Phase 3 */}
      <main className="flex-1">{children}</main>
      {/* Footer will be added in Phase 3 */}
    </div>
  );
}
