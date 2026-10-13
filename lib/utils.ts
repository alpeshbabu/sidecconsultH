import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Public byline for a post. Placeholder accounts (e.g. "Admin User") read as
// unfinished on the public site, so they fall back to the firm name.
export function displayAuthorName(name?: string | null) {
  if (!name || /\b(admin|user|test)\b/i.test(name)) return "SIDEC Consulting"
  return name
}
