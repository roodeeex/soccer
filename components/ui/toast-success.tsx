import { CheckCircle } from "lucide-react"
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast"

interface ToastSuccessProps {
  title: string
  description: string
}

export function ToastSuccess({ title, description }: ToastSuccessProps) {
  return (
    <Toast>
      <div className="flex items-start gap-4">
        <CheckCircle className="h-6 w-6 text-green-500" />
        <div className="grid gap-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </div>
      </div>
    </Toast>
  )
}

