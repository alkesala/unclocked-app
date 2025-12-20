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
import { useUpdateProject } from "../hooks/useProjects"
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
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description || "")
  const [hourlyRate, setHourlyRate] = useState(project.hourlyRate.toString())
  const [isActive, setIsActive] = useState(project.isActive)
  const [error, setError] = useState<string | null>(null)

  const updateProject = useUpdateProject()

  // Update form when project changes
  useEffect(() => {
    setName(project.name)
    setDescription(project.description || "")
    setHourlyRate(project.hourlyRate.toString())
    setIsActive(project.isActive)
    setError(null)
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    const rate = parseFloat(hourlyRate)
    if (isNaN(rate) || rate < 0) {
      setError("Hourly rate must be a valid number")
      return
    }

    updateProject.mutate(
      {
        id: project._id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          hourlyRate: rate,
          isActive,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to update project"
          )
        },
      }
    )
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
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
              disabled={updateProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
