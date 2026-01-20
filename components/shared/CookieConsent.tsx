"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trackCookieConsent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie_consent", JSON.stringify(prefs));
    localStorage.setItem("cookie_consent_date", new Date().toISOString());

    // Update GA consent mode
    if (typeof window !== "undefined" && window.gtag) {
      (window.gtag as (...args: unknown[]) => void)("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        ad_storage: prefs.marketing ? "granted" : "denied",
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    trackCookieConsent("accept");
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
    trackCookieConsent("reject");
  };

  const saveCustom = () => {
    savePreferences(preferences);
    trackCookieConsent("customize");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Overlay */}
      {showSettings && (
        <div
          className="absolute inset-0 bg-black/50 pointer-events-auto"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Banner */}
      <Card
        className={cn(
          "pointer-events-auto w-full max-w-2xl m-4 shadow-2xl transition-all duration-300",
          showSettings && "mb-4"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Cookie Preferences</CardTitle>
                <CardDescription>
                  We use cookies to improve your experience
                </CardDescription>
              </div>
            </div>
            {!showSettings && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={rejectAll}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {!showSettings ? (
            // Simple banner
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use cookies to provide you with the best possible experience. They also
                allow us to analyze user behavior in order to constantly improve the website
                for you. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <p className="text-xs text-muted-foreground">
                Read our{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          ) : (
            // Settings view
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose which cookies you want to allow. You can change these settings at
                any time.
              </p>

              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-muted/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">Necessary Cookies</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These cookies are essential for the website to function properly. They
                    enable basic features like page navigation and access to secure areas.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">Analytics Cookies</h4>
                  <p className="text-xs text-muted-foreground">
                    These cookies help us understand how visitors interact with our website
                    by collecting and reporting information anonymously.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg border">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">Marketing Cookies</h4>
                  <p className="text-xs text-muted-foreground">
                    These cookies track your online activity to help advertisers deliver more
                    relevant advertising or to limit how many times you see an ad.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          {!showSettings ? (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={rejectAll}
              >
                Reject All
              </Button>
              <Button className="w-full sm:flex-1" onClick={acceptAll}>
                Accept All
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setShowSettings(false)}
              >
                Back
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={rejectAll}
              >
                Reject All
              </Button>
              <Button className="w-full sm:flex-1" onClick={saveCustom}>
                Save Preferences
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default CookieConsent;
