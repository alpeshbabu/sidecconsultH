import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for SIDEC Consulting website. Learn about the cookies we use, why we use them, and how to manage your cookie preferences.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiePolicyPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
        </div>

        <div className="container-wide py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              <Cookie className="h-3.5 w-3.5 mr-2 text-primary" />
              Legal
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Cookie Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl prose prose-gray dark:prose-invert">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or
              mobile device when you visit a website. They are widely used to
              make websites work more efficiently and to provide information to
              website owners.
            </p>
            <p>
              Cookies allow a website to recognize your device and remember
              information about your visit, such as your preferred language and
              other settings. This can make your next visit easier and the site
              more useful to you.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              SIDEC Consulting uses cookies and similar technologies for the
              following purposes:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> To enable core functionality
                of our website, such as security, network management, and
                accessibility
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand how visitors
                interact with our website by collecting and reporting
                information anonymously
              </li>
              <li>
                <strong>Functional Cookies:</strong> To remember choices you
                make and provide enhanced, personalized features
              </li>
              <li>
                <strong>Marketing Cookies:</strong> To deliver advertisements
                more relevant to you and your interests (if applicable)
              </li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <p>
              The following table provides more information about the specific
              cookies we use:
            </p>

            <div className="not-prose my-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Cookie Name</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Duration</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">_ga</TableCell>
                    <TableCell>Analytics</TableCell>
                    <TableCell>2 years</TableCell>
                    <TableCell>
                      Google Analytics cookie used to distinguish users
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">_ga_*</TableCell>
                    <TableCell>Analytics</TableCell>
                    <TableCell>2 years</TableCell>
                    <TableCell>
                      Google Analytics 4 cookie used to persist session state
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">_gid</TableCell>
                    <TableCell>Analytics</TableCell>
                    <TableCell>24 hours</TableCell>
                    <TableCell>
                      Google Analytics cookie used to distinguish users
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">cookie_consent</TableCell>
                    <TableCell>Essential</TableCell>
                    <TableCell>1 year</TableCell>
                    <TableCell>
                      Stores your cookie consent preferences
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">theme</TableCell>
                    <TableCell>Functional</TableCell>
                    <TableCell>1 year</TableCell>
                    <TableCell>
                      Remembers your preferred color theme (light/dark)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h2>4. First-Party vs. Third-Party Cookies</h2>
            <h3>4.1 First-Party Cookies</h3>
            <p>
              First-party cookies are set by our website directly. We use these
              cookies to remember your preferences and to understand how you use
              our site.
            </p>

            <h3>4.2 Third-Party Cookies</h3>
            <p>
              Third-party cookies are set by services we use, such as Google
              Analytics. These cookies help us understand how visitors use our
              website and identify areas for improvement.
            </p>

            <h2>5. Managing Cookies</h2>
            <p>
              You have several options for managing cookies on your device:
            </p>

            <h3>5.1 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their
              settings. You can typically find these settings in the
              &quot;Options&quot; or &quot;Preferences&quot; menu of your
              browser. The following links provide information on how to manage
              cookies in popular browsers:
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Google Chrome
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Mozilla Firefox
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Safari
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Microsoft Edge
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>

            <h3>5.2 Cookie Consent</h3>
            <p>
              When you first visit our website, you will see a cookie consent
              banner that allows you to accept or decline non-essential cookies.
              You can change your preferences at any time by clearing your
              browser cookies and revisiting our site.
            </p>

            <h3>5.3 Opting Out of Analytics</h3>
            <p>
              If you want to opt out of Google Analytics tracking across all
              websites, you can install the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1"
              >
                Google Analytics Opt-out Browser Add-on
                <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>

            <h2>6. Impact of Disabling Cookies</h2>
            <p>
              If you choose to disable cookies, some features of our website may
              not function properly. This includes:
            </p>
            <ul>
              <li>Remembering your preferences and settings</li>
              <li>Staying logged in (for admin users)</li>
              <li>Some interactive features may not work correctly</li>
            </ul>
            <p>
              Essential cookies cannot be disabled as they are necessary for the
              website to function.
            </p>

            <h2>7. Do Not Track</h2>
            <p>
              Some browsers have a &quot;Do Not Track&quot; feature that lets
              you tell websites that you do not want to have your online
              activities tracked. Currently, there is no universally accepted
              standard for how to respond to Do Not Track signals, so our
              website does not currently respond to these signals.
            </p>

            <h2>8. Similar Technologies</h2>
            <p>
              In addition to cookies, we may use other similar technologies:
            </p>
            <ul>
              <li>
                <strong>Local Storage:</strong> Used to store data locally on
                your browser, similar to cookies but with a larger storage
                capacity
              </li>
              <li>
                <strong>Session Storage:</strong> Similar to local storage but
                cleared when you close your browser
              </li>
              <li>
                <strong>Web Beacons:</strong> Small graphic images (also called
                &quot;pixel tags&quot;) used in conjunction with cookies to
                understand how visitors interact with our content
              </li>
            </ul>

            <h2>9. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in technology, regulation, or our business practices. Any
              changes will be posted on this page with an updated revision date.
            </p>

            <h2>10. Related Policies</h2>
            <p>
              This Cookie Policy should be read in conjunction with our:
            </p>
            <ul>
              <li>
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                - For information on how we collect and use your personal data
              </li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                - For the terms governing your use of our website
              </li>
            </ul>

            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us at:
            </p>
            <p>
              <strong>SIDEC Consulting</strong>
              <br />
              Email:{" "}
              <a href="mailto:privacy@sidecconsulting.com">
                privacy@sidecconsulting.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
