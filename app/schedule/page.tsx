import { ReservationTable } from "@/components/reservation-table"
import { TableSkeleton } from "@/components/table-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

export default function SchedulePage() {
  return (
    <div className="container flex justify-center py-6 md:py-10">
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Field Availability</h1>
            <p className="text-lg text-muted-foreground">Book your preferred time slot for futsal matches</p>
          </div>
          <div className="w-full">
            <ErrorBoundary>
              <Suspense fallback={<TableSkeleton />}>
                <ReservationTable />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

