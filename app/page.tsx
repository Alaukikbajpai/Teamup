import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar />

      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center md:py-28">
        <Badge className="mb-6" variant="secondary">
          Sports matchmaking for real local games
        </Badge>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Find players. Join matches. Build your sports circle.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          TeamUp helps you discover local sports matches based on city, sport,
          skill level, availability, and open spots.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/onboarding">Create Profile</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/matches">Browse Matches</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Smart match discovery</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Find games by city, sport, skill level, time slot, and available spots.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Request to join</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Players can request to join open matches and organizers can approve them.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Live spot updates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Match cards update spots left using lightweight polling, no WebSockets needed.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}