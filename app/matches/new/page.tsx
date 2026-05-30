"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function CreateMatchPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    sport: "Badminton",
    city: "Lucknow",
    area: "",
    venue: "",
    matchDateTime: "",
    timeSlot: "Evening",
    skillLevel: "Intermediate",
    playersNeeded: "4",
    description: "",
  })

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const savedProfile = localStorage.getItem("teamup_user_profile")

    if (!savedProfile) {
      alert("Please create your profile first.")
      router.push("/onboarding")
      return
    }

    const user = JSON.parse(savedProfile)
    const playersNeeded = Number(form.playersNeeded)

    const newMatch = {
      matchId: `match_${Date.now()}`,
      organizerId: user.userId,
      organizerName: user.name,
      sport: form.sport,
      city: form.city,
      area: form.area,
      venue: form.venue,
      matchDateTime: form.matchDateTime,
      timeSlot: form.timeSlot,
      skillLevel: form.skillLevel,
      playersNeeded,
      approvedPlayers: [],
      approvedPlayersCount: 0,
      spotsLeft: playersNeeded,
      status: "open",
      description: form.description,
      citySport: `${form.city}#${form.sport}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const existingMatches = JSON.parse(
      localStorage.getItem("teamup_local_matches") || "[]"
    )

    localStorage.setItem(
      "teamup_local_matches",
      JSON.stringify([newMatch, ...existingMatches])
    )

    router.push("/matches")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Step 3 of MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create a new match
          </h1>
          <p className="mt-3 text-slate-600">
            Add a local sports match with simple text fields. No maps needed for MVP.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Sport
                </label>
                <select
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>Badminton</option>
                  <option>Football</option>
                  <option>Cricket</option>
                  <option>Tennis</option>
                  <option>Basketball</option>
                  <option>Running</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  City
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>Lucknow</option>
                  <option>Delhi</option>
                  <option>Bangalore</option>
                  <option>Gurgaon</option>
                  <option>Noida</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Area
                </label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                  placeholder="Gomti Nagar"
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Venue
                </label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  placeholder="Smash Arena"
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Date and time
                </label>
                <input
                  name="matchDateTime"
                  type="datetime-local"
                  value={form.matchDateTime}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Time slot
                </label>
                <select
                  name="timeSlot"
                  value={form.timeSlot}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                  <option>Weekend</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Skill level
                </label>
                <select
                  name="skillLevel"
                  value={form.skillLevel}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Players needed
                </label>
                <input
                  name="playersNeeded"
                  type="number"
                  min="1"
                  max="20"
                  value={form.playersNeeded}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Looking for reliable players for a friendly game."
                rows={4}
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create Match
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}