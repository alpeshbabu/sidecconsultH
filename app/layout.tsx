import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedDevice Consulting | Medical Device Injection Molding Expert",
    template: "%s | MedDevice Consulting",
  },
  description:
    "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, injection molding process development, and facility design. Expert consulting for medical device companies.",
  keywords: [
    "medical device injection molding consultant",
    "ISO 13485 consultant",
    "medical device manufacturing expert",
    "injection molding process validation",
    "medical device quality systems",
    "510(k) submission preparation",
    "cleanroom injection molding",
    "scientific molding consultant",
    "medical device facility design",
  ],
  authors: [{ name: "Alpesh" }],
  creator: "MedDevice Consulting",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MedDevice Consulting",
    title: "MedDevice Consulting | Medical Device Injection Molding Expert",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedDevice Consulting | Medical Device Injection Molding Expert",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
