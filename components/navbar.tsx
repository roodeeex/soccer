"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg"
            alt="ENSAM Sports Logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="text-xl font-bold">ENSAM Sports</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/schedule" className="text-sm font-medium hover:text-primary">
            Reserve
          </Link>
          {pathname !== "/admin/dashboard" && (
            <Link href="/admin">
              <Button variant="outline">Admin Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

