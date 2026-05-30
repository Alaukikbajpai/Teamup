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

type Notification = {
  notificationId: string
  userId: string
  type: "request_approved" | "request_rejected"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function RequestsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [matches, setMatches] = useState<Match[]>([])

  function loadData() {
    const savedProfile = localStorage.getItem("teamup_user_profile")
    const savedRequests = localStorage.getItem("teamup_join_requests")
    const savedMatches = localStorage.getItem("teamup_local_matches")

    if (savedProfile) {
      setUser(JSON.parse(savedProfile))
    }

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }

    if (savedMatches) {
      setMatches(JSON.parse(savedMatches))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function getMatch(matchId: string) {
    return matches.find((match) => match.matchId === matchId)
  }

  function handleDecision(
    request: JoinRequest,
    decision: "approved" | "rejected"
  ) {
    const now = new Date().toISOString()

    const existingRequests: JoinRequest[] = JSON.parse(
      localStorage.getItem("teamup_join_requests") || "[]"
    )

    const existingMatches: Match[] = JSON.parse(
      localStorage.getItem("teamup_local_matches") || "[]"
    )

    const existingNotifications: Notification[] = JSON.parse(
      localStorage.getItem("teamup_notifications") || "[]"
    )

    const updatedRequests = existingRequests.map((item) =>
      item.requestId === request.requestId
        ? {
            ...item,
            status: decision,
            updatedAt: now,
          }
        : item
    )

    let updatedMatches = existingMatches

    if (decision === "approved") {
      updatedMatches = existingMatches.map((match) => {
        if (match.matchId !== request.matchId) return match

        const currentSpotsLeft = Math.max(match.spotsLeft - 1, 0)
        const approvedPlayers = match.approvedPlayers || []

        return {
          ...match,
          approvedPlayers: [...approvedPlayers, request.requesterId],
          approvedPlayersCount: (match.approvedPlayersCount || 0) + 1,
          spotsLeft: currentSpotsLeft,
          status: currentSpotsLeft === 0 ? "full" : "open",
          updatedAt: now,
        }
      })
    }

    const relatedMatch = existingMatches.find(
      (match) => match.matchId === request.matchId
    )

    const newNotification: Notification = {
      notificationId: `notification_${Date.now()}`,
      userId: request.requesterId,
      type: decision === "approved" ? "request_approved" : "request_rejected",
      title:
        decision === "approved"
          ? "Your request was approved"
          : "Your request was rejected",
      message:
        decision === "approved"
          ? `You have been approved to join ${relatedMatch?.sport || "the match"}.`
          : `Your request to join ${relatedMatch?.sport || "the match"} was rejected.`,
      read: false,
      createdAt: now,
    }

    const updatedNotifications = [newNotification, ...existingNotifications]

    localStorage.setItem("teamup_join_requests", JSON.stringify(updatedRequests))
    localStorage.setItem("teamup_local_matches", JSON.stringify(updatedMatches))
    localStorage.setItem(
      "teamup_notifications",
      JSON.stringify(updatedNotifications)
    )

    setRequests(updatedRequests)
    setMatches(updatedMatches)
  }

  const organizerRequests = user
    ? requests.filter((request) => request.organizerId === user.userId)
    : []

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Step 4 of MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Organizer requests
          </h1>
          <p className="mt-3 text-slate-600">
            Review join requests for matches you created.
          </p>
        </div>

        {!user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create your profile first to view organizer requests.
          </div>
        )}

        {user && organizerRequests.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              No requests yet
            </h2>
            <p className="mt-2 text-slate-600">
              When someone requests to join your match, it will appear here.
            </p>
          </div>
        )}

        {organizerRequests.length > 0 && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Requester</th>
                    <th className="px-4 py-3 font-semibold">Match</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {organizerRequests.map((request) => {
                    const match = getMatch(request.matchId)

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
                                onClick={() =>
                                  handleDecision(request, "approved")
                                }
                                className="rounded-md bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDecision(request, "rejected")
                                }
                                className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
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