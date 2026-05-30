import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          TeamUp
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/matches" className="text-muted-foreground hover:text-foreground">
            Matches
          </Link>
          <Link href="/matches/new" className="text-muted-foreground hover:text-foreground">
            Create Match
          </Link>
          <Link href="/requests" className="text-muted-foreground hover:text-foreground">
            Requests
          </Link>
          <Link href="/notifications" className="text-muted-foreground hover:text-foreground">
            Notifications
          </Link>
        </nav>

        <Button asChild>
          <Link href="/onboarding">Get Started</Link>
        </Button>
      </div>
    </header>
  )
}