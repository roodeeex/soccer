import Image from "next/image"
import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6">
      <div className="relative animate-fade-in">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg"
          alt="ENSAM Sports Logo"
          width={80}
          height={80}
          className="rounded-lg"
        />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
      <div className="space-y-2 animate-fade-in animation-delay-150">
        <h2 className="text-xl font-semibold text-center">Welcome to ENSAM Sports</h2>
        <p className="text-sm text-muted-foreground text-center">Setting up your dashboard...</p>
      </div>
    </div>
  )
}

