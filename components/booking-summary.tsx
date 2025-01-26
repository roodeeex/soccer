import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BookingSummaryProps {
  title: string
  value: number
  onClick?: () => void
}

export function BookingSummary({ title, value, onClick }: BookingSummaryProps) {
  return (
    <Card
      className={`transition-all duration-200 ${onClick ? "hover:shadow-md cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

