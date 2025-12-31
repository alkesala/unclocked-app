import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useUpdateTimeEntry } from "../hooks/useTimeEntries"
import { useProjects } from "../hooks/useProjects"
import { formatToDateTimeLocal, isoToDate } from "../lib/utils"
import type { TimeEntry } from "../api/timeEntry"
import { DateTimePicker } from "./DateTimePicker"

interface EditTimeEntryDialogProps {
  entry: TimeEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditTimeEntryDialog = ({
  entry,
  open,
  onOpenChange,
}: EditTimeEntryDialogProps) => {
  const [project, setProject] = useState(entry.project)
  const [startedAt, setStartedAt] = useState<Date>(isoToDate(entry.startedAt))
  const [endedAt, setEndedAt] = useState<Date | undefined>(
    entry.endedAt ? isoToDate(entry.endedAt) : undefined
  )
  const [note, setNote] = useState(entry.note || "")
  const [isRunning, setIsRunning] = useState(!entry.endedAt)
  const [error, setError] = useState<string | null>(null)

  const { data: projectsData } = useProjects()
  const updateEntry = useUpdateTimeEntry()

  // Reset form when entry changes
  useEffect(() => {
    setProject(entry.project)
    setStartedAt(isoToDate(entry.startedAt))
    setEndedAt(entry.endedAt ? isoToDate(entry.endedAt) : undefined)
    setNote(entry.note || "")
    setIsRunning(!entry.endedAt)
    setError(null)
  }, [entry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!project) {
      setError("Please select a project")
      return
    }

    if (!isRunning && endedAt) {
      if (endedAt <= startedAt) {
        setError("End time must be after start time")
        return
      }
    }

    updateEntry.mutate(
      {
        id: entry.id,
        data: {
          project,
          startedAt: formatToDateTimeLocal(startedAt),
          endedAt: isRunning ? undefined : endedAt ? formatToDateTimeLocal(endedAt) : undefined,
          note: note || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to update entry"
          )
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Time Entry</DialogTitle>
          <DialogDescription>
            Update the details of this time entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="project" className="text-sm font-medium">
              Project <span className="text-destructive">*</span>
            </label>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projectsData?.data.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Start Time <span className="text-destructive">*</span>
            </label>
            <DateTimePicker
              value={startedAt}
              onChange={(date) => date && setStartedAt(date)}
              placeholder="Select start time"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRunning"
                checked={isRunning}
                onChange={(e) => setIsRunning(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isRunning" className="text-sm font-medium">
                Currently running
              </label>
            </div>
          </div>

          {!isRunning && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                End Time
              </label>
              <DateTimePicker
                value={endedAt}
                onChange={setEndedAt}
                minDate={startedAt}
                placeholder="Select end time"
              />
            </div>
          )}

          <div className="grid gap-2">
            <label htmlFor="note" className="text-sm font-medium">
              Description (optional)
            </label>
            <Input
              id="note"
              placeholder="What did you work on?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateEntry.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateEntry.isPending}>
              {updateEntry.isPending ? "Updating..." : "Update Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
