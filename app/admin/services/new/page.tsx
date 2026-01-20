import type { Metadata } from "next";
import { ServiceEditor } from "../[id]/ServiceEditor";

export const metadata: Metadata = {
  title: "New Service",
};

export default function NewServicePage() {
  return <ServiceEditor serviceId="new" />;
}
