import { useState } from "react"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Calendar as CalendarIcon } from "lucide-react"
import { formatDateTimeDisplay } from "../lib/utils"
import { cn } from "../lib/utils"

interface DateTimePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export const DateTimePicker = ({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  minDate,
  maxDate,
}: DateTimePickerProps) => {
  const [open, setOpen] = useState(false)
  const [tempDate, setTempDate] = useState<Date | undefined>(value)
  const [tempHours, setTempHours] = useState<number>(
    value ? value.getHours() : new Date().getHours()
  )
  const [tempMinutes, setTempMinutes] = useState<number>(
    value ? value.getMinutes() : new Date().getMinutes()
  )

  // When popover opens, sync temp state with current value
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempDate(value)
      setTempHours(value ? value.getHours() : new Date().getHours())
      setTempMinutes(value ? value.getMinutes() : new Date().getMinutes())
    }
    setOpen(newOpen)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setTempDate(selectedDate)
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value, 10)
    if (!isNaN(hours) && hours >= 0 && hours <= 23) {
      setTempHours(hours)
    } else if (e.target.value === "") {
      setTempHours(0)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value, 10)
    if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
      setTempMinutes(minutes)
    } else if (e.target.value === "") {
      setTempMinutes(0)
    }
  }

  const handleApply = () => {
    if (tempDate) {
      const combined = new Date(tempDate)
      combined.setHours(tempHours, tempMinutes, 0, 0)
      onChange(combined)
    } else {
      onChange(undefined)
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateTimeDisplay(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            initialFocus
          />
          <div className="border-t pt-3 mt-3">
            <label className="text-sm font-medium mb-2 block">Time</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={tempHours}
                  onChange={handleHoursChange}
                  className="text-center"
                  placeholder="HH"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  Hours
                </div>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={tempMinutes}
                  onChange={handleMinutesChange}
                  className="text-center"
                  placeholder="MM"
                />
                <div className="text-xs text-muted-foreground text-center mt-1">
                  Minutes
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleApply}
              disabled={!tempDate}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
