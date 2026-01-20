import type { Metadata } from "next";
import { ServicesContent } from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
