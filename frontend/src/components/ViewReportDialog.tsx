import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { useReportDetails } from '../hooks/useReports'
import { exportToCSV, exportToPDF, exportToJSON } from '../lib/exportUtils'
import { formatDate, formatTime, formatDuration, formatCurrency } from '../lib/utils'
import {
  calculateTotalDuration,
  msToHours,
  calculateEntryEarnings,
  calculateDuration,
} from '../lib/calculations'
import { FileText, FileDown, FileJson, Loader2 } from 'lucide-react'
import type { TimeEntry } from '../api/timeEntry'

interface ViewReportDialogProps {
  reportId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ViewReportDialog = ({
  reportId,
  open,
  onOpenChange,
}: ViewReportDialogProps) => {
  const [exporting, setExporting] = useState(false)
  const { data, isLoading, error } = useReportDetails(reportId)

  // Group entries by date
  const groupedEntries = useMemo(() => {
    if (!data) return {}

    const groups: Record<string, TimeEntry[]> = {}

    data.timeEntries.forEach((entry) => {
      const date = new Date(entry.startedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    })

    // Sort entries within each group by startedAt (newest first)
    Object.keys(groups).forEach((date) => {
      groups[date].sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      )
    })

    return groups
  }, [data])

  // Sorted dates (newest first)
  const sortedDates = useMemo(() => {
    return Object.keys(groupedEntries).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )
  }, [groupedEntries])

  const handleExport = async (
    format: 'csv' | 'pdf' | 'json',
    exportFn: (reportData: NonNullable<typeof data>) => void | Promise<void>
  ) => {
    if (!data) return

    setExporting(true)
    try {
      await exportFn(data)
    } catch (error) {
      console.error(`Failed to export ${format}:`, error)
    } finally {
      setExporting(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading report...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">Failed to load report</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const { report, timeEntries } = data

  // Calculate totals
  const totalDurationMs = calculateTotalDuration(timeEntries)
  const totalHours = msToHours(totalDurationMs)

  const totalEarnings = timeEntries.reduce((sum, entry) => {
    return sum + calculateEntryEarnings(entry, report.project)
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{report.name}</DialogTitle>
          <DialogDescription>
            {report.project.name} • {formatDate(report.rangeStart)} - {formatDate(report.rangeEnd)}
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Hours</div>
            <div className="text-2xl font-bold">{totalHours.toFixed(2)}h</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Earnings</div>
            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
          </div>
        </div>

        {/* Time Entries - Scrollable */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          <div className="p-4">
            <h3 className="font-semibold mb-4">
              Time Entries ({timeEntries.length})
            </h3>

            {timeEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No time entries in this period
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map((date) => {
                  const entries = groupedEntries[date]

                  // Calculate daily total
                  const dailyTotal = calculateTotalDuration(entries)

                  return (
                    <div key={date} className="border rounded-lg">
                      <div className="bg-muted/50 p-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{date}</h4>
                          <p className="text-sm text-muted-foreground">
                            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {formatDuration(dailyTotal)}
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Earnings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.map((entry) => {
                            if (!entry.endedAt) return null

                            const durationMs = calculateDuration(entry.startedAt, entry.endedAt)
                            const earnings = calculateEntryEarnings(entry, report.project)

                            return (
                              <TableRow key={entry.id}>
                                <TableCell>{formatTime(entry.startedAt)}</TableCell>
                                <TableCell>{formatTime(entry.endedAt)}</TableCell>
                                <TableCell>{formatDuration(durationMs)}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {entry.note || '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(earnings)}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Export Buttons */}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv', exportToCSV)}
            disabled={exporting || timeEntries.length === 0}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf', exportToPDF)}
            disabled={exporting || timeEntries.length === 0}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json', exportToJSON)}
            disabled={exporting || timeEntries.length === 0}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <FileJson className="h-4 w-4 mr-2" />
            )}
            JSON
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exporting}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
