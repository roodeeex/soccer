export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</div>
}

