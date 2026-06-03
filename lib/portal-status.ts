// Shared labels + badge classes for portal project/milestone statuses.
// Pure constants — safe to import in both server and client components.

export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type MilestoneStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

const BADGE_BASE =
  "rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]";

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; badge: string }
> = {
  ACTIVE: { label: "Active", badge: `${BADGE_BASE} border-signal/40 bg-signal/10 text-signal` },
  ON_HOLD: { label: "On Hold", badge: `${BADGE_BASE} border-hairline bg-muted/40 text-muted-foreground` },
  COMPLETED: { label: "Completed", badge: `${BADGE_BASE} border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400` },
  ARCHIVED: { label: "Archived", badge: `${BADGE_BASE} border-hairline bg-transparent text-muted-foreground/70` },
};

export const MILESTONE_STATUS_META: Record<
  MilestoneStatus,
  { label: string; badge: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    badge: `${BADGE_BASE} border-hairline bg-muted/40 text-muted-foreground`,
    dot: "border-hairline bg-background text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badge: `${BADGE_BASE} border-signal/40 bg-signal/10 text-signal`,
    dot: "border-signal/60 bg-signal/10 text-signal",
  },
  COMPLETED: {
    label: "Completed",
    badge: `${BADGE_BASE} border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`,
    dot: "border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  BLOCKED: {
    label: "Blocked",
    badge: `${BADGE_BASE} border-destructive/40 bg-destructive/10 text-destructive`,
    dot: "border-destructive/60 bg-destructive/10 text-destructive",
  },
};

export const PROJECT_STATUS_OPTIONS = Object.entries(PROJECT_STATUS_META).map(
  ([value, meta]) => ({ value: value as ProjectStatus, label: meta.label })
);

export const MILESTONE_STATUS_OPTIONS = Object.entries(MILESTONE_STATUS_META).map(
  ([value, meta]) => ({ value: value as MilestoneStatus, label: meta.label })
);
