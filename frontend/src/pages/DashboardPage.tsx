import { Button } from "../components/ui/button"
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

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardDescription>Hours Today</CardDescription>
              <CardTitle className="text-3xl">4.5h</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Earnings Today</CardDescription>
              <CardTitle className="text-3xl">$225</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-3xl">18.5h</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Week Earnings</CardDescription>
            <CardTitle className="text-3xl">$925</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Component Examples</h2>
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
    </div>
  )
}
