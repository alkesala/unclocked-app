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
import { formatDuration } from "../lib/utils"

// Mock projects - replace with actual data later
const MOCK_PROJECTS = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
  { id: "3", name: "Client Website" },
  { id: "4", name: "Internal Tools" },
]

export const Timer = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [milliseconds, setMilliseconds] = useState(0)
  const [selectedProject, setSelectedProject] = useState("")
  const [description, setDescription] = useState("")

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
      alert("Please select a project first")
      return
    }
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMilliseconds(0)
    setDescription("")
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
            <Button
              size="lg"
              variant={isRunning ? "destructive" : "default"}
              onClick={handleStartStop}
              className="min-w-32"
            >
              {isRunning ? "Stop" : "Start"}
            </Button>

            {milliseconds > 0 && !isRunning && (
              <Button size="lg" variant="outline" onClick={handleReset}>
                Reset
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
                disabled={isRunning}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map((project) => (
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
    </Card>
  )
}
