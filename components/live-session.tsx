import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LiveSessionProps {
  isLive: boolean
}

export function LiveSession({ isLive }: LiveSessionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live Session</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-2">
        <div className={cn("w-3 h-3 rounded-full", isLive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
        <span className="text-sm font-medium">{isLive ? "Match in progress" : "No live match"}</span>
      </CardContent>
    </Card>
  )
}

