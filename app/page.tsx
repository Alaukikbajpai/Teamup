import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-[-120px] h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur">
            Sports matchmaking powered by DynamoDB
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Find your next game, not just a venue.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            TeamUp helps players discover local sports matches, request to join
            open games, and get approved by organizers in real time.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 hover:bg-slate-100"
            >
              Create Profile
            </Link>

            <Link
              href="/matches"
              className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
            >
              Browse Matches
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">5s</p>
              <p className="mt-1 text-xs text-slate-300">live feed polling</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">100%</p>
              <p className="mt-1 text-xs text-slate-300">match score</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">AWS</p>
              <p className="mt-1 text-xs text-slate-300">DynamoDB backend</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Live Match Card
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">Badminton</h2>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  100% Match
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">City</p>
                    <p className="font-semibold">Lucknow</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Area</p>
                    <p className="font-semibold">Gomti Nagar</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Skill</p>
                    <p className="font-semibold">Intermediate</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Time</p>
                    <p className="font-semibold">Evening</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full border px-3 py-1 text-sm font-semibold">
                  2 spots left
                </span>

                <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                  Request to Join
                </button>
              </div>
            </div>

            <div className="absolute -right-6 -top-6 rounded-2xl border border-white/10 bg-white/15 p-4 text-white shadow-xl backdrop-blur">
              <p className="text-xs text-slate-200">Organizer action</p>
              <p className="mt-1 text-sm font-bold">Approve request</p>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-white/15 p-4 text-white shadow-xl backdrop-blur">
              <p className="text-xs text-slate-200">Notification</p>
              <p className="mt-1 text-sm font-bold">Request approved</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              How TeamUp works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              A complete sports matchmaking flow
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl border bg-slate-50 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                1
              </div>
              <h3 className="font-bold">Create profile</h3>
              <p className="mt-2 text-sm text-slate-600">
                Add city, area, sport, skill level, and availability.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                2
              </div>
              <h3 className="font-bold">Discover matches</h3>
              <p className="mt-2 text-sm text-slate-600">
                Filter by city, sport, area, and open spots.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                3
              </div>
              <h3 className="font-bold">Request to join</h3>
              <p className="mt-2 text-sm text-slate-600">
                Players request access to organizer-created games.
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                4
              </div>
              <h3 className="font-bold">Approve and notify</h3>
              <p className="mt-2 text-sm text-slate-600">
                Spots update live and the player receives a notification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}