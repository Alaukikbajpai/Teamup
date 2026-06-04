import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 font-sans text-white">
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-4 py-8 sm:py-14 md:grid md:min-h-[calc(100vh-4rem)] md:grid-cols-2 md:items-center md:gap-12 md:py-20">
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-10 right-[-120px] h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur">
            Local sports matchmaking
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Find players near you and join real games.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            TeamUp helps you discover local sports matches, request to join open
            games, and get approved by organizers with live spot updates.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              href="/onboarding"
              className="flex-1 rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 hover:bg-slate-100 sm:flex-none"
            >
              Create Profile
            </Link>

            <Link
              href="/matches"
              className="flex-1 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white backdrop-blur hover:bg-white/15 sm:flex-none"
            >
              Browse
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Badminton", "Football", "Cricket", "Tennis", "Pickleball"].map(
              (sport) => (
                <span
                  key={sport}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
                >
                  {sport}
                </span>
              )
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-lg font-bold">5s</p>
              <p className="text-[11px] text-slate-300">polling</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-lg font-bold">100%</p>
              <p className="text-[11px] text-slate-300">match score</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-lg font-bold">AWS</p>
              <p className="text-[11px] text-slate-300">DynamoDB</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 md:mt-0">
          <div className="mx-auto max-w-sm rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-2xl bg-white p-4 text-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Open match
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Badminton</h2>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  100% Match
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">City</p>
                  <p className="font-semibold">Lucknow</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Area</p>
                  <p className="font-semibold">Gomti Nagar</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Skill</p>
                  <p className="font-semibold">Intermediate</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="font-semibold">Evening</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full border px-3 py-1 text-xs font-semibold">
                  2 spots left
                </span>

                <button className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              From profile to approved match in minutes.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              ["1", "Create profile", "Add city, sport, skill, and availability."],
              ["2", "Find matches", "Filter by city, area, sport, and spots."],
              ["3", "Request to join", "Send a join request to the organizer."],
              ["4", "Get approved", "Spots update and notifications appear."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-2xl border bg-slate-50 p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                  {number}
                </div>

                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}