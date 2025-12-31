import type { ReportDetails } from '../api/reports'
import { formatDuration, formatTime } from './utils'
import { format } from 'date-fns'
import { calculateDuration, msToHours, getEffectiveHourlyRate, calculateEntryEarnings } from './calculations'

/**
 * Sanitize filename by replacing non-alphanumeric characters with underscores
 */
const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, '_')
}

/**
 * Generate filename with format: {ReportName}_{YYYY-MM-DD}.{ext}
 */
const generateFilename = (reportName: string, extension: string): string => {
  const sanitized = sanitizeFilename(reportName)
  const date = format(new Date(), 'yyyy-MM-dd')
  return `${sanitized}_${date}.${extension}`
}

/**
 * Trigger browser download for a file
 */
const downloadFile = (content: string | Blob, filename: string, mimeType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Escape CSV field values (handle quotes and commas)
 */
const escapeCsvField = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return ''
  const str = String(value)
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Export report to CSV format
 */
export const exportToCSV = (data: ReportDetails): void => {
  const { report, timeEntries } = data

  // Calculate totals
  let totalHours = 0
  let totalEarnings = 0

  // Build CSV content
  const lines: string[] = []

  // Metadata section
  lines.push(`Report: ${escapeCsvField(report.name)}`)
  lines.push(`Project: ${escapeCsvField(report.project.name)}`)
  lines.push(`Period: ${format(new Date(report.rangeStart), 'MMM dd, yyyy')} - ${format(new Date(report.rangeEnd), 'MMM dd, yyyy')}`)
  lines.push(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`)
  lines.push('') // Empty line

  // Header row
  lines.push('Date,Start Time,End Time,Duration,Hours,Rate,Earnings,Description')

  // Data rows
  timeEntries.forEach((entry) => {
    const startDate = new Date(entry.startedAt)
    const endDate = entry.endedAt ? new Date(entry.endedAt) : null

    if (!endDate) return // Skip running entries

    const durationMs = calculateDuration(entry.startedAt, entry.endedAt!)
    const durationHours = msToHours(durationMs)
    const rate = getEffectiveHourlyRate(entry, report.project)
    const earnings = calculateEntryEarnings(entry, report.project)

    totalHours += durationHours
    totalEarnings += earnings

    const row = [
      format(startDate, 'MMM dd, yyyy'),
      formatTime(entry.startedAt),
      formatTime(entry.endedAt!),
      formatDuration(durationMs),
      durationHours.toFixed(2),
      `$${rate.toFixed(2)}`,
      `$${earnings.toFixed(2)}`,
      escapeCsvField(entry.note || ''),
    ].join(',')

    lines.push(row)
  })

  // Summary row
  lines.push('') // Empty line
  lines.push(`Total,,,${formatDuration(totalHours * 3600 * 1000)},${totalHours.toFixed(2)},,$${totalEarnings.toFixed(2)},`)

  // Download
  const csvContent = lines.join('\n')
  const filename = generateFilename(report.name, 'csv')
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

/**
 * Export report to PDF format using jsPDF and autotable
 */
export const exportToPDF = async (data: ReportDetails): Promise<void> => {
  // Dynamic import to reduce bundle size
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const { report, timeEntries } = data

  // Calculate totals
  let totalHours = 0
  let totalEarnings = 0

  // Create PDF
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.text(report.name, 14, 20)

  // Metadata
  doc.setFontSize(10)
  doc.text(`Project: ${report.project.name}`, 14, 30)
  doc.text(
    `Period: ${format(new Date(report.rangeStart), 'MMM dd, yyyy')} - ${format(new Date(report.rangeEnd), 'MMM dd, yyyy')}`,
    14,
    36
  )
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 42)

  // Prepare table data
  const tableData = timeEntries
    .filter((entry) => entry.endedAt) // Only include completed entries
    .map((entry) => {
      const startDate = new Date(entry.startedAt)
      const endDate = new Date(entry.endedAt!)

      const durationMs = calculateDuration(entry.startedAt, entry.endedAt!)
      const durationHours = msToHours(durationMs)
      const rate = getEffectiveHourlyRate(entry, report.project)
      const earnings = calculateEntryEarnings(entry, report.project)

      totalHours += durationHours
      totalEarnings += earnings

      return [
        format(startDate, 'MMM dd, yyyy'),
        formatTime(entry.startedAt),
        formatTime(entry.endedAt!),
        formatDuration(durationMs),
        `${durationHours.toFixed(2)}h`,
        `$${rate.toFixed(2)}`,
        `$${earnings.toFixed(2)}`,
        entry.note || '-',
      ]
    })

  // Add summary boxes
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Hours: ${totalHours.toFixed(2)}h`, 14, 52)
  doc.text(`Total Earnings: $${totalEarnings.toFixed(2)}`, 100, 52)

  // Add table
  autoTable(doc, {
    startY: 60,
    head: [['Date', 'Start', 'End', 'Duration', 'Hours', 'Rate', 'Earnings', 'Description']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 22 },
      4: { cellWidth: 16 },
      5: { cellWidth: 18 },
      6: { cellWidth: 20 },
      7: { cellWidth: 'auto' },
    },
  })

  // Download
  const filename = generateFilename(report.name, 'pdf')
  doc.save(filename)
}

/**
 * Export report to JSON format
 */
export const exportToJSON = (data: ReportDetails): void => {
  const { report, timeEntries } = data

  // Calculate totals
  let totalHours = 0
  let totalEarnings = 0

  // Build JSON structure with calculated fields
  const enrichedEntries = timeEntries.map((entry) => {
    const startDate = new Date(entry.startedAt)
    const endDate = entry.endedAt ? new Date(entry.endedAt) : null

    if (!endDate) {
      return {
        ...entry,
        duration: null,
        durationHours: null,
        rate: getEffectiveHourlyRate(entry, report.project),
        earnings: null,
        status: 'running',
      }
    }

    const durationMs = calculateDuration(entry.startedAt, entry.endedAt!)
    const durationHours = msToHours(durationMs)
    const rate = getEffectiveHourlyRate(entry, report.project)
    const earnings = calculateEntryEarnings(entry, report.project)

    totalHours += durationHours
    totalEarnings += earnings

    return {
      ...entry,
      duration: durationMs,
      durationHours: Number(durationHours.toFixed(2)),
      rate,
      earnings: Number(earnings.toFixed(2)),
      status: 'completed',
    }
  })

  const exportData = {
    report: {
      id: report.id,
      name: report.name,
      project: report.project,
      rangeStart: report.rangeStart,
      rangeEnd: report.rangeEnd,
      totalHours: Number(totalHours.toFixed(2)),
      totalEarnings: Number(totalEarnings.toFixed(2)),
      createdAt: report.createdAt,
      exportedAt: new Date().toISOString(),
    },
    timeEntries: enrichedEntries,
    summary: {
      totalEntries: timeEntries.length,
      completedEntries: timeEntries.filter((e) => e.endedAt).length,
      runningEntries: timeEntries.filter((e) => !e.endedAt).length,
      totalHours: Number(totalHours.toFixed(2)),
      totalEarnings: Number(totalEarnings.toFixed(2)),
    },
  }

  // Download
  const jsonContent = JSON.stringify(exportData, null, 2)
  const filename = generateFilename(report.name, 'json')
  downloadFile(jsonContent, filename, 'application/json')
}
