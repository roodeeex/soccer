"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Player {
  id: string
  name: string
  team: "A" | "B"
  booking_id: string
}

interface Booking {
  id: string
  date: string
  time: string
  players: Player[]
}

interface BookingsListProps {
  bookings: Booking[]
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Booked Sessions</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const sessionDateTime = new Date(`${booking.date} ${booking.time}`)
                const isActive = sessionDateTime > new Date()

                return (
                  <TableRow key={booking.id}>
                    <TableCell>{format(new Date(booking.date), "MMMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(`2000-01-01 ${booking.time}`), "h:mm a")}</TableCell>
                    <TableCell>{booking.players?.length || 0} players</TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "success" : "secondary"}>{isActive ? "Active" : "Completed"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Users className="h-4 w-4" />
                        <span className="sr-only">View Players</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[425px] data-[state=open]:duration-0 data-[state=closed]:duration-0">
          {selectedBooking && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Booking Details</h2>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(selectedBooking.date), "MMMM d, yyyy")}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{format(new Date(`2000-01-01 ${selectedBooking.time}`), "h:mm a")}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>Team A</span>
                    </h3>
                    <ul className="space-y-1">
                      {selectedBooking.players
                        .filter((player) => player.team === "A")
                        .map((player) => (
                          <li key={player.id} className="text-sm pl-6">
                            {player.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <User className="h-4 w-4 text-red-500" />
                      <span>Team B</span>
                    </h3>
                    <ul className="space-y-1">
                      {selectedBooking.players
                        .filter((player) => player.team === "B")
                        .map((player) => (
                          <li key={player.id} className="text-sm pl-6">
                            {player.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Players: {selectedBooking.players.length}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

