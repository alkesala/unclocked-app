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
import { createTimeEntry } from "../api/timeEntry"

// Mock projects - replace with actual data later
const MOCK_PROJECTS = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
  { id: "3", name: "Client Website" },
  { id: "4", name: "Internal Tools" },
]

interface AddEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Helper function to format date to datetime-local input format (YYYY-MM-DDTHH:mm)
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Helper function to format duration in hours and minutes
const formatDurationHoursMinutes = (ms: number): string => {
  const totalMinutes = Math.floor(ms / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
  }
}

// Get default start time (today at 9 AM)
const getDefaultStartTime = (): string => {
  const now = new Date()
  const startTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0
  )
  return formatDateTimeLocal(startTime)
}

// Get default end time (today at 5 PM or current time if after 9 AM)
const getDefaultEndTime = (): string => {
  const now = new Date()
  const currentHour = now.getHours()

  if (currentHour >= 9) {
    // If it's after 9 AM, use current time
    return formatDateTimeLocal(now)
  } else {
    // Otherwise use 5 PM
    const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      0
    )
    return formatDateTimeLocal(endTime)
  }
}

export const AddEntryDialog = ({ open, onOpenChange }: AddEntryDialogProps) => {
  const [project, setProject] = useState("")
  const [startedAt, setStartedAt] = useState(getDefaultStartTime())
  const [endedAt, setEndedAt] = useState(getDefaultEndTime())
  const [note, setNote] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setProject("")
      setStartedAt(getDefaultStartTime())
      setEndedAt(getDefaultEndTime())
      setNote("")
      setIsRunning(false)
      setError(null)
    }
  }, [open])

  // Calculate duration
  const duration = (() => {
    if (isRunning || !endedAt) return null

    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const diff = end.getTime() - start.getTime()

    return diff > 0 ? diff : null
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!project) {
      setError("Please select a project")
      return
    }

    if (!startedAt) {
      setError("Please enter a start time")
      return
    }

    if (!isRunning && !endedAt) {
      setError("Please enter an end time or mark as running")
      return
    }

    if (!isRunning && endedAt) {
      const start = new Date(startedAt)
      const end = new Date(endedAt)
      if (end <= start) {
        setError("End time must be after start time")
        return
      }
    }

    setIsLoading(true)

    try {
      await createTimeEntry({
        project,
        startedAt,
        endedAt: isRunning ? undefined : endedAt,
        note: note || undefined,
      })

      // Success - close dialog
      onOpenChange(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create time entry"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Time Entry</DialogTitle>
          <DialogDescription>
            Manually add a time entry for completed work.
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
                {MOCK_PROJECTS.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="startedAt" className="text-sm font-medium">
              Start Time <span className="text-destructive">*</span>
            </label>
            <Input
              id="startedAt"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
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
                Currently running (no end time)
              </label>
            </div>
          </div>

          {!isRunning && (
            <div className="grid gap-2">
              <label htmlFor="endedAt" className="text-sm font-medium">
                End Time <span className="text-destructive">*</span>
              </label>
              <Input
                id="endedAt"
                type="datetime-local"
                value={endedAt}
                onChange={(e) => setEndedAt(e.target.value)}
                required={!isRunning}
              />
            </div>
          )}

          {duration !== null && (
            <div className="text-sm text-muted-foreground">
              Duration: {formatDurationHoursMinutes(duration)}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
