import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIDEC Consulting — AI for Injection Molding",
    short_name: "SIDEC Consulting",
    description:
      "AI and machine learning for injection molding manufacturing — validated, explainable, and audit-ready.",
    start_url: "/",
    display: "standalone",
    background_color: "#10141d",
    theme_color: "#10141d",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
