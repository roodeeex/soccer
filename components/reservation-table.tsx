"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { addDays, format, isBefore, startOfWeek, parseISO, set, differenceInWeeks, max } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ReservationDialog } from "./reservation-dialog"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { TableSkeleton } from "./table-skeleton"

const TIMES = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`)

const SEASON_START = new Date(2024, 8, 16) // September 16, 2024
const SEASON_END = new Date(2025, 5, 30) // June 30, 2025

interface Booking {
  id: string
  date: string
  time: string
}

type SlotStatus = "available" | "booked" | "unavailable"

export function ReservationTable() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date()
    return max([now, SEASON_START])
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [openDialog, setOpenDialog] = useState<{
    id: string | null
    formData: {
      playerNames: string[]
      duplicateError: string | null
    } | null
  }>({ id: null, formData: null })
  const [isAnyFormOpen, setIsAnyFormOpen] = useState(false)

  const getWeekNumber = useCallback((date: Date) => {
    const diffWeeks = differenceInWeeks(date, SEASON_START)
    return Math.max(0, diffWeeks) + 1
  }, [])

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), i))
  }, [currentWeek])

  const fetchBookings = useCallback(async () => {
    if (isAnyFormOpen) return // Don't fetch if a form is open

    setIsLoading(true)
    setError(null)

    const startDate = format(weekDates[0], "yyyy-MM-dd")
    const endDate = format(weekDates[6], "yyyy-MM-dd")

    try {
      console.log("Fetching bookings for date range:", { startDate, endDate })
      const { data, error } = await supabase.from("bookings").select("*").gte("date", startDate).lte("date", endDate)

      if (error) throw error

      console.log("Fetched bookings:", data)
      setBookings(data || [])
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Failed to fetch bookings. Please try again.")
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [weekDates, isAnyFormOpen])

  useEffect(() => {
    if (!isAnyFormOpen) {
      fetchBookings()

      const intervalId = setInterval(() => {
        fetchBookings()
      }, 30000)

      return () => clearInterval(intervalId)
    }
  }, [fetchBookings, isAnyFormOpen])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const getSlotStatus = useCallback(
    (date: Date, time: string): SlotStatus => {
      const formattedDate = format(date, "yyyy-MM-dd")
      const formattedTime = time.padStart(5, "0") + ":00"

      const slotDateTime = set(parseISO(formattedDate), {
        hours: Number.parseInt(time.split(":")[0], 10),
        minutes: Number.parseInt(time.split(":")[1], 10),
        seconds: 0,
        milliseconds: 0,
      })

      if (slotDateTime <= currentDateTime) {
        return "unavailable"
      }

      const isBooked = bookings.some((booking) => booking.date === formattedDate && booking.time === formattedTime)

      return isBooked ? "booked" : "available"
    },
    [bookings, currentDateTime],
  )

  const goToNextWeek = useCallback(() => {
    const nextWeek = addDays(currentWeek, 7)
    if (isBefore(nextWeek, SEASON_END)) {
      setCurrentWeek(nextWeek)
    }
  }, [currentWeek])

  const goToPreviousWeek = useCallback(() => {
    const previousWeek = addDays(currentWeek, -7)
    const currentRealWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
    if (!isBefore(previousWeek, currentRealWeek)) {
      setCurrentWeek(previousWeek)
    }
  }, [currentWeek])

  const handleBookingSuccess = useCallback((newBooking: Booking) => {
    setBookings((prevBookings) => {
      const bookingExists = prevBookings.some(
        (booking) => booking.date === newBooking.date && booking.time === newBooking.time,
      )

      if (!bookingExists) {
        return [...prevBookings, newBooking]
      }

      return prevBookings
    })
  }, [])

  const weekNumber = getWeekNumber(currentWeek)

  useEffect(() => {
    if (openDialog.id) {
      fetchBookings()
    }
  }, [openDialog.id, fetchBookings])

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchBookings}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-[1400px] mx-auto px-2 sm:px-0">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={goToPreviousWeek}
          disabled={isBefore(addDays(currentWeek, -7), startOfWeek(new Date(), { weekStartsOn: 1 }))}
          size="icon"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg sm:text-xl font-semibold flex items-center">
          <span>Week</span>
          <span className="ml-2">{weekNumber}</span>
        </h2>
        <Button
          onClick={goToNextWeek}
          disabled={!isBefore(currentWeek, SEASON_END)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="md:overflow-y-visible overflow-y-auto md:max-h-full max-h-[calc(100vh-300px)]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-30 bg-background">
                <tr>
                  <th className="sticky left-0 z-40 bg-background w-20 px-4 py-3 text-left text-sm font-semibold border-b">
                    Time
                  </th>
                  {weekDates.map((date) => (
                    <th
                      key={date.toISOString()}
                      className="px-4 py-3 text-left text-sm font-semibold border-b min-w-[100px] bg-background"
                    >
                      <div>{format(date, "EEE")}</div>
                      <div className="text-muted-foreground">{format(date, "d MMM")}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMES.map((time) => (
                  <tr key={time}>
                    <td className="sticky left-0 z-20 bg-background w-20 px-4 py-3 text-sm font-medium border-b">
                      {time}
                    </td>
                    {weekDates.map((date) => {
                      const status = getSlotStatus(date, time)
                      const dialogId = `${date.toISOString()}-${time}`
                      return (
                        <td key={dialogId} className="px-4 py-3 border-b min-w-[100px]">
                          <ReservationDialog
                            date={date}
                            time={time}
                            status={status}
                            onBookingSuccess={handleBookingSuccess}
                            isOpen={openDialog.id === dialogId}
                            onOpenChange={(open) => {
                              if (open) {
                                setOpenDialog({ id: dialogId, formData: null })
                                setIsAnyFormOpen(true)
                              } else {
                                setOpenDialog({ id: null, formData: openDialog.formData })
                                setIsAnyFormOpen(false)
                                fetchBookings() // Fetch bookings when the form is closed
                              }
                            }}
                            formData={openDialog.id === dialogId ? openDialog.formData : null}
                            onFormDataChange={(newFormData) => {
                              setOpenDialog((prev) => ({ ...prev, formData: newFormData }))
                            }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

