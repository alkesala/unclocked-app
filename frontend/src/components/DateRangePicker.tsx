import { useState } from "react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { formatDateRange } from "../lib/utils"
import { cn } from "../lib/utils"
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
} from "date-fns"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onRangeChange: (range: { start: Date | undefined; end: Date | undefined }) => void
  placeholder?: string
  disabled?: boolean
}

interface Preset {
  label: string
  range: () => { start: Date; end: Date }
}

const presets: Preset[] = [
  {
    label: "Today",
    range: () => ({
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    range: () => ({
      start: startOfDay(subDays(new Date(), 1)),
      end: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Last 7 days",
    range: () => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 14 days",
    range: () => ({
      start: startOfDay(subDays(new Date(), 13)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    range: () => ({
      start: startOfDay(subDays(new Date(), 29)),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: "This month",
    range: () => ({
      start: startOfMonth(new Date()),
      end: endOfDay(new Date()),
    }),
  },
  {
    label: "Last month",
    range: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      }
    },
  },
  {
    label: "This year",
    range: () => ({
      start: startOfYear(new Date()),
      end: endOfDay(new Date()),
    }),
  },
]

export const DateRangePicker = ({
  startDate,
  endDate,
  onRangeChange,
  placeholder = "Select date range",
  disabled = false,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const [tempRange, setTempRange] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })

  // When popover opens, sync temp state with current value
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempRange({ from: startDate, to: endDate })
    }
    setOpen(newOpen)
  }

  const handlePresetClick = (preset: Preset) => {
    const range = preset.range()
    setTempRange({ from: range.start, to: range.end })
  }

  const handleApply = () => {
    onRangeChange({
      start: tempRange?.from,
      end: tempRange?.to,
    })
    setOpen(false)
  }

  const handleClear = () => {
    setTempRange({ from: undefined, to: undefined })
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const displayText = () => {
    if (startDate && endDate) {
      return `${formatDateRange(startDate)} - ${formatDateRange(endDate)}`
    }
    if (startDate) {
      return formatDateRange(startDate)
    }
    return placeholder
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && !endDate && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Preset Sidebar */}
          <div className="flex flex-col gap-1 border-r p-3 min-w-[140px]">
            <div className="text-sm font-medium mb-2">Quick Select</div>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start text-sm font-normal"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={2}
              initialFocus
            />

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
