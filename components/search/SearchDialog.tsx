"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2, FileText, Briefcase, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PostResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  readingTime: number | null;
  category: { name: string; slug: string } | null;
}

interface ServiceResult {
  serviceId: string;
  title: string;
  tagline: string | null;
  categorySlug: string;
  categoryName: string;
  icon: string | null;
}

type SearchResult =
  | { type: "service"; data: ServiceResult }
  | { type: "post"; data: PostResult };

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [services, setServices] = useState<ServiceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Flatten all results into a single navigable list
  const allResults: SearchResult[] = [
    ...services.map((s) => ({ type: "service" as const, data: s })),
    ...posts.map((p) => ({ type: "post" as const, data: p })),
  ];

  // Close on route change
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setPosts([]);
      setServices([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setPosts([]);
      setServices([]);
      setActiveIndex(0);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [postsRes, servicesRes] = await Promise.all([
          fetch(
            `/api/posts?search=${encodeURIComponent(query)}&limit=5`,
            { signal: controller.signal }
          ),
          fetch(
            `/api/services/search?q=${encodeURIComponent(query)}&limit=5`,
            { signal: controller.signal }
          ),
        ]);

        const postsData = await postsRes.json();
        const servicesData = await servicesRes.json();

        if (postsData.success) setPosts(postsData.data);
        if (servicesData.success) setServices(servicesData.data);
        setActiveIndex(0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      if (result.type === "post") {
        router.push(`/resources/${result.data.slug}`);
      } else {
        router.push(`/services#${result.data.serviceId}`);
      }
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (allResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allResults[activeIndex]) {
      e.preventDefault();
      navigateToResult(allResults[activeIndex]);
    }
  };

  // Scroll active result into view
  useEffect(() => {
    const container = resultsRef.current;
    if (!container) return;
    const activeEl = container.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const hasResults = allResults.length > 0;
  const hasQuery = query.trim().length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] translate-y-0 sm:max-w-2xl p-0 gap-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Search</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services and articles..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <Separator />

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-[50vh] overflow-y-auto overscroll-contain"
          role="listbox"
          id="search-results"
        >
          {/* Initial state */}
          {!hasQuery && !isLoading && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Start typing to search across services and articles...
            </div>
          )}

          {/* No results */}
          {hasQuery && !isLoading && !hasResults && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try different keywords or browse{" "}
                <button
                  onClick={() => {
                    router.push("/services");
                    onOpenChange(false);
                  }}
                  className="text-primary hover:underline"
                >
                  services
                </button>{" "}
                and{" "}
                <button
                  onClick={() => {
                    router.push("/resources");
                    onOpenChange(false);
                  }}
                  className="text-primary hover:underline"
                >
                  articles
                </button>{" "}
                directly.
              </p>
            </div>
          )}

          {/* Services section */}
          {services.length > 0 && (
            <div className="px-2 pt-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Services
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {services.length}
                </Badge>
              </div>
              {services.map((service, i) => {
                const globalIndex = i;
                return (
                  <button
                    key={service.serviceId}
                    data-index={globalIndex}
                    role="option"
                    aria-selected={activeIndex === globalIndex}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      activeIndex === globalIndex
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() =>
                      navigateToResult({ type: "service", data: service })
                    }
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {service.title}
                      </p>
                      {service.tagline && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {service.tagline}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] px-1.5"
                    >
                      {service.categoryName}
                    </Badge>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Separator between sections */}
          {services.length > 0 && posts.length > 0 && (
            <div className="px-4">
              <Separator />
            </div>
          )}

          {/* Articles section */}
          {posts.length > 0 && (
            <div className="px-2 pb-2 pt-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Articles
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {posts.length}
                </Badge>
              </div>
              {posts.map((post, i) => {
                const globalIndex = services.length + i;
                return (
                  <button
                    key={post.id}
                    data-index={globalIndex}
                    role="option"
                    aria-selected={activeIndex === globalIndex}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      activeIndex === globalIndex
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() =>
                      navigateToResult({ type: "post", data: post })
                    }
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {post.category && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5"
                        >
                          {post.category.name}
                        </Badge>
                      )}
                      {post.readingTime && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {post.readingTime} min
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hints */}
        {hasResults && (
          <>
            <Separator />
            <div className="flex items-center gap-4 px-4 py-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">
                  &uarr;
                </kbd>
                <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">
                  &darr;
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">
                  &crarr;
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">
                  esc
                </kbd>
                close
              </span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
