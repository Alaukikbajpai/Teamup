"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function OnboardingPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "Lucknow",
    area: "",
    preferredSport: "Badminton",
    skillLevel: "Intermediate",
    availability: "Evening",
  })

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const userId = `user_${Date.now()}`

    const userProfile = {
      userId,
      name: form.name,
      email: form.email,
      city: form.city,
      area: form.area,
      preferredSports: [form.preferredSport],
      skillLevel: form.skillLevel,
      availability: form.availability,
      rating: 4.8,
      matchesPlayed: 0,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("teamup_user_id", userId)
    localStorage.setItem("teamup_user_profile", JSON.stringify(userProfile))

    router.push("/matches")
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Step 1 of MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create your sports profile
          </h1>
          <p className="mt-3 text-slate-600">
            This profile helps TeamUp show better local sports matches.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Avantika Bajpai"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Preferred sport
                </label>
                <select
                  name="preferredSport"
                  value={form.preferredSport}
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
                  Availability
                </label>
                <select
                  name="availability"
                  value={form.availability}
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

            <button
              type="submit"
              className="mt-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Save Profile and Browse Matches
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}