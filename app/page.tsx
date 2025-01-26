import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Users, Clock } from "lucide-react"

export default function Home() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/385705239_228704243218989_8965674797106600238_n.jpg-dEQJ8LId9RuPn4E5OtecjVkUbStD9V.jpeg"
            alt="ENSAM Sports Logo"
            width={150}
            height={150}
            className="rounded-lg"
          />
          <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Book Your Next <span className="text-primary">Futsal Match</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Reserve our futsal field for your team. Challenge your friends and enjoy the game at ENSAM Sports Club.
          </p>
          <div className="space-x-4">
            <Link href="/schedule">
              <Button size="lg" className="bg-primary">
                Book Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to organize your futsal matches.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <feature.icon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const features = [
  {
    title: "Easy Booking",
    description: "Book your preferred time slot in just a few clicks.",
    icon: Calendar,
  },
  {
    title: "Team Management",
    description: "Organize your team and manage your matches efficiently.",
    icon: Users,
  },
  {
    title: "Real-time Availability",
    description: "Check field availability in real-time and plan accordingly.",
    icon: Clock,
  },
]

