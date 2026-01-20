"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * LazyLoad component for below-the-fold content
 * Uses IntersectionObserver to load content when it enters viewport
 */
export function LazyLoad({
  children,
  fallback = <div className="h-32 animate-pulse bg-muted rounded-lg" />,
  rootMargin = "100px",
  threshold = 0.01,
  once = true,
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already intersected once and once=true, don't observe again
    if (once && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && once) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once, hasIntersected]);

  const shouldRender = once ? (isIntersecting || hasIntersected) : isIntersecting;

  return <div ref={ref}>{shouldRender ? children : fallback}</div>;
}

export default LazyLoad;
