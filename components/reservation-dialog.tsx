"use client"

import { useState, useEffect, useRef, type ChangeEvent, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  date: string
  time: string
}

interface ReservationDialogProps {
  date: Date
  time: string
  status: "available" | "booked" | "unavailable"
  onBookingSuccess: (newBooking: Booking) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formData: {
    playerNames: string[]
    duplicateError: string | null
  } | null
  onFormDataChange: (formData: {
    playerNames: string[]
    duplicateError: string | null
  }) => void
}

export function ReservationDialog({
  date,
  time,
  status,
  onBookingSuccess,
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
}: ReservationDialogProps) {
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localFormData, setLocalFormData] = useState<{
    playerNames: string[]
    duplicateError: string | null
  }>({
    playerNames: Array(10).fill(""),
    duplicateError: null,
  })
  const { playerNames, duplicateError } = formData || localFormData
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const resetForm = useCallback(() => {
    setLocalFormData({
      playerNames: Array(10).fill(""),
      duplicateError: null,
    })
    setIsBookingSuccessful(false)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (formData) {
      setLocalFormData(formData)
    }
  }, [formData])

  useEffect(() => {
    if (isBookingSuccessful) {
      const timer = setTimeout(() => {
        onOpenChange(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isBookingSuccessful, onOpenChange])

  const checkDuplicates = useCallback((names: string[]) => {
    const lowercaseNames = names.map((name) => name.toLowerCase().trim()).filter(Boolean)
    const duplicates = lowercaseNames.filter((name, index) => lowercaseNames.indexOf(name) !== index)
    return duplicates.length > 0 ? duplicates[0] : null
  }, [])

  const handlePlayerNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newNames = [...playerNames]
      const index = Number.parseInt(e.target.name.slice(-1)) - 1 + (e.target.name.startsWith("teamB") ? 5 : 0)
      newNames[index] = e.target.value
      const duplicate = checkDuplicates(newNames)
      const newFormData = {
        playerNames: newNames,
        duplicateError: duplicate ? `Duplicate player name: ${duplicate}` : null,
      }
      setLocalFormData(newFormData)
      onFormDataChange(newFormData)
    },
    [playerNames, checkDuplicates, onFormDataChange],
  )

  const handleReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const allPlayerNames = playerNames.filter(Boolean)
    const duplicate = checkDuplicates(allPlayerNames)
    if (duplicate) {
      toast({
        title: "Booking Failed",
        description: `Duplicate player name found: ${duplicate}. Please ensure all player names are unique.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data: existingBooking, error: checkError } = await supabase
        .from("bookings")
        .select()
        .eq("date", format(date, "yyyy-MM-dd"))
        .eq("time", time.padStart(5, "0") + ":00")
        .maybeSingle()

      if (checkError) throw checkError

      if (existingBooking) {
        onBookingSuccess(existingBooking)
        toast({
          title: "Session Already Booked",
          description: "This session has already been booked. The schedule has been updated.",
          duration: 5000,
        })
        onOpenChange(false)
        return
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          date: format(date, "yyyy-MM-dd"),
          time: time.padStart(5, "0") + ":00",
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      if (!bookingData) {
        throw new Error("No booking data returned")
      }

      const bookingId = bookingData.id

      const playersData = playerNames
        .map((name, index) => ({
          booking_id: bookingId,
          team: index < 5 ? "A" : "B",
          name,
        }))
        .filter((player) => player.name)

      const { error: playersError } = await supabase.from("players").insert(playersData)

      if (playersError) throw playersError

      const newBooking: Booking = {
        id: bookingId,
        date: format(date, "yyyy-MM-dd"),
        time: time.padStart(5, "0") + ":00",
      }

      onBookingSuccess(newBooking)
      setIsBookingSuccessful(true)

      toast({
        title: "Booking Confirmed",
        description: "Your futsal session has been booked successfully!",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error saving booking:", error)
      let errorMessage = "There was an error while booking your session. Please try again."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonStyle = () => {
    switch (status) {
      case "available":
        return "hover:bg-green-500 hover:text-white bg-green-100 text-green-700"
      case "booked":
        return "bg-red-100 text-red-700 opacity-50 cursor-not-allowed"
      case "unavailable":
        return "bg-gray-100 text-gray-700 opacity-50 cursor-not-allowed"
    }
  }

  const getButtonText = () => {
    switch (status) {
      case "available":
        return "Available"
      case "booked":
        return "Booked"
      case "unavailable":
        return "Unavailable"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-full ${getButtonStyle()}`} disabled={status !== "available"}>
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-0 rounded-xl",
          "data-[state=open]:animate-none",
          "data-[state=closed]:animate-none",
        )}
      >
        <DialogHeader>
          <DialogTitle className="pt-4">
            Book Field - {format(date, "EEEE, MMMM d, yyyy")} at {time.slice(0, 5)}
          </DialogTitle>
        </DialogHeader>
        {isBookingSuccessful ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground">
              Your futsal session has been successfully booked for {format(date, "EEEE, MMMM d, yyyy")} at{" "}
              {time.slice(0, 5)}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReservation} ref={formRef} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="teamA1">Your Team Players (5)</Label>
                {Array.from({ length: 5 }, (_, i) => (
                  <Input
                    key={`teamA${i + 1}`}
                    id={`teamA${i + 1}`}
                    name={`teamA${i + 1}`}
                    placeholder={`Player ${i + 1} name`}
                    required
                    value={playerNames[i]}
                    onChange={handlePlayerNameChange}
                  />
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teamB1">Opponent Team Players (5)</Label>
                {Array.from({ length: 5 }, (_, i) => (
                  <Input
                    key={`teamB${i + 1}`}
                    id={`teamB${i + 1}`}
                    name={`teamB${i + 1}`}
                    placeholder={`Player ${i + 1} name`}
                    required
                    value={playerNames[i + 5]}
                    onChange={handlePlayerNameChange}
                  />
                ))}
              </div>
            </div>
            {duplicateError && <p className="text-red-500 text-sm mt-2">{duplicateError}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

