"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlogPostCard } from "@/components/blog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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
  author: {
    name: string | null;
  } | null;
}

interface ResourcesContentProps {
  initialPosts: Post[];
  categories: Category[];
  totalPosts: number;
}

const POSTS_PER_PAGE = 12;

export function ResourcesContent({
  initialPosts,
  categories,
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
    async (category: string, search: string, page: number) => {
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
    (category: string, search: string, page: number) => {
      const params = new URLSearchParams();
      if (category && category !== "all") {
        params.set("category", category);
      }
      if (search) {
        params.set("search", search);
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
    updateUrlParams(categorySlug, searchQuery, 1);
    fetchPosts(categorySlug, searchQuery, 1);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams(activeCategory, searchQuery, 1);
    fetchPosts(activeCategory, searchQuery, 1);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrlParams(activeCategory, "", 1);
    fetchPosts(activeCategory, "", 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(activeCategory, searchQuery, page);
    fetchPosts(activeCategory, searchQuery, page);
    // Scroll to top of posts section
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Effect to handle initial URL params
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");

    if (category !== "all" || search || page > 1) {
      setActiveCategory(category);
      setSearchQuery(search);
      setCurrentPage(page);
      fetchPosts(category, search, page);
    }
  }, [searchParams, fetchPosts]);

  return (
    <section className="section-padding">
      <div className="container-wide">
        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("all")}
              className="rounded-full"
            >
              All
              <Badge variant="secondary" className="ml-2 rounded-full">
                {totalPosts}
              </Badge>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.slug)}
                className="rounded-full"
              >
                {category.name}
                {category.postCount > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-full">
                    {category.postCount}
                  </Badge>
                )}
              </Button>
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
                className="pl-10 pr-10"
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
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </div>

        {/* Results Info */}
        {(searchQuery || activeCategory !== "all") && (
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {posts.length} of {pagination.total} articles
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                &quot;{searchQuery}&quot;
                <button onClick={handleClearSearch}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.slug === activeCategory)?.name}
                <button onClick={() => handleCategoryChange("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
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
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(page)}
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
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No articles found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                handleClearSearch();
                handleCategoryChange("all");
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
