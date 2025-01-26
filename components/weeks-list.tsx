"use client"

import { differenceInWeeks, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Week {
  start: Date
  end: Date
  bookings: any[]
}

interface WeeksListProps {
  weeks: Week[]
  onSelectWeek: (week: Week) => void
  getWeekNumber: (date: Date) => number
}

export function WeeksList({ weeks, onSelectWeek, getWeekNumber }: WeeksListProps) {
  const firstWeekStart = weeks[0]?.start

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Booked Weeks</h2>
      <div className="space-y-2">
        {weeks.map((week) => {
          const weekNumber = getWeekNumber(week.start)
          return (
            <Button
              key={week.start.toISOString()}
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => onSelectWeek(week)}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-semibold">Week {weekNumber}</span>
                <span className="text-sm text-muted-foreground">
                  {format(week.start, "MMM d")} - {format(week.end, "MMM d, yyyy")}
                </span>
              </div>
              <Badge variant="success">
                {week.bookings.length} booking{week.bookings.length !== 1 ? "s" : ""}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

