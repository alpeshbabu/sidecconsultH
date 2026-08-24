import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIDEC Consulting — Medical Molding & Quality",
    short_name: "SIDEC Consulting",
    description:
      "Expert consulting for medical device manufacturing, injection molding process excellence, and ISO 13485 quality systems.",
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
