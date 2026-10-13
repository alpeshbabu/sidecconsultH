import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS, SERVICE_AREAS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/SIDEC Consulting.png"
                alt="SIDEC Consulting"
                width={220}
                height={55}
                className="h-12 w-auto transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="mt-6 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Injection molding, quality, and manufacturing expertise — validated
              and audit-ready. 25+ years of experience helping manufacturers
              build processes they can deploy and defend.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              {SITE_CONFIG.email && (
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {SITE_CONFIG.email}
                </a>
              )}
              {SITE_CONFIG.phone && (
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {SITE_CONFIG.phone}
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Ventura, California
              </div>
            </div>

            {/* Trust signals */}
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Confidential · Responses within 24–48 business hours
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              {SITE_CONFIG.linkedin && (
                <a
                  href={SITE_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-hairline text-primary transition-colors hover:border-signal/60 hover:text-signal"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow-plain mb-5 text-muted-foreground">Services</h3>
            <ul className="space-y-3">
              {SERVICE_AREAS.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow-plain mb-5 text-muted-foreground">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow-plain mb-5 text-muted-foreground">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Credentials */}
            <div className="mt-8">
              <h3 className="eyebrow-plain mb-5 text-muted-foreground">Credentials</h3>
              <div className="flex flex-wrap gap-2">
                {["ISO 13485", "FDA 21 CFR", "EU MDR", "MDSAP"].map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center rounded-sm border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
