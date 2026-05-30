"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"

type UserProfile = {
  userId: string
  name: string
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

export default function RequestsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null)

  async function loadOrganizerData() {
    const savedProfile = localStorage.getItem("teamup_user_profile")

    if (!savedProfile) {
      setUser(null)
      setMatches([])
      setRequests([])
      setIsLoading(false)
      return
    }

    const profile = JSON.parse(savedProfile)
    setUser(profile)

    try {
      const matchesResponse = await fetch("/api/matches", {
        cache: "no-store",
      })

      if (!matchesResponse.ok) {
        throw new Error("Failed to fetch matches")
      }

      const matchesData = await matchesResponse.json()
      const allMatches: Match[] = matchesData.matches || []

      const organizerMatches = allMatches.filter(
        (match) => match.organizerId === profile.userId
      )

      setMatches(organizerMatches)

      const allRequests: JoinRequest[] = []

      for (const match of organizerMatches) {
        const requestResponse = await fetch(
          `/api/join-requests?matchId=${match.matchId}`,
          {
            cache: "no-store",
          }
        )

        if (requestResponse.ok) {
          const requestData = await requestResponse.json()
          allRequests.push(...(requestData.joinRequests || []))
        }
      }

      allRequests.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      })

      setRequests(allRequests)
    } catch (error) {
      console.error("Load organizer requests error:", error)
      alert("Could not load organizer requests.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrganizerData()
  }, [])

  function getMatch(matchId: string) {
    return matches.find((match) => match.matchId === matchId)
  }

  async function handleDecision(
    request: JoinRequest,
    decision: "approved" | "rejected"
  ) {
    if (!user) {
      alert("Please create your profile first.")
      return
    }

    try {
      setUpdatingRequestId(request.requestId)

      const response = await fetch(`/api/join-requests/${request.requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: decision,
          organizerId: user.userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update request")
      }

      await loadOrganizerData()

      alert(
        decision === "approved"
          ? "Request approved. Spots left updated."
          : "Request rejected."
      )
    } catch (error) {
      console.error("Update request error:", error)
      alert(
        error instanceof Error
          ? error.message
          : "Could not update request. Please try again."
      )
    } finally {
      setUpdatingRequestId(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            DynamoDB organizer queue
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Organizer requests
          </h1>

          <p className="mt-3 text-slate-600">
            Review join requests for matches you created. Approval updates match
            capacity and creates a notification.
          </p>
        </div>

        {!user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create your profile first to view organizer requests.
          </div>
        )}

        {user && isLoading && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Loading requests from DynamoDB...</p>
          </div>
        )}

        {user && !isLoading && matches.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              You have not created any matches yet
            </h2>
            <p className="mt-2 text-slate-600">
              Create a match first. Requests for your matches will appear here.
            </p>
          </div>
        )}

        {user && !isLoading && matches.length > 0 && requests.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              No requests yet
            </h2>
            <p className="mt-2 text-slate-600">
              When someone requests to join your match, it will appear here.
            </p>
          </div>
        )}

        {user && !isLoading && requests.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Requester</th>
                    <th className="px-4 py-3 font-semibold">Match</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                    <th className="px-4 py-3 font-semibold">Spots</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const match = getMatch(request.matchId)
                    const isUpdating = updatingRequestId === request.requestId

                    return (
                      <tr key={request.requestId} className="border-b">
                        <td className="px-4 py-4 font-medium text-slate-950">
                          {request.requesterName}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {match
                            ? `${match.sport} · ${match.city} · ${match.venue}`
                            : "Match not found"}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {request.message}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {match ? `${match.spotsLeft} left` : "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full border px-3 py-1 text-xs font-medium capitalize text-slate-700">
                            {request.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          {request.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleDecision(request, "approved")
                                }
                                className="rounded-md bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                              >
                                {isUpdating ? "Updating..." : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleDecision(request, "rejected")
                                }
                                className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}