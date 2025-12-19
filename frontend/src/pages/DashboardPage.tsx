import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Timer } from "../components/Timer"

export const DashboardPage = () => {
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
              <CardTitle className="text-3xl">4.5h</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-3xl">18.5h</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
