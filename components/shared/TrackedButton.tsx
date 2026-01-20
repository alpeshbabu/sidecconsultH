"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackCTAClick, trackNavigation } from "@/lib/analytics";

interface TrackedButtonProps extends ComponentProps<typeof Button> {
  href?: string;
  trackingName: string;
  trackingLocation: string;
  children: React.ReactNode;
}

/**
 * Button component with built-in analytics tracking
 * Automatically tracks clicks and navigation events
 */
export function TrackedButton({
  href,
  trackingName,
  trackingLocation,
  onClick,
  children,
  ...props
}: TrackedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track the CTA click
    trackCTAClick(trackingName, trackingLocation, href);

    // Track navigation if href is provided
    if (href) {
      trackNavigation(href, trackingLocation);
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href}>
        <Button {...props} onClick={handleClick}>
          {children}
        </Button>
      </Link>
    );
  }

  // Otherwise render as regular button
  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}

export default TrackedButton;
