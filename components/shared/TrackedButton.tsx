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

  // If href is provided, render as a Link styled as a Button (asChild → single <a>)
  if (href) {
    return (
      <Button asChild onClick={handleClick} {...props}>
        <Link href={href}>{children}</Link>
      </Button>
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
