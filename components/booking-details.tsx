"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editBooking } from "@/app/admin/actions"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface BookingDetailsProps {
  session: {
    id: string
    date: string
    time: string
  }
  onBookingUpdated: () => void
}

interface Player {
  name: string
  team: "A" | "B"
}

export function BookingDetails({ session, onBookingUpdated }: BookingDetailsProps) {
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDate, setEditedDate] = useState("")
  const [editedTime, setEditedTime] = useState("")
  const [editedPlayers, setEditedPlayers] = useState<Player[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchBookingDetails()
  }, []) // Removed unnecessary session dependency

  const fetchBookingDetails = async () => {
    const { data, error } = await supabase.from("bookings").select("*, players(*)").eq("id", session.id).single()

    if (error) {
      console.error("Error fetching booking details:", error)
    } else {
      setBookingDetails(data)
      setEditedDate(data.date)
      setEditedTime(data.time)
      // Sort players by team to ensure consistent order
      const sortedPlayers = [...data.players].sort((a, b) => {
        if (a.team === b.team) return 0
        return a.team === "A" ? -1 : 1
      })
      setEditedPlayers(sortedPlayers)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedDate(bookingDetails.date)
    setEditedTime(bookingDetails.time)
    const sortedPlayers = [...bookingDetails.players].sort((a, b) => {
      if (a.team === b.team) return 0
      return a.team === "A" ? -1 : 1
    })
    setEditedPlayers(sortedPlayers)
  }

  const handleSave = async () => {
    const result = await editBooking(session.id, {
      date: editedDate,
      time: editedTime,
      players: editedPlayers,
    })

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      setIsEditing(false)
      fetchBookingDetails()
      onBookingUpdated()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handlePlayerNameChange = (index: number, value: string) => {
    const updatedPlayers = [...editedPlayers]
    updatedPlayers[index] = { ...updatedPlayers[index], name: value }
    setEditedPlayers(updatedPlayers)
  }

  if (!bookingDetails) {
    return <div>Loading booking details...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            {isEditing ? (
              <Input id="date" type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
            ) : (
              <p>{format(new Date(bookingDetails.date), "MMMM d, yyyy")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            {isEditing ? (
              <Input id="time" type="time" value={editedTime} onChange={(e) => setEditedTime(e.target.value)} />
            ) : (
              <p>{bookingDetails.time}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Players</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Team A</h4>
                  <div className="space-y-2">
                    {editedPlayers.slice(0, 5).map((player, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={player.name}
                          onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          placeholder={`Player ${index + 1} name`}
                        />
                        <div className="w-24 px-3 py-2 border rounded-md bg-muted">Team A</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Team B</h4>
                  <div className="space-y-2">
                    {editedPlayers.slice(5, 10).map((player, index) => (
                      <div key={index + 5} className="flex items-center gap-2">
                        <Input
                          value={player.name}
                          onChange={(e) => handlePlayerNameChange(index + 5, e.target.value)}
                          placeholder={`Player ${index + 1} name`}
                        />
                        <div className="w-24 px-3 py-2 border rounded-md bg-muted">Team B</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Team A</h4>
                  <ul className="mt-2 space-y-1">
                    {bookingDetails.players
                      .filter((player: any) => player.team === "A")
                      .map((player: any, index: number) => (
                        <li key={index} className="text-sm">
                          {player.name}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Team B</h4>
                  <ul className="mt-2 space-y-1">
                    {bookingDetails.players
                      .filter((player: any) => player.team === "B")
                      .map((player: any, index: number) => (
                        <li key={index} className="text-sm">
                          {player.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

