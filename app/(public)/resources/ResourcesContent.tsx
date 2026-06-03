"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogPostCard } from "@/components/blog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
  category: {
    name: string;
    slug: string;
  } | null;
  tags?: {
    name: string;
    slug: string;
  }[];
  author: {
    name: string | null;
  } | null;
}

interface ResourcesContentProps {
  initialPosts: Post[];
  categories: Category[];
  tags: Tag[];
  totalPosts: number;
}

const POSTS_PER_PAGE = 12;

export function ResourcesContent({
  initialPosts,
  categories,
  tags,
  totalPosts,
}: ResourcesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [activeTag, setActiveTag] = useState(
    searchParams.get("tag") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [pagination, setPagination] = useState({
    total: totalPosts,
    totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
    hasMore: totalPosts > POSTS_PER_PAGE,
  });

  // Fetch posts from API
  const fetchPosts = useCallback(
    async (category: string, search: string, page: number, tag: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", POSTS_PER_PAGE.toString());
        if (category && category !== "all") {
          params.set("category", category);
        }
        if (search) {
          params.set("search", search);
        }
        if (tag) {
          params.set("tag", tag);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setPosts(data.data);
          setPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            hasMore: data.pagination.hasMore,
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update URL params
  const updateUrlParams = useCallback(
    (category: string, search: string, page: number, tag: string) => {
      const params = new URLSearchParams();
      if (category && category !== "all") {
        params.set("category", category);
      }
      if (search) {
        params.set("search", search);
      }
      if (tag) {
        params.set("tag", tag);
      }
      if (page > 1) {
        params.set("page", page.toString());
      }

      const newUrl = params.toString()
        ? `/resources?${params.toString()}`
        : "/resources";
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setCurrentPage(1);
    updateUrlParams(categorySlug, searchQuery, 1, activeTag);
    fetchPosts(categorySlug, searchQuery, 1, activeTag);
  };

  // Handle tag change
  const handleTagChange = (tagSlug: string) => {
    const newTag = activeTag === tagSlug ? "" : tagSlug;
    setActiveTag(newTag);
    setCurrentPage(1);
    updateUrlParams(activeCategory, searchQuery, 1, newTag);
    fetchPosts(activeCategory, searchQuery, 1, newTag);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams(activeCategory, searchQuery, 1, activeTag);
    fetchPosts(activeCategory, searchQuery, 1, activeTag);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrlParams(activeCategory, "", 1, activeTag);
    fetchPosts(activeCategory, "", 1, activeTag);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(activeCategory, searchQuery, page, activeTag);
    fetchPosts(activeCategory, searchQuery, page, activeTag);
    // Scroll to top of posts section
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Effect to handle initial URL params
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const tag = searchParams.get("tag") || "";

    if (category !== "all" || search || page > 1 || tag) {
      setActiveCategory(category);
      setSearchQuery(search);
      setCurrentPage(page);
      setActiveTag(tag);
      fetchPosts(category, search, page, tag);
    }
  }, [searchParams, fetchPosts]);

  const hasActiveFilters = searchQuery || activeCategory !== "all" || activeTag;
  const visibleTags = tags.filter((t) => t.postCount > 0);

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                activeCategory === "all"
                  ? "border-signal bg-signal/10 text-foreground"
                  : "border-hairline text-muted-foreground hover:border-signal/60 hover:text-foreground"
              }`}
            >
              All
              <span className="font-mono text-[10px] text-muted-foreground">
                {totalPosts}
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.slug)}
                className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                  activeCategory === category.slug
                    ? "border-signal bg-signal/10 text-foreground"
                    : "border-hairline text-muted-foreground hover:border-signal/60 hover:text-foreground"
                }`}
              >
                {category.name}
                {category.postCount > 0 && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {category.postCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-sm border-hairline pl-10 pr-10 focus-visible:ring-signal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Tag Filters */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Tags:
            </span>
            {visibleTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagChange(tag.slug)}
                className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  activeTag === tag.slug
                    ? "border-signal bg-signal/10 text-foreground"
                    : "border-hairline text-muted-foreground hover:border-signal/60 hover:text-foreground"
                }`}
              >
                {tag.name}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => handleTagChange(activeTag)}
                className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline transition-colors hover:text-foreground"
              >
                Clear tag
              </button>
            )}
          </div>
        )}

        {/* No tags - keep original spacing */}
        {visibleTags.length === 0 && <div className="mb-6" />}

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>
              Showing {posts.length} of {pagination.total} articles
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-sm border border-hairline px-2 py-0.5 text-foreground">
                &quot;{searchQuery}&quot;
                <button onClick={handleClearSearch}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-sm border border-hairline px-2 py-0.5 text-foreground">
                {categories.find((c) => c.slug === activeCategory)?.name}
                <button onClick={() => handleCategoryChange("all")}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {activeTag && (
              <span className="inline-flex items-center gap-1 rounded-sm border border-hairline px-2 py-0.5 text-foreground">
                {tags.find((t) => t.slug === activeTag)?.name}
                <button onClick={() => handleTagChange(activeTag)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* Posts Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  featuredImage={post.featuredImage}
                  category={post.category}
                  tags={post.tags}
                  author={post.author}
                  publishedAt={post.publishedAt}
                  readingTime={post.readingTime}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-sm border-hairline hover:border-signal/60"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsis && (
                            <span className="px-2 font-mono text-xs text-muted-foreground">...</span>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(page)}
                            className={`rounded-sm border font-mono text-xs ${
                              currentPage === page
                                ? "border-signal bg-signal/10 text-foreground"
                                : "border-hairline text-muted-foreground hover:border-signal/60 hover:text-foreground"
                            }`}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="rounded-sm border-hairline hover:border-signal/60"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="border border-hairline px-6 py-16 text-center">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              No articles found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="rounded-sm border-hairline font-mono text-xs uppercase tracking-[0.12em]"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveTag("");
                setCurrentPage(1);
                updateUrlParams("all", "", 1, "");
                fetchPosts("all", "", 1, "");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
