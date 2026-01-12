"use client";

import { useEffect, useState } from "react";

/**
 * Hook to check if the component is mounted on the client side.
 * Useful for avoiding hydration mismatches with client-only features.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
