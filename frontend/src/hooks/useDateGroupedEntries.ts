import { useMemo } from 'react'
import type { TimeEntry } from '../api/timeEntry'
import { calculateTotalDuration } from '../lib/calculations'

export interface DateGroup {
  date: string              // Formatted date (e.g., "December 31, 2025")
  entries: TimeEntry[]      // Sorted newest first
  totalDuration: number     // Total ms (excludes running entries)
}

export interface UseDateGroupedEntriesOptions {
  entries: TimeEntry[]
  dateFormatOptions?: Intl.DateTimeFormatOptions  // Default: { year: 'numeric', month: 'long', day: 'numeric' }
  sortOrder?: 'asc' | 'desc'  // Default: 'desc' (newest first)
}

export interface UseDateGroupedEntriesResult {
  groupedEntries: Record<string, TimeEntry[]>  // Map for direct access
  sortedDates: string[]                        // Array for iteration
  dateGroups: DateGroup[]                      // Combined data with metadata
}

/**
 * Custom hook to group time entries by date
 *
 * @param options - Configuration options
 * @returns Object containing grouped entries in multiple formats
 *
 * @example
 * const { groupedEntries, sortedDates } = useDateGroupedEntries({
 *   entries: timeEntries,
 *   sortOrder: 'desc'
 * })
 */
export function useDateGroupedEntries(
  options: UseDateGroupedEntriesOptions
): UseDateGroupedEntriesResult {
  const {
    entries,
    dateFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    sortOrder = 'desc',
  } = options

  return useMemo(() => {
    // Group entries by date
    const groups: Record<string, TimeEntry[]> = {}

    entries.forEach((entry) => {
      const date = new Date(entry.startedAt).toLocaleDateString(
        'en-US',
        dateFormatOptions
      )

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(entry)
    })

    // Sort entries within each group by startedAt (newest first)
    Object.keys(groups).forEach((date) => {
      groups[date].sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    })

    // Sort dates based on sortOrder
    const sortedDates = Object.keys(groups).sort((a, b) => {
      const dateA = new Date(a).getTime()
      const dateB = new Date(b).getTime()
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })

    // Create date groups with metadata
    const dateGroups: DateGroup[] = sortedDates.map((date) => ({
      date,
      entries: groups[date],
      totalDuration: calculateTotalDuration(groups[date]),
    }))

    return {
      groupedEntries: groups,
      sortedDates,
      dateGroups,
    }
  }, [entries, dateFormatOptions, sortOrder])
}
