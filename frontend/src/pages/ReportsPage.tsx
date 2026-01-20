import { useState } from "react"
import { Trash2, Eye } from "lucide-react"
import { useReports, useDeleteReport } from "../hooks/useReports"
import { useProjects } from "../hooks/useProjects"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { CreateReportDialog } from "../components/CreateReportDialog"
import { ViewReportDialog } from "../components/ViewReportDialog"
import { formatCurrency, formatDuration, formatDate } from "../lib/utils"

export const ReportsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null)
  const [viewReportId, setViewReportId] = useState<string | null>(null)

  const { data: reportsData, isLoading } = useReports()
  const { data: projectsData } = useProjects()
  const deleteReport = useDeleteReport()

  const handleDelete = () => {
    if (deleteReportId) {
      deleteReport.mutate(deleteReportId, {
        onSuccess: () => {
          setDeleteReportId(null)
        },
      })
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projectsData?.data.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          Loading reports...
        </div>
      </div>
    )
  }

  const reports = reportsData?.data || []

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Create Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first report to track time and earnings
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            Create Report
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{getProjectName(report.project)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(report.rangeStart)}</div>
                      <div className="text-muted-foreground">
                        to {formatDate(report.rangeEnd)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatDuration(report.totalHours * 3600000)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(report.totalEarnings / 100)}
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewReportId(report.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteReportId(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateReportDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <ViewReportDialog
        reportId={viewReportId}
        open={!!viewReportId}
        onOpenChange={(open) => !open && setViewReportId(null)}
      />

      <AlertDialog
        open={!!deleteReportId}
        onOpenChange={() => setDeleteReportId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
