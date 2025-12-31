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
import { useCreateReport } from "../hooks/useReports"
import { useProjects } from "../hooks/useProjects"
import { DateRangePicker } from "./DateRangePicker"
import { format } from "date-fns"

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateReportDialog = ({
  open,
  onOpenChange,
}: CreateReportDialogProps) => {
  const [name, setName] = useState("")
  const [project, setProject] = useState("")
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined
    end: Date | undefined
  }>({ start: undefined, end: undefined })
  const [error, setError] = useState<string | null>(null)

  const { data: projectsData } = useProjects()
  const createReport = useCreateReport()

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName("")
      setProject("")
      setDateRange({ start: undefined, end: undefined })
      setError(null)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!name.trim()) {
      setError("Please enter a report name")
      return
    }

    if (!project) {
      setError("Please select a project")
      return
    }

    if (!dateRange.start || !dateRange.end) {
      setError("Please select a date range")
      return
    }

    if (dateRange.end <= dateRange.start) {
      setError("End date must be after start date")
      return
    }

    createReport.mutate(
      {
        name: name.trim(),
        project,
        rangeStart: format(dateRange.start, "yyyy-MM-dd"),
        rangeEnd: format(dateRange.end, "yyyy-MM-dd"),
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
        onError: (err) => {
          setError(
            err instanceof Error ? err.message : "Failed to create report"
          )
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Report</DialogTitle>
          <DialogDescription>
            Generate a report for a project within a specific date range.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Report Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="e.g. Q4 2024 Summary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              Date Range <span className="text-destructive">*</span>
            </label>
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onRangeChange={setDateRange}
              placeholder="Select report date range"
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
              disabled={createReport.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createReport.isPending}>
              {createReport.isPending ? "Creating..." : "Create Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
