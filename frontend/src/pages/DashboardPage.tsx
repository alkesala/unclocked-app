import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Timer } from "../components/Timer"
import { FloatingActionButton } from "../components/FloatingActionButton"
import { useTimeEntries } from "../hooks/useTimeEntries"
import { useProjects } from "../hooks/useProjects"
import { Link } from "@tanstack/react-router"

const calculateHours = (entries: { startedAt: string; endedAt?: string }[]) => {
  const totalMs = entries.reduce((sum, entry) => {
    if (!entry.endedAt) return sum
    const duration = new Date(entry.endedAt).getTime() - new Date(entry.startedAt).getTime()
    return sum + duration
  }, 0)
  return (totalMs / (1000 * 60 * 60)).toFixed(1)
}

const getTodayStart = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const getWeekStart = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export const DashboardPage = () => {
  const { data: allEntries, isLoading } = useTimeEntries()
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects()

  const todayStart = getTodayStart()
  const weekStart = getWeekStart()

  const todayEntries = allEntries?.data.filter(
    (entry) => new Date(entry.startedAt) >= todayStart
  ) || []

  const weekEntries = allEntries?.data.filter(
    (entry) => new Date(entry.startedAt) >= weekStart
  ) || []

  const hoursToday = isLoading ? "-" : `${calculateHours(todayEntries)}h`
  const hoursThisWeek = isLoading ? "-" : `${calculateHours(weekEntries)}h`
  const totalProjects = isLoadingProjects ? "-" : (projectsData?.total || 0)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <Timer />
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Hours Today</CardDescription>
              <CardTitle className="text-3xl">{hoursToday}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">{hoursThisWeek}</CardTitle>
            </CardHeader>
          </Card>

          <Link to="/projects" className="block hover:opacity-80 transition-opacity">
            <Card>
              <CardHeader>
                <CardDescription>Total Projects</CardDescription>
                <CardTitle className="text-3xl">{totalProjects}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      <FloatingActionButton />
    </div>
  )
}
