"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BookingSummary } from "@/components/booking-summary"
import { LiveSession } from "@/components/live-session"
import { BookingFlow } from "@/components/booking-flow"
import { RankedPlayersDialog } from "@/components/ranked-players-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { startOfWeek, endOfWeek, format } from "date-fns"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isRankedPlayersOpen, setIsRankedPlayersOpen] = useState(false)
  const [players, setPlayers] = useState([])
  const [isLiveSession, setIsLiveSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          console.log("No authenticated user found or error occurred, redirecting to login page")
          console.error("Auth error:", error)
          router.push("/admin")
          return
        }

        setUser(user)

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*, players(*)")
          .order("date", { ascending: true })

        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError)
        } else {
          setBookings(bookingsData || [])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  useEffect(() => {
    const playerMap = new Map()
    bookings.forEach((booking) => {
      booking.players?.forEach((player) => {
        const playerName = player.name.toLowerCase().trim()
        if (playerMap.has(playerName)) {
          playerMap.set(playerName, playerMap.get(playerName) + 1)
        } else {
          playerMap.set(playerName, 1)
        }
      })
    })

    const playerArray = Array.from(playerMap, ([name, matchesPlayed]) => ({ name, matchesPlayed }))
    setPlayers(playerArray)

    // Check for live session
    const now = new Date()
    const liveBooking = bookings.find((booking) => {
      const bookingStart = new Date(`${booking.date}T${booking.time}`)
      const bookingEnd = new Date(bookingStart.getTime() + 60 * 60 * 1000) // Assuming 1 hour duration
      return now >= bookingStart && now < bookingEnd
    })
    setIsLiveSession(!!liveBooking)
  }, [bookings])

  // Group bookings by week
  const weeklyBookings = bookings.reduce((acc, booking) => {
    const bookingDate = new Date(booking.date)
    const weekStart = startOfWeek(bookingDate, { weekStartsOn: 1 })
    const weekKey = format(weekStart, "yyyy-MM-dd")

    if (!acc[weekKey]) {
      acc[weekKey] = []
    }
    acc[weekKey].push(booking)
    return acc
  }, {})

  // Create an array of week objects
  const weeks = Object.entries(weeklyBookings)
    .map(([weekStart, bookings]) => {
      const start = new Date(weekStart)
      const end = endOfWeek(start, { weekStartsOn: 1 })
      return {
        start,
        end,
        bookings,
      }
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader user={user} />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LiveSession isLive={isLiveSession} />
        <BookingSummary
          title="Total Bookings"
          value={bookings.length}
          onClick={() => console.log("Total Bookings clicked")}
        />
        <BookingSummary
          title="Today's Bookings"
          value={bookings.filter((b) => new Date(b.date).toDateString() === new Date().toDateString()).length}
          onClick={() => console.log("Today's Bookings clicked")}
        />
        <BookingSummary title="Total Players" value={players.length} onClick={() => setIsRankedPlayersOpen(true)} />
      </div>
      <div className="mt-4 sm:mt-6">
        <BookingFlow weeks={weeks} />
      </div>
      <RankedPlayersDialog
        isOpen={isRankedPlayersOpen}
        onClose={() => setIsRankedPlayersOpen(false)}
        players={players}
      />
    </DashboardShell>
  )
}

