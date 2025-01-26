"use client"

import { format, addDays, isSameDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DaysListProps {
  weekStart: Date
  bookings: any[]
  onSelectDay: (day: Date) => void
}

export function DaysList({ weekStart, bookings, onSelectDay }: DaysListProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select a Day</h2>
      <div className="space-y-2">
        {days.map((day) => {
          const dayBookings = bookings.filter((booking) => isSameDay(new Date(booking.date), day))
          const hasBookings = dayBookings.length > 0

          return (
            <Button
              key={day.toISOString()}
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => onSelectDay(day)}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-2">{format(day, "EEE")}</span>
                <span className="text-sm text-muted-foreground">{format(day, "MMMM d, yyyy")}</span>
              </div>
              <Badge variant={hasBookings ? "success" : "destructive"}>
                {hasBookings ? `${dayBookings.length} Booked` : "Unbooked"}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

