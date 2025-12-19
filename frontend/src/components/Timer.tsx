import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { formatDuration } from "../lib/utils"

export const Timer = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [milliseconds, setMilliseconds] = useState(0)

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
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setMilliseconds(0)
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
        </div>
      </CardContent>
    </Card>
  )
}
