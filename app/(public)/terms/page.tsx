import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for SIDEC Consulting website. Read our terms and conditions for using our website and services.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-60" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>

        <div className="container-wide py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mb-6 rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <p className="eyebrow mb-5">Terms</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl prose prose-gray dark:prose-invert prose-headings:font-display">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not
              agree to these terms, please do not use this website.
            </p>

            <h2>2. Use of Website</h2>
            <p>
              You agree to use this website only for lawful purposes and in a
              way that does not infringe the rights of, restrict, or inhibit
              anyone else&apos;s use and enjoyment of the website.
            </p>
            <p>Prohibited behavior includes:</p>
            <ul>
              <li>Harassing or causing distress to any person</li>
              <li>Transmitting obscene or offensive content</li>
              <li>Disrupting the normal flow of dialogue within our website</li>
              <li>Attempting to gain unauthorized access to our systems</li>
            </ul>

            <h2>3. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text,
              graphics, logos, images, and software, is the property of SIDEC
              Consulting or its content suppliers and is protected by
              intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul>
              <li>
                Reproduce, distribute, or publicly display any content without
                our prior written consent
              </li>
              <li>
                Modify or create derivative works based on the content
              </li>
              <li>
                Use the content for commercial purposes without authorization
              </li>
            </ul>

            <h2>4. Consulting Services</h2>
            <h3>4.1 Service Agreements</h3>
            <p>
              Specific consulting services are governed by separate written
              agreements. These Terms of Service apply to website use only and
              do not supersede any consulting engagement agreements.
            </p>

            <h3>4.2 No Professional Advice</h3>
            <p>
              The information on this website is for general informational
              purposes only and does not constitute professional advice. For
              specific advice regarding your situation, please contact us for a
              consultation.
            </p>

            <h2>5. Disclaimers</h2>
            <h3>5.1 No Warranties</h3>
            <p>
              This website is provided &quot;as is&quot; without any
              representations or warranties, express or implied. SIDEC
              Consulting makes no representations or warranties in relation to
              this website or the information and materials provided on this
              website.
            </p>

            <h3>5.2 Limitation of Liability</h3>
            <p>
              SIDEC Consulting will not be liable to you for any indirect,
              special, or consequential loss or damage arising under these terms
              and conditions or in connection with our website, whether arising
              in tort, contract, or otherwise.
            </p>

            <h2>6. Third-Party Links</h2>
            <p>
              This website may contain links to other websites. These links are
              provided for your convenience only. We have no control over the
              content of those sites and accept no responsibility for them or
              for any loss or damage that may arise from your use of them.
            </p>

            <h2>7. Privacy</h2>
            <p>
              Your use of this website is also governed by our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated into these terms by reference.
            </p>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SIDEC Consulting and its
              officers, directors, employees, and agents from any claims,
              damages, costs, and expenses (including legal fees) arising out of
              your use of this website or your breach of these terms.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We may revise these Terms of Service at any time without notice.
              By using this website, you agree to be bound by the current
              version of these terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of the State of California, and you
              irrevocably submit to the exclusive jurisdiction of the courts in
              that state.
            </p>

            <h2>11. Severability</h2>
            <p>
              If any provision of these terms is found to be invalid or
              unenforceable, the remaining provisions will continue to be valid
              and enforceable.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p>
              <strong>SIDEC Consulting</strong>
              <br />
              Email:{" "}
              <a href="mailto:legal@sidecconsulting.com">
                legal@sidecconsulting.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
