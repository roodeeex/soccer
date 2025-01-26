import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4 animate-in fade-in-50">
      <div className="flex items-center justify-center mb-6">
        <Skeleton className="h-8 w-8" />
        <div className="mx-4">
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-20 px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
                {Array.from({ length: 7 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 min-w-[140px]">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 14 }).map((_, row) => (
                <tr key={row}>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  {Array.from({ length: 7 }).map((_, col) => (
                    <td key={col} className="px-4 py-3">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

