"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  buttonClassName?: string;
  disabled?: boolean | ((date: Date) => boolean);
  allowPastDates?: boolean; // New prop to control past date selection
}

export function DatePicker({
  date,
  setDate,
  buttonClassName,
  disabled = false,
  allowPastDates = true // Default to true for backward compatibility
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false); // Close popover on date selection
  }

  // Function to disable dates based on allowPastDates prop
  const disableDates = (date: Date) => {
    if (!allowPastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  };

  // Combine custom disable function with provided disabled prop
  const combinedDisabled: CalendarProps['disabled'] = (date: Date) => {
    if (typeof disabled === 'function') {
      return disabled(date) || disableDates(date);
    }
    return disabled || disableDates(date);
  };


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={typeof disabled === 'boolean' ? disabled : false} // Button disabled only if boolean `true`
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            buttonClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          disabled={combinedDisabled}
        />
      </PopoverContent>
    </Popover>
  )
}
