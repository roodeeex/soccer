"use server"

import { supabase } from "@/lib/supabase"

export async function deleteAllBookings() {
  try {
    // Delete all players first (due to foreign key constraint)
    const { error: playersError } = await supabase.from("players").delete().neq("id", 0)
    if (playersError) throw playersError

    // Then delete all bookings
    const { error: bookingsError } = await supabase.from("bookings").delete().neq("id", 0)
    if (bookingsError) throw bookingsError

    return { success: true, message: "All bookings have been deleted successfully." }
  } catch (error) {
    console.error("Error deleting all bookings:", error)
    return { success: false, message: "Failed to delete all bookings. Please try again." }
  }
}

export async function editBooking(
  bookingId: string,
  updatedData: { date?: string; time?: string; players?: { team: string; name: string }[] },
) {
  try {
    // Update booking
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({ date: updatedData.date, time: updatedData.time })
      .eq("id", bookingId)

    if (bookingError) throw bookingError

    // Update players
    if (updatedData.players) {
      // Delete existing players
      const { error: deletePlayersError } = await supabase.from("players").delete().eq("booking_id", bookingId)

      if (deletePlayersError) throw deletePlayersError

      // Insert new players
      const { error: insertPlayersError } = await supabase
        .from("players")
        .insert(updatedData.players.map((player) => ({ ...player, booking_id: bookingId })))

      if (insertPlayersError) throw insertPlayersError
    }

    return { success: true, message: "Booking has been updated successfully." }
  } catch (error) {
    console.error("Error updating booking:", error)
    return { success: false, message: "Failed to update booking. Please try again." }
  }
}

