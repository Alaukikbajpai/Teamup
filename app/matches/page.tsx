"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

type UserProfile = {
  userId: string
  name: string
  city: string
  preferredSports: string[]
  skillLevel: string
  availability: string
}

type Match = {
  matchId: string
  organizerId: string
  organizerName: string
  sport: string
  city: string
  area: string
  venue: string
  matchDateTime: string
  timeSlot: string
  skillLevel: string
  playersNeeded: number
  spotsLeft: number
  status: "open" | "full"
  description: string
}

const sampleMatches: Match[] = [
  {
    matchId: "match_1",
    organizerId: "organizer_1",
    organizerName: "Rohan",
    sport: "Badminton",
    city: "Lucknow",
    area: "Gomti Nagar",
    venue: "Smash Arena",
    matchDateTime: "2026-06-02T18:00:00",
    timeSlot: "Evening",
    skillLevel: "Intermediate",
    playersNeeded: 4,
    spotsLeft: 2,
    status: "open",
    description: "Casual doubles badminton game. Looking for reliable players.",
  },
  {
    matchId: "match_2",
    organizerId: "organizer_2",
    organizerName: "Aman",
    sport: "Football",
    city: "Delhi",
    area: "Saket",
    venue: "Turf 21",
    matchDateTime: "2026-06-03T20:00:00",
    timeSlot: "Night",
    skillLevel: "Beginner",
    playersNeeded: 10,
    spotsLeft: 4,
    status: "open",
    description: "Friendly 5v5 football match after work.",
  },
  {
    matchId: "match_3",
    organizerId: "organizer_3",
    organizerName: "Nisha",
    sport: "Tennis",
    city: "Bangalore",
    area: "Indiranagar",
    venue: "Club Court",
    matchDateTime: "2026-06-04T07:00:00",
    timeSlot: "Morning",
    skillLevel: "Advanced",
    playersNeeded: 2,
    spotsLeft: 1,
    status: "open",
    description: "Looking for one advanced tennis partner for practice.",
  },
]

function calculateCompatibility(user: UserProfile | null, match: Match) {
  if (!user) return 70

  let score = 0

  if (user.city === match.city) score += 30
  if (user.preferredSports.includes(match.sport)) score += 30
  if (user.skillLevel === match.skillLevel) score += 20
  if (user.availability === match.timeSlot) score += 10
  if (match.spotsLeft > 0) score += 10

  return score
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function MatchesPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<Match[]>(sampleMatches)

  useEffect(() => {
    const savedProfile = localStorage.getItem("teamup_user_profile")

    if (savedProfile) {
      setUser(JSON.parse(savedProfile))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((currentMatches) => [...currentMatches])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Step 2 of MVP</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Discover open matches
            </h1>
            <p className="mt-3 text-slate-600">
              Browse local games and see your smart compatibility score.
            </p>
          </div>

          <Link
            href="/matches/new"
            className="rounded-md bg-slate-950 px-5 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Match
          </Link>
        </div>

        {!user && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create your profile first to get accurate compatibility scores.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => {
            const compatibility = calculateCompatibility(user, match)

            return (
              <article
                key={match.matchId}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {match.city} · {match.area}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">
                      {match.sport}
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    {compatibility}% Match
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Venue:</span>{" "}
                    {match.venue}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Time:</span>{" "}
                    {formatDateTime(match.matchDateTime)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Skill:</span>{" "}
                    {match.skillLevel}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">
                      Organizer:
                    </span>{" "}
                    {match.organizerName}
                  </p>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  {match.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full border px-3 py-1 text-sm font-medium text-slate-700">
                    {match.spotsLeft} spots left
                  </span>

                  <button
                    type="button"
                    className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    disabled={match.spotsLeft === 0}
                    onClick={() => alert("Request flow will be connected next.")}
                  >
                    Request to Join
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}