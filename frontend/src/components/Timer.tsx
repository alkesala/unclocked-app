import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { formatDuration } from "../lib/utils"
import { calculateEntryDuration } from "../lib/calculations"
import { useProjects } from "../hooks/useProjects"
import { useCreateTimeEntry, useEndTimeEntry, useDeleteTimeEntry, useTimeEntry } from "../hooks/useTimeEntries"

const RUNNING_TIMER_KEY = 'running_timer_entry_id'

export const Timer = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [milliseconds, setMilliseconds] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [selectedProject, setSelectedProject] = useState("")
  const [description, setDescription] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [runningEntryId, setRunningEntryId] = useState<string | null>(null)

  const { data: projectsData, isLoading: isLoadingProjects } = useProjects()
  const createEntry = useCreateTimeEntry()
  const endEntry = useEndTimeEntry()
  const deleteEntry = useDeleteTimeEntry()

  // Load persisted timer on mount
  useEffect(() => {
    const savedEntryId = localStorage.getItem(RUNNING_TIMER_KEY)
    if (savedEntryId) {
      setRunningEntryId(savedEntryId)
      // Entry data will be fetched via useTimeEntry below
    }
  }, [])

  // Fetch the running entry if we have an ID
  const { data: runningEntry } = useTimeEntry(runningEntryId)

  // Resume timer from persisted entry
  useEffect(() => {
    if (runningEntry && !runningEntry.endedAt) {
      const startedAt = new Date(runningEntry.startedAt)
      const elapsed = calculateEntryDuration(runningEntry)
      setMilliseconds(elapsed)
      setStartTime(startedAt)
      setSelectedProject(runningEntry.project)
      setDescription(runningEntry.note || "")
      setIsRunning(true)
    }
  }, [runningEntry])

  useEffect(() => {
    let interval: number | undefined

    if (isRunning) {
      interval = window.setInterval(() => {
        setMilliseconds((prev) => prev + 1000)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRunning])

  const handleStartStop = () => {
    if (!isRunning && !selectedProject) {
      setShowAlert(true)
      return
    }

    if (!isRunning) {
      // START: Create entry without endedAt
      const now = new Date()
      setStartTime(now)

      createEntry.mutate(
        {
          project: selectedProject,
          startedAt: now.toISOString(),
          // NO endedAt - entry stays running
          note: description || undefined,
        },
        {
          onSuccess: (entry) => {
            // Save entry ID to localStorage
            localStorage.setItem(RUNNING_TIMER_KEY, entry.id)
            setRunningEntryId(entry.id)
            setIsRunning(true)
          },
        }
      )
    } else {
      // STOP: End the running entry
      if (runningEntryId) {
        endEntry.mutate(
          {
            id: runningEntryId,
            endedAt: new Date().toISOString(),
          },
          {
            onSuccess: () => {
              localStorage.removeItem(RUNNING_TIMER_KEY)
              setRunningEntryId(null)
              setIsRunning(false)
            },
          }
        )
      }
    }
  }

  const handleSave = () => {
    if (!startTime || !selectedProject) return

    if (runningEntryId) {
      // Entry already on server, just end it
      const endTime = new Date()
      endEntry.mutate(
        {
          id: runningEntryId,
          endedAt: endTime.toISOString(),
        },
        {
          onSuccess: () => {
            localStorage.removeItem(RUNNING_TIMER_KEY)
            setRunningEntryId(null)
            setMilliseconds(0)
            setStartTime(null)
            setDescription("")
            setSelectedProject("")
          },
        }
      )
    } else {
      // Fallback: create entry with both start and end times
      const endTime = new Date()
      createEntry.mutate(
        {
          project: selectedProject,
          startedAt: startTime.toISOString(),
          endedAt: endTime.toISOString(),
          note: description || undefined,
        },
        {
          onSuccess: () => {
            setMilliseconds(0)
            setStartTime(null)
            setDescription("")
            setSelectedProject("")
          },
        }
      )
    }
  }

  const handleDiscard = () => {
    if (runningEntryId) {
      // Delete the running entry from server
      deleteEntry.mutate(runningEntryId, {
        onSuccess: () => {
          localStorage.removeItem(RUNNING_TIMER_KEY)
          setRunningEntryId(null)
          setIsRunning(false)
          setMilliseconds(0)
          setDescription("")
          setSelectedProject("")
        },
      })
    } else {
      // Just local state reset
      setIsRunning(false)
      setMilliseconds(0)
      setDescription("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl font-bold tabular-nums">
            {formatDuration(milliseconds)}
          </div>

          <div className="flex gap-2">
            {milliseconds > 0 && !isRunning ? (
              <>
                <Button
                  size="lg"
                  onClick={handleStartStop}
                  className="min-w-32"
                >
                  Continue
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSave}
                  className="min-w-32"
                >
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDiscard}
                  className="min-w-32"
                >
                  Discard
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant={isRunning ? "destructive" : "default"}
                onClick={handleStartStop}
                className="min-w-32"
              >
                {isRunning ? "Stop" : "Start"}
              </Button>
            )}
          </div>

          {isRunning && (
            <div className="text-sm text-muted-foreground animate-pulse">
              Timer is running...
            </div>
          )}

          <div className="w-full max-w-md grid gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Project
              </label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
                disabled={isRunning || isLoadingProjects}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoadingProjects ? "Loading projects..." : "Select a project"} />
                </SelectTrigger>
                <SelectContent>
                  {projectsData?.data.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (optional)
              </label>
              <Input
                placeholder="What are you working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please select a project before starting the timer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
