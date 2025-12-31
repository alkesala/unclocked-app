import { useState, useMemo } from "react"
import { useParams, Link } from "@tanstack/react-router"
import { ArrowLeft, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import {
    useTimeEntries,
    useDeleteTimeEntry,
} from "../hooks/useTimeEntries"
import { useProjects } from "../hooks/useProjects"
import { useDateGroupedEntries } from "../hooks/useDateGroupedEntries"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
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
import { formatDuration, formatTime } from "../lib/utils"
import { calculateTotalDuration, calculateEntryDuration } from "../lib/calculations"
import type { TimeEntry } from "../api/timeEntry"

export const ProjectEntriesPage = () => {
    const { projectId } = useParams({ from: "/projects/$projectId/entries" })

    // Dialog states
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
    const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null)

    // Expanded sections
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

    // Data fetching - filter by project
    const { data: entriesData, isLoading: isLoadingEntries } = useTimeEntries({
        project: projectId,
    })
    const { data: projectsData, isLoading: isLoadingProjects } = useProjects()
    const deleteEntry = useDeleteTimeEntry()

    // Find the current project
    const project = useMemo(() => {
        return projectsData?.data.find((p) => p.id === projectId)
    }, [projectsData, projectId])

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

    // Date grouping logic
    const { groupedEntries, sortedDates } = useDateGroupedEntries({
        entries: entriesData?.data || [],
        sortOrder: 'desc',
    })

    // Calculate total time for the project
    const totalDuration = useMemo(() => {
        const entries = entriesData?.data || []
        return calculateTotalDuration(entries)
    }, [entriesData])

    if (isLoadingEntries || isLoadingProjects) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="text-center py-12 text-muted-foreground">
                    Loading...
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">
                        Project not found
                    </h3>
                    <Link to="/projects">
                        <Button variant="outline">Back to Projects</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header with Back Navigation */}
            <div className="mb-6">
                <Link to="/projects">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Button>
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {project.name}
                        </h1>
                        {project.description && (
                            <p className="text-muted-foreground mb-2">
                                {project.description}
                            </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                            <span>
                                <span className="font-medium">Total Time:</span>{" "}
                                {formatDuration(totalDuration)}
                            </span>
                            <span>
                                <span className="font-medium">Entries:</span>{" "}
                                {entriesData?.data.length || 0}
                            </span>
                            {project.hourlyRate && (
                                <span>
                                    <span className="font-medium">Rate:</span> $
                                    {project.hourlyRate}/hr
                                </span>
                            )}
                        </div>
                    </div>
                    <Badge variant={project.isActive ? "default" : "secondary"}>
                        {project.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </div>

            {/* Empty State */}
            {sortedDates.length === 0 && (
                <div className="border rounded-lg p-12 text-center">
                    <h3 className="text-lg font-semibold mb-2">
                        No time entries yet
                    </h3>
                    <p className="text-muted-foreground">
                        Start tracking time for this project to see entries here
                    </p>
                </div>
            )}

            {/* Date Groups */}
            {sortedDates.map((date) => {
                const entries = groupedEntries[date]
                const isExpanded = expandedDates.has(date)

                // Calculate total duration for the day
                const dailyDuration = calculateTotalDuration(entries)

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
                                        {entries.length}{" "}
                                        {entries.length === 1 ? "entry" : "entries"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm font-medium">
                                {formatDuration(dailyDuration)}
                            </div>
                        </div>

                        {/* Expandable Table */}
                        {isExpanded && (
                            <div className="border-t">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>End Time</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entries.map((entry) => {
                                            const duration = calculateEntryDuration(entry)

                                            return (
                                                <TableRow key={entry.id}>
                                                    <TableCell>
                                                        {formatTime(entry.startedAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.endedAt ? (
                                                            formatTime(entry.endedAt)
                                                        ) : (
                                                            <Badge variant="default">
                                                                Running
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDuration(duration)}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {entry.note || "-"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setEditingEntry(entry)
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setDeleteEntryId(
                                                                        entry.id
                                                                    )
                                                                }
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
                            This action cannot be undone. This will permanently
                            delete the time entry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
