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
import { useCreateTimeEntry } from "../hooks/useTimeEntries"
import { useProjects } from "../hooks/useProjects"
import { formatToDateTimeLocal } from "../lib/utils"
import { DateTimePicker } from "./DateTimePicker"
import { useFormDialog } from "../hooks/useFormDialog"
import { useDialogMutation } from "../hooks/useDialogMutation"

interface CreateTimeEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProjectId?: string
}

export const CreateTimeEntryDialog = ({
  open,
  onOpenChange,
  defaultProjectId,
}: CreateTimeEntryDialogProps) => {
  const { formState, updateField } = useFormDialog({
    open,
    defaultValues: () => ({
      project: defaultProjectId || "",
      startedAt: new Date(),
      endedAt: undefined as Date | undefined,
      note: "",
      isRunning: false,
    }),
    dependencies: [defaultProjectId],
  })

  const { data: projectsData } = useProjects()
  const createEntry = useCreateTimeEntry()
  const { error, setError, clearError, isPending, handleMutate } = useDialogMutation({
    mutation: createEntry,
    onSuccess: () => onOpenChange(false),
    defaultErrorMessage: "Failed to create entry",
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
      project: formState.project,
      startedAt: formatToDateTimeLocal(formState.startedAt),
      endedAt: formState.isRunning ? undefined : formState.endedAt ? formatToDateTimeLocal(formState.endedAt) : undefined,
      note: formState.note || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Time Entry</DialogTitle>
          <DialogDescription>
            Add a new time entry for your project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Project Selection */}
          <div className="grid gap-2">
            <label htmlFor="project" className="text-sm font-medium">
              Project <span className="text-destructive">*</span>
            </label>
            <Select
              value={formState.project}
              onValueChange={(value) => updateField("project", value)}
            >
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

          {/* Start Time */}
          <div className="grid gap-2">
            <label htmlFor="startTime" className="text-sm font-medium">
              Start Time <span className="text-destructive">*</span>
            </label>
            <DateTimePicker
              date={formState.startedAt}
              setDate={(date) => updateField("startedAt", date || new Date())}
            />
          </div>

          {/* Running Checkbox */}
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
                Timer is running (no end time)
              </label>
            </div>
          </div>

          {/* End Time - Only show if not running */}
          {!formState.isRunning && (
            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <DateTimePicker
                date={formState.endedAt}
                setDate={(date) => updateField("endedAt", date)}
              />
            </div>
          )}

          {/* Note */}
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
              {isPending ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
