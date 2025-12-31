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
import { useUpdateProject } from "../hooks/useProjects"
import { useFormDialog } from "../hooks/useFormDialog"
import { useDialogMutation } from "../hooks/useDialogMutation"
import type { Project } from "../api/project"

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditProjectDialog = ({
  project,
  open,
  onOpenChange,
}: EditProjectDialogProps) => {
  const { formState, updateField } = useFormDialog({
    open,
    defaultValues: () => ({
      name: project.name,
      description: project.description || "",
      hourlyRate: project.hourlyRate.toString(),
      isActive: project.isActive,
    }),
    dependencies: [project],
  })

  const updateProject = useUpdateProject()
  const { error, setError, clearError, isPending, handleMutate } = useDialogMutation({
    mutation: updateProject,
    onSuccess: () => onOpenChange(false),
    defaultErrorMessage: "Failed to update project",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validation
    if (!formState.name.trim()) {
      setError("Project name is required")
      return
    }

    const rate = parseFloat(formState.hourlyRate)
    if (isNaN(rate) || rate < 0) {
      setError("Hourly rate must be a valid number")
      return
    }

    handleMutate({
      id: project.id,
      data: {
        name: formState.name.trim(),
        description: formState.description.trim() || undefined,
        hourlyRate: rate,
        isActive: formState.isActive,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="My Project"
              value={formState.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Input
              id="description"
              placeholder="Project description"
              value={formState.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="hourlyRate" className="text-sm font-medium">
              Hourly Rate
            </label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formState.hourlyRate}
              onChange={(e) => updateField("hourlyRate", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formState.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Project is active
              </label>
            </div>
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
              {isPending ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
