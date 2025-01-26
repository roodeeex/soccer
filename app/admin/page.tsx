"use client"

import { useState } from "react"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError(null)

    try {
      const result = await signIn(formData)

      if ("error" in result) {
        console.error("Sign-in error:", result.error)
        setError(result.error)
      } else if (result.success) {
        console.log("Sign-in successful, redirecting to dashboard")
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-[350px] space-y-3">
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the admin panel</p>
        </div>
        <form action={handleSubmit} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <SubmitButton />
        </form>
      </div>
    </main>
  )
}

