import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const displayHours = hours
  const displayMinutes = minutes % 60
  const displaySeconds = seconds % 60

  return `${displayHours.toString().padStart(2, "0")}:${displayMinutes
    .toString()
    .padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format ISO to readable date and time
export const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format just the time portion
export const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format date to datetime-local input format (YYYY-MM-DDTHH:mm)
// Updated to accept both Date and string for better flexibility
export const formatToDateTimeLocal = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  const hours = String(dateObj.getHours()).padStart(2, "0")
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Parse ISO string to Date
export const isoToDate = (iso: string): Date => new Date(iso)

// Format Date for datetime picker display
export const formatDateTimeDisplay = (date: Date): string => {
  return format(date, "MMM dd, yyyy - HH:mm")
}

// Format Date for date range display
export const formatDateRange = (date: Date): string => {
  return format(date, "MMM dd, yyyy")
}

// Validate Date
export const isValidDate = (date: Date | undefined | null): date is Date => {
  return date instanceof Date && isValid(date)
}
