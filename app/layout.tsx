import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ENSAM Sports - Futsal Reservation",
  description: "Book your futsal field at ENSAM Sports Club",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg",
        href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {children}
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}

