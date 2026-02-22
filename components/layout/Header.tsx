"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SERVICE_AREAS, NAV_LINKS } from "@/lib/constants";
import { SearchDialog } from "@/components/search";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  ShieldCheck,
  Cog,
  Wrench,
  Building,
  Globe,
  Lightbulb,
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Set mounted flag and check initial scroll position
    setIsMounted(true);
    setIsScrolled(window.scrollY > 10);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Check if a nav link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isMounted && isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-background/80 backdrop-blur-sm"
      )}
      suppressHydrationWarning
    >
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/SIDEC Consulting.png"
              alt="SIDEC Consulting"
              width={240}
              height={60}
              className="h-12 w-auto transition-transform group-hover:scale-105 lg:h-14"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.filter((link) => link.label !== "Contact").map((link) =>
              link.label === "Services" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isServicesOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Mega Menu */}
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200",
                      isServicesOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    )}
                  >
                    <div className="w-[800px] rounded-2xl border bg-card p-6 shadow-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Our Services
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Comprehensive consulting for medical device
                            manufacturing
                          </p>
                        </div>
                        <Link href="/services">
                          <Button variant="ghost" size="sm" className="group">
                            View All
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {SERVICE_AREAS.map((service) => {
                          const IconComponent = iconMap[service.icon];
                          return (
                            <Link
                              key={service.id}
                              href={service.href}
                              className="group flex gap-4 rounded-xl p-3 transition-colors hover:bg-muted"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {IconComponent && (
                                  <IconComponent className="h-5 w-5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                  {service.shortTitle}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {service.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive(link.href)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/80 hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Search + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-1 pointer-events-none inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <Link href="/schedule">
              <Button className="btn-glow">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Search + Menu */}
          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/SIDEC Consulting.png"
                      alt="SIDEC Consulting"
                      width={180}
                      height={50}
                      className="h-10 w-auto"
                    />
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {NAV_LINKS.filter((link) => link.label !== "Services").map(
                      (link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors",
                              isActive(link.href)
                                ? "text-primary bg-primary/5"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      )
                    )}
                  </div>

                  {/* Mobile Services */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between px-4 mb-3">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Services
                      </span>
                      <SheetClose asChild>
                        <Link
                          href="/services"
                          className="text-sm text-primary hover:underline"
                        >
                          View All
                        </Link>
                      </SheetClose>
                    </div>
                    <div className="space-y-1">
                      {SERVICE_AREAS.map((service) => {
                        const IconComponent = iconMap[service.icon];
                        return (
                          <SheetClose asChild key={service.id}>
                            <Link
                              href={service.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                {IconComponent && (
                                  <IconComponent className="h-4 w-4" />
                                )}
                              </div>
                              <span className="text-sm font-medium">
                                {service.shortTitle}
                              </span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>
                </nav>

                {/* Mobile CTA */}
                <div className="p-4 border-t">
                  <SheetClose asChild>
                    <Link href="/schedule" className="block">
                      <Button className="w-full btn-glow" size="lg">
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}

export default Header;
