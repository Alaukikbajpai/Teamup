"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/users?email=${encodeURIComponent(email.toLowerCase())}`,
        {
          cache: "no-store",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Profile not found")
      }

      localStorage.setItem("teamup_user_id", data.user.userId)
      localStorage.setItem("teamup_user_profile", JSON.stringify(data.user))

      router.push("/matches")
    } catch (error) {
      console.error("Login error:", error)
      alert(
        error instanceof Error
          ? error.message
          : "Could not continue with this profile."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Passwordless MVP login
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Continue with existing profile
          </h1>

          <p className="mt-3 text-slate-600">
            Enter the email you used while creating your TeamUp profile. This is
            a lightweight demo login for the hackathon MVP.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">
              Profile email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="organizer@test.com"
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Finding Profile..." : "Continue"}
          </button>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            New to TeamUp?{" "}
            <Link href="/onboarding" className="font-semibold text-slate-950">
              Create a profile
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}