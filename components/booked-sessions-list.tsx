import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface BookedSession {
  id: string
  date: string
  time: string
}

interface BookedSessionsListProps {
  sessions: BookedSession[]
  onSessionClick: (session: BookedSession) => void
}

export function BookedSessionsList({ sessions, onSessionClick }: BookedSessionsListProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">Booked Sessions</h2>
      {sessions.length > 0 ? (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Button
              key={session.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSessionClick(session)}
            >
              {format(new Date(session.date), "MMMM d, yyyy")} - {session.time}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No bookings available.</p>
      )}
    </div>
  )
}

