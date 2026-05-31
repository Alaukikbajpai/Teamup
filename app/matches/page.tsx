"use client"

import { useEffect, useMemo, useState } from "react"
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
  approvedPlayers?: string[]
  approvedPlayersCount?: number
  spotsLeft: number
  status: "open" | "full"
  description: string
  citySport?: string
  createdAt?: string
  updatedAt?: string
}

type JoinRequest = {
  requestId: string
  matchId: string
  requesterId: string
  requesterName: string
  organizerId: string
  message: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

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
  if (!value) return "Date not set"

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function MatchesPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestingMatchId, setRequestingMatchId] = useState<string | null>(null)

  const [cityFilter, setCityFilter] = useState("All")
  const [sportFilter, setSportFilter] = useState("All")
  const [areaFilter, setAreaFilter] = useState("")

  async function fetchMatches() {
    try {
      const response = await fetch("/api/matches", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch matches")
      }

      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error("Fetch matches error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUserAndRequests() {
    const savedProfile = localStorage.getItem("teamup_user_profile")

    if (!savedProfile) {
      setUser(null)
      setRequests([])
      return
    }

    const profile = JSON.parse(savedProfile)
    setUser(profile)

    try {
      const response = await fetch(
        `/api/join-requests?requesterId=${profile.userId}`,
        {
          cache: "no-store",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch join requests")
      }

      const data = await response.json()
      setRequests(data.joinRequests || [])
    } catch (error) {
      console.error("Fetch user join requests error:", error)
    }
  }

  useEffect(() => {
    loadUserAndRequests()
    fetchMatches()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMatches()
      loadUserAndRequests()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const cityMatches = cityFilter === "All" || match.city === cityFilter
      const sportMatches = sportFilter === "All" || match.sport === sportFilter
      const areaMatches =
        areaFilter.trim() === "" ||
        match.area.toLowerCase().includes(areaFilter.toLowerCase()) ||
        match.venue.toLowerCase().includes(areaFilter.toLowerCase())

      return cityMatches && sportMatches && areaMatches
    })
  }, [matches, cityFilter, sportFilter, areaFilter])

  async function handleRequestToJoin(match: Match) {
    if (!user) {
      alert("Please create your profile first.")
      return
    }

    if (user.userId === match.organizerId) {
      alert("You cannot request to join your own match.")
      return
    }

    const alreadyRequested = requests.some(
      (request) =>
        request.matchId === match.matchId && request.requesterId === user.userId
    )

    if (alreadyRequested) {
      alert("You have already requested to join this match.")
      return
    }

    const newRequest = {
      requestId: `request_${Date.now()}`,
      matchId: match.matchId,
      requesterId: user.userId,
      requesterName: user.name,
      organizerId: match.organizerId,
      message: `Hi, I would like to join this ${match.sport} match.`,
    }

    try {
      setRequestingMatchId(match.matchId)

      const response = await fetch("/api/join-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      const data = await response.json()

      setRequests((currentRequests) => [
        data.joinRequest,
        ...currentRequests,
      ])

      alert("Request sent to organizer.")
    } catch (error) {
      console.error("Join request error:", error)
      alert("Could not send join request. Please check DynamoDB setup.")
    } finally {
      setRequestingMatchId(null)
    }
  }

  function getRequestStatus(matchId: string) {
    if (!user) return null

    const request = requests.find(
      (item) => item.matchId === matchId && item.requesterId === user.userId
    )

    return request?.status || null
  }

  function clearFilters() {
    setCityFilter("All")
    setSportFilter("All")
    setAreaFilter("")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Live DynamoDB feed
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Discover open matches
            </h1>

            <p className="mt-3 text-slate-600">
              Filter by city, area, and sport. This page refreshes every 5
              seconds.
            </p>
          </div>

          <Link
            href="/matches/new"
            className="rounded-md bg-slate-950 px-5 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Match
          </Link>
        </div>

        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Location filters
              </h2>
              <p className="text-sm text-slate-600">
                Search matches by city, area, venue, or sport.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">City</label>
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
                className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option>All</option>
                <option>Lucknow</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Gurgaon</option>
                <option>Noida</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Sport
              </label>
              <select
                value={sportFilter}
                onChange={(event) => setSportFilter(event.target.value)}
                className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              >
                <option>All</option>
                <option>Badminton</option>
                <option>Football</option>
                <option>Cricket</option>
                <option>Tennis</option>
                <option>Basketball</option>
                <option>Running</option>
                <option>Pickleball</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Area or venue
              </label>
              <input
                value={areaFilter}
                onChange={(event) => setAreaFilter(event.target.value)}
                placeholder="Search Gomti Nagar, Indiranagar..."
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        {!user && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create your profile first to get accurate compatibility scores and
            request to join matches.
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Loading matches from DynamoDB...</p>
          </div>
        )}

        {!isLoading && matches.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              No matches yet
            </h2>

            <p className="mt-2 text-slate-600">
              Create your first match to see it here.
            </p>

            <Link
              href="/matches/new"
              className="mt-5 inline-block rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create Match
            </Link>
          </div>
        )}

        {!isLoading && matches.length > 0 && filteredMatches.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              No matches found
            </h2>

            <p className="mt-2 text-slate-600">
              Try changing your city, sport, or area filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!isLoading && filteredMatches.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing {filteredMatches.length} of {matches.length} matches
            </p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => {
                const compatibility = calculateCompatibility(user, match)
                const requestStatus = getRequestStatus(match.matchId)
                const isOwnMatch = user?.userId === match.organizerId
                const isRequesting = requestingMatchId === match.matchId

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
                        <span className="font-medium text-slate-900">
                          Venue:
                        </span>{" "}
                        {match.venue}
                      </p>

                      <p>
                        <span className="font-medium text-slate-900">
                          Time:
                        </span>{" "}
                        {formatDateTime(match.matchDateTime)}
                      </p>

                      <p>
                        <span className="font-medium text-slate-900">
                          Skill:
                        </span>{" "}
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

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="rounded-full border px-3 py-1 text-sm font-medium text-slate-700">
                        {match.spotsLeft} spots left
                      </span>

                      {isOwnMatch ? (
                        <span className="rounded-md border px-4 py-2 text-sm font-medium text-slate-700">
                          Your match
                        </span>
                      ) : requestStatus ? (
                        <span className="rounded-md border px-4 py-2 text-sm font-medium capitalize text-slate-700">
                          {requestStatus}
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          disabled={match.spotsLeft === 0 || isRequesting}
                          onClick={() => handleRequestToJoin(match)}
                        >
                          {isRequesting ? "Sending..." : "Request to Join"}
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </section>
    </main>
  )
}