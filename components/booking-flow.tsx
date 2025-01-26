"use client"

import { useState } from "react"
import { WeeksList } from "./weeks-list"
import { DaysList } from "./days-list"
import { TimesList } from "./times-list"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { differenceInWeeks, startOfWeek } from "date-fns"

interface Week {
  start: Date
  end: Date
  bookings: any[]
}

interface BookingFlowProps {
  weeks: Week[]
}

const pageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%",
  }),
  in: {
    opacity: 1,
    x: 0,
  },
  out: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? "100%" : "-100%",
  }),
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

const SEASON_START = new Date(2024, 8, 16) // September 16, 2024

export function BookingFlow({ weeks }: BookingFlowProps) {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setPage((prevPage) => prevPage + newDirection)
  }

  const resetSelection = () => {
    setSelectedWeek(null)
    setSelectedDay(null)
    setSelectedTime(null)
    setPage(0)
    setDirection(0)
  }

  const getWeekNumber = (date: Date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 })
    return differenceInWeeks(startOfWeekDate, SEASON_START) + 1
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {page === 0 && (
          <motion.div
            key="weeks"
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <WeeksList
              weeks={weeks}
              onSelectWeek={(week) => {
                setSelectedWeek(week)
                paginate(1)
              }}
              getWeekNumber={getWeekNumber}
            />
          </motion.div>
        )}
        {page === 1 && selectedWeek && (
          <motion.div
            key="days"
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <Button variant="ghost" onClick={() => paginate(-1)} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Weeks
            </Button>
            <DaysList
              weekStart={selectedWeek.start}
              bookings={selectedWeek.bookings}
              onSelectDay={(day) => {
                setSelectedDay(day)
                paginate(1)
              }}
            />
          </motion.div>
        )}
        {page === 2 && selectedWeek && selectedDay && (
          <motion.div
            key="times"
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            <Button variant="ghost" onClick={() => paginate(-1)} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Days
            </Button>
            <TimesList
              bookings={selectedWeek.bookings.filter(
                (b) => new Date(b.date).toDateString() === selectedDay.toDateString(),
              )}
              date={selectedDay}
              onSelectTime={setSelectedTime}
              selectedTime={selectedTime}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

