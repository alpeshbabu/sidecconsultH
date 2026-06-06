import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WebVitalsReporter, GoogleAnalytics, CookieConsent } from "@/components/shared";
import { ChatbotWidget } from "@/components/chatbot";
import { SessionProvider, ThemeProvider } from "@/components/providers";
import { createOrganizationSchema, getJsonLd } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sidecconsult.com"),
  title: {
    default: "SIDEC Consulting | AI for Injection Molding Manufacturing",
    template: "%s | SIDEC Consulting",
  },
  description:
    "25+ years in medical device manufacturing, now bringing AI and machine learning to injection molding — process optimization, quality, predictive maintenance, and the validation and governance to deploy it in regulated plants.",
  keywords: [
    "AI injection molding consultant",
    "machine learning injection molding",
    "AI process optimization injection molding",
    "AI validation medical device manufacturing",
    "scientific molding AI consultant",
    "predictive maintenance injection molding",
    "AI defect detection injection molding",
    "smart factory injection molding consultant",
    "ISO 13485 AI manufacturing",
  ],
  authors: [{ name: "SIDEC Consulting" }],
  creator: "SIDEC Consulting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SIDEC Consulting",
    title: "Bring AI to Injection Molding — Without Breaking Validation",
    description:
      "AI for molders — process optimization, quality, and uptime, deployed validated, explainable, and audit-ready by 25+ year manufacturing experts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIDEC Consulting - AI for Injection Molding Manufacturing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bring AI to Injection Molding — Without Breaking Validation",
    description:
      "AI for molders — process optimization, quality, and uptime, deployed validated, explainable, and audit-ready by 25+ year manufacturing experts.",
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
    types: {
      "application/rss+xml": "/feed.xml",
    },
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
        className={`${geistSans.variable} ${outfit.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SessionProvider>
            {children}
            {/* Analytics, reporters, and overlays render after the main content so
                their Suspense boundary (GoogleAnalytics → useSearchParams) never
                precedes {children} and misaligns its streaming hydration. */}
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
            <WebVitalsReporter />
            <CookieConsent />
            <ChatbotWidget />
            <Toaster position="top-right" richColors closeButton />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
