"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CalendarDays, Clock, Users, Shield } from "lucide-react"

interface TimesListProps {
  bookings: any[]
  date: Date
  onSelectTime: (time: string) => void
  selectedTime: string | null
}

const TIMES = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`)

export function TimesList({ bookings, date, onSelectTime, selectedTime }: TimesListProps) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select a Time</h2>
      <div className="space-y-2">
        {TIMES.map((time) => {
          const booking = bookings.find((b) => b.time === `${time}:00`)
          return (
            <div key={time} className="flex flex-col">
              <Button
                variant={selectedTime === time ? "default" : "outline"}
                className="w-full justify-between h-auto py-3 px-4"
                onClick={() => {
                  if (booking) {
                    setSelectedBooking(booking)
                  } else {
                    onSelectTime(time)
                  }
                }}
              >
                <span className="text-lg">{format(new Date(`2000-01-01 ${time}`), "h:mm a")}</span>
                {booking ? <Badge variant="success">Booked</Badge> : <Badge variant="destructive">Unbooked</Badge>}
              </Button>
            </div>
          )
        })}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="p-0 bg-white border-none shadow-xl rounded-xl overflow-hidden data-[state=open]:duration-0 data-[state=closed]:duration-0">
          {selectedBooking && (
            <div>
              {/* Header Section */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{format(date, "MMMM d, yyyy")}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{format(new Date(`2000-01-01 ${selectedBooking.time}`), "h:mm a")}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Match Details</h2>
              </div>

              {/* Teams Section */}
              <div className="grid grid-cols-2 gap-px bg-gray-100">
                {/* Team A */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">Team A</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedBooking.players
                      .filter((player: any) => player.team === "A")
                      .map((player: any) => (
                        <div
                          key={player.id}
                          className="bg-gray-50 rounded-lg p-3 transition-transform hover:scale-[1.02] border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{player.name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Team B */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900">Team B</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedBooking.players
                      .filter((player: any) => player.team === "B")
                      .map((player: any) => (
                        <div
                          key={player.id}
                          className="bg-gray-50 rounded-lg p-3 transition-transform hover:scale-[1.02] border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{player.name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Players: {selectedBooking.players.length}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

