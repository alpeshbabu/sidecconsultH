// Shared, DST-safe timezone helpers for appointment scheduling.
//
// The business operates on a single configurable IANA timezone (stored in
// AvailabilitySettings.timezone). All slot generation, validation, and display
// flows through these helpers so the logic lives in exactly one place.

export const US_TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "UTC", label: "UTC" },
] as const;

// Default business timezone — Pacific.
export const DEFAULT_TIMEZONE = "America/Los_Angeles";

export const VALID_TIMEZONES: string[] = US_TIMEZONES.map((t) => t.value);

/**
 * Offset (in ms) of `timeZone` relative to UTC at the given instant.
 * Positive when the zone is ahead of UTC.
 */
function tzOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(instant);

  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  // Some engines render midnight as hour "24" with hour12:false.
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUTC = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    hour,
    map.minute,
    map.second
  );
  return asUTC - instant.getTime();
}

/**
 * Convert a wall-clock time *as observed in `timeZone`* to the canonical UTC
 * instant. DST-safe: the offset is resolved at the actual instant (with one
 * refinement pass to handle the offset changing across the boundary), rather
 * than sampling a fixed offset for the whole day.
 *
 * e.g. zonedWallTimeToUtc(2026, 7, 15, 8, 0, "America/Los_Angeles")
 *      -> 2026-07-15T15:00:00Z  (8 AM PDT = 15:00 UTC)
 */
export function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = tzOffsetMs(new Date(utcGuess), timeZone);
  let ts = utcGuess - offset;
  const offset2 = tzOffsetMs(new Date(ts), timeZone);
  if (offset2 !== offset) ts = utcGuess - offset2;
  return new Date(ts);
}

/**
 * Minutes-since-midnight on the `timeZone` wall clock for a UTC instant.
 * e.g. 15:00Z in America/Los_Angeles (PDT) -> 8 * 60 = 480.
 */
export function zonedClockMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const hour =
    Number(parts.find((p) => p.type === "hour")?.value ?? "0") % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

/** Hour and zero-padded minute on the `timeZone` wall clock, e.g. ["08","30"]. */
export function zonedHourMinute(
  instant: Date,
  timeZone: string
): [string, string] {
  const [h, m] = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(instant)
    .split(":");
  // Normalize a "24" hour (midnight) to "00".
  return [h === "24" ? "00" : h, m];
}

/** Formatted clock time in the given timezone, e.g. "2:00 PM". */
export function formatZonedTime(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(instant);
}

/** Short zone abbreviation for an instant, e.g. "PST" / "PDT". */
export function timeZoneAbbreviation(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
    hour: "numeric",
    hour12: true,
  }).formatToParts(instant);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

/** Friendly label for a timezone, e.g. "Pacific Time (PT)". */
export function timeZoneLabel(timeZone: string): string {
  return US_TIMEZONES.find((t) => t.value === timeZone)?.label ?? timeZone;
}
