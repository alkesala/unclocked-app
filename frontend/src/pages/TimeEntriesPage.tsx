import { useState, useMemo } from "react"
import { Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import {
  useTimeEntries,
  useDeleteTimeEntry,
} from "../hooks/useTimeEntries"
import { useProjects } from "../hooks/useProjects"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { EditTimeEntryDialog } from "../components/EditTimeEntryDialog"
import { CreateTimeEntryDialog } from "../components/CreateTimeEntryDialog"
import { formatDuration, formatTime } from "../lib/utils"
import type { TimeEntry } from "../api/timeEntry"

export const TimeEntriesPage = () => {
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null)

  // Filter states
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [dateRangeStart, setDateRangeStart] = useState<string>("")
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("")
  const [showRunning, setShowRunning] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Expanded sections
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  // Data fetching
  const { data: entriesData, isLoading } = useTimeEntries()
  const { data: projectsData } = useProjects()
  const deleteEntry = useDeleteTimeEntry()

  const handleDelete = () => {
    if (deleteEntryId) {
      deleteEntry.mutate(deleteEntryId, {
        onSuccess: () => {
          setDeleteEntryId(null)
        },
      })
    }
  }

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
  }

  // Filtering logic
  const filteredEntries = useMemo(() => {
    let filtered = entriesData?.data || []

    // Project filter
    if (selectedProject && selectedProject !== "all") {
      filtered = filtered.filter((e) => e.project === selectedProject)
    }

    // Date range filter
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart)
      startDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((e) => new Date(e.startedAt) >= startDate)
    }
    if (dateRangeEnd) {
      const endDate = new Date(dateRangeEnd)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((e) => new Date(e.startedAt) <= endDate)
    }

    // Running vs Completed filter
    if (showRunning !== null) {
      filtered = filtered.filter((e) =>
        showRunning ? !e.endedAt : !!e.endedAt
      )
    }

    // Search by note
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((e) =>
        e.note?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [
    entriesData,
    selectedProject,
    dateRangeStart,
    dateRangeEnd,
    showRunning,
    searchQuery,
  ])

  // Date grouping logic
  const groupedEntries = useMemo(() => {
    const groups: Record<string, TimeEntry[]> = {}

    filteredEntries.forEach((entry) => {
      const date = new Date(entry.startedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    })

    // Sort entries within each group by startedAt (newest first)
    Object.keys(groups).forEach((date) => {
      groups[date].sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    })

    return groups
  }, [filteredEntries])

  // Sorted dates (newest first)
  const sortedDates = useMemo(() => {
    return Object.keys(groupedEntries).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  }, [groupedEntries])

  // Create project map for lookups
  const projectMap = useMemo(() => {
    return new Map((projectsData?.data || []).map((p) => [p.id, p]))
  }, [projectsData])

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Time Entries</h1>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          Loading time entries...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Time Entries</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Create Entry
        </Button>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Project Filter */}
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger>
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectsData?.data.map((proj) => (
              <SelectItem key={proj.id} value={proj.id}>
                {proj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Date */}
        <Input
          type="date"
          value={dateRangeStart}
          onChange={(e) => setDateRangeStart(e.target.value)}
          placeholder="Start Date"
        />

        {/* End Date */}
        <Input
          type="date"
          value={dateRangeEnd}
          onChange={(e) => setDateRangeEnd(e.target.value)}
          placeholder="End Date"
        />

        {/* Running/Completed Toggle */}
        <Select
          value={
            showRunning === null ? "all" : showRunning ? "running" : "completed"
          }
          onValueChange={(val) =>
            setShowRunning(val === "all" ? null : val === "running")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entries</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Empty State */}
      {sortedDates.length === 0 && (
        <div className="border rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No time entries found</h3>
          <p className="text-muted-foreground">
            {filteredEntries.length === 0 && entriesData?.data.length === 0
              ? "Start tracking time to see your entries here"
              : "No entries match your filters"}
          </p>
        </div>
      )}

      {/* Date Groups */}
      {sortedDates.map((date) => {
        const entries = groupedEntries[date]
        const isExpanded = expandedDates.has(date)

        // Calculate total duration for the day
        const totalDuration = entries.reduce((sum, e) => {
          if (!e.endedAt) return sum
          return (
            sum +
            (new Date(e.endedAt).getTime() - new Date(e.startedAt).getTime())
          )
        }, 0)

        return (
          <div key={date} className="border rounded-lg mb-4">
            {/* Clickable Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleDateExpansion(date)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <div>
                  <h3 className="font-semibold">{date}</h3>
                  <p className="text-sm text-muted-foreground">
                    {entries.length} {entries.length === 1 ? "entry" : "entries"}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium">
                {formatDuration(totalDuration)}
              </div>
            </div>

            {/* Expandable Table */}
            {isExpanded && (
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => {
                      const project = projectMap.get(entry.project)
                      const duration = entry.endedAt
                        ? new Date(entry.endedAt).getTime() -
                          new Date(entry.startedAt).getTime()
                        : Date.now() - new Date(entry.startedAt).getTime()

                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {project?.name || "Unknown Project"}
                          </TableCell>
                          <TableCell>{formatTime(entry.startedAt)}</TableCell>
                          <TableCell>
                            {entry.endedAt ? (
                              formatTime(entry.endedAt)
                            ) : (
                              <Badge variant="default">Running</Badge>
                            )}
                          </TableCell>
                          <TableCell>{formatDuration(duration)}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {entry.note || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingEntry(entry)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteEntryId(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )
      })}

      {/* Create Dialog */}
      <CreateTimeEntryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultProjectId={selectedProject !== "all" ? selectedProject : undefined}
      />

      {/* Edit Dialog */}
      {editingEntry && (
        <EditTimeEntryDialog
          entry={editingEntry}
          open={!!editingEntry}
          onOpenChange={(open) => !open && setEditingEntry(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteEntryId}
        onOpenChange={() => setDeleteEntryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              time entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
