import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WebVitalsReporter, GoogleAnalytics, CookieConsent } from "@/components/shared";
import { SessionProvider, ThemeProvider } from "@/components/providers";
import { createOrganizationSchema, getJsonLd } from "@/lib/structured-data";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com"),
  title: {
    default: "SIDEC Consulting | Medical Device Injection Molding Expert",
    template: "%s | SIDEC Consulting",
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
  authors: [{ name: "SIDEC Consulting" }],
  creator: "SIDEC Consulting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SIDEC Consulting",
    title: "SIDEC Consulting | Medical Device Injection Molding Expert",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIDEC Consulting - Medical Device Manufacturing Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIDEC Consulting | Medical Device Injection Molding Expert",
    description:
      "25+ years of expertise in medical device manufacturing, ISO 13485 quality systems, and injection molding process development.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com";
  const organizationSchema = createOrganizationSchema(baseUrl);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getJsonLd(organizationSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SessionProvider>
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
            <WebVitalsReporter />
            <CookieConsent />
            {children}
            <Toaster position="top-right" richColors closeButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
