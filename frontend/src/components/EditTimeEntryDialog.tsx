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
import { useFormDialog } from "../hooks/useFormDialog"
import { useDialogMutation } from "../hooks/useDialogMutation"

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
  const { formState, updateField } = useFormDialog({
    open,
    defaultValues: () => ({
      project: entry.project,
      startedAt: isoToDate(entry.startedAt),
      endedAt: entry.endedAt ? isoToDate(entry.endedAt) : undefined,
      note: entry.note || "",
      isRunning: !entry.endedAt,
    }),
    dependencies: [entry],
  })

  const { data: projectsData } = useProjects()
  const updateEntry = useUpdateTimeEntry()
  const { error, setError, clearError, isPending, handleMutate } = useDialogMutation({
    mutation: updateEntry,
    onSuccess: () => onOpenChange(false),
    defaultErrorMessage: "Failed to update entry",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validation
    if (!formState.project) {
      setError("Please select a project")
      return
    }

    if (!formState.isRunning && formState.endedAt) {
      if (formState.endedAt <= formState.startedAt) {
        setError("End time must be after start time")
        return
      }
    }

    handleMutate({
      id: entry.id,
      data: {
        project: formState.project,
        startedAt: formatToDateTimeLocal(formState.startedAt),
        endedAt: formState.isRunning ? undefined : formState.endedAt ? formatToDateTimeLocal(formState.endedAt) : undefined,
        note: formState.note || undefined,
      },
    })
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
            <Select value={formState.project} onValueChange={(value) => updateField("project", value)}>
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
              value={formState.startedAt}
              onChange={(date) => date && updateField("startedAt", date)}
              placeholder="Select start time"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRunning"
                checked={formState.isRunning}
                onChange={(e) => updateField("isRunning", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isRunning" className="text-sm font-medium">
                Currently running
              </label>
            </div>
          </div>

          {!formState.isRunning && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                End Time
              </label>
              <DateTimePicker
                value={formState.endedAt}
                onChange={(date) => updateField("endedAt", date)}
                minDate={formState.startedAt}
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
              value={formState.note}
              onChange={(e) => updateField("note", e.target.value)}
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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
