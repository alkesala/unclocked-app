import type { TimeEntry } from '../api/timeEntry'
import type { Project } from '../api/project'

/**
 * Calculate duration for a time entry in milliseconds
 * Handles both completed and running entries
 */
export function calculateEntryDuration(entry: TimeEntry): number {
  if (!entry.endedAt) {
    // Running entry - calculate from start to now
    return Date.now() - new Date(entry.startedAt).getTime()
  }
  // Completed entry
  return new Date(entry.endedAt).getTime() - new Date(entry.startedAt).getTime()
}

/**
 * Calculate duration between two dates in milliseconds
 */
export function calculateDuration(
  startedAt: string | Date,
  endedAt: string | Date
): number {
  const start = typeof startedAt === 'string' ? new Date(startedAt) : startedAt
  const end = typeof endedAt === 'string' ? new Date(endedAt) : endedAt
  return end.getTime() - start.getTime()
}

/**
 * Convert milliseconds to hours
 */
export function msToHours(milliseconds: number): number {
  return milliseconds / (1000 * 60 * 60)
}

/**
 * Get effective hourly rate (with fallback to project rate)
 */
export function getEffectiveHourlyRate(
  entry: TimeEntry,
  project: { hourlyRate?: number } | null
): number {
  return entry.hourlyRate ?? project?.hourlyRate ?? 0
}

/**
 * Calculate earnings for a time entry
 * Returns 0 for running entries
 */
export function calculateEntryEarnings(
  entry: TimeEntry,
  project: { hourlyRate?: number } | null
): number {
  if (!entry.endedAt) return 0

  const durationMs = calculateDuration(entry.startedAt, entry.endedAt)
  const durationHours = msToHours(durationMs)
  const rate = getEffectiveHourlyRate(entry, project)

  return durationHours * rate
}

/**
 * Calculate total duration for multiple entries (excludes running entries)
 */
export function calculateTotalDuration(entries: TimeEntry[]): number {
  return entries.reduce((sum, entry) => {
    if (!entry.endedAt) return sum
    return sum + calculateDuration(entry.startedAt, entry.endedAt)
  }, 0)
}

/**
 * Calculate total earnings for multiple entries
 */
export function calculateTotalEarnings(
  entries: TimeEntry[],
  projectMap: Map<string, Project>
): number {
  return entries.reduce((sum, entry) => {
    const project = projectMap.get(entry.project) ?? null
    return sum + calculateEntryEarnings(entry, project)
  }, 0)
}
