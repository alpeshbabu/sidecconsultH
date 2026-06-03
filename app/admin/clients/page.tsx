import { Suspense } from "react";
import { ClientsContent } from "./ClientsContent";

export const metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <Suspense fallback={null}>
      <ClientsContent />
    </Suspense>
  );
}
