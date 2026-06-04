"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type UserProfile = {
  userId: string
  name: string
  city?: string
  preferredSports?: string[]
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    function loadUser() {
      const savedProfile = localStorage.getItem("teamup_user_profile")

      if (savedProfile) {
        setUser(JSON.parse(savedProfile))
      } else {
        setUser(null)
      }
    }

    loadUser()
    window.addEventListener("storage", loadUser)

    return () => {
      window.removeEventListener("storage", loadUser)
    }
  }, [])

  function handleSwitchProfile() {
    localStorage.removeItem("teamup_user_id")
    localStorage.removeItem("teamup_user_profile")
    setUser(null)
    window.location.href = "/onboarding"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
            TU
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            TeamUp
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="/matches" className="text-slate-600 hover:text-slate-950">
            Matches
          </a>

          <a
            href="/matches/new"
            className="text-slate-600 hover:text-slate-950"
          >
            Create Match
          </a>

          <a href="/requests" className="text-slate-600 hover:text-slate-950">
            Requests
          </a>

          <a
            href="/notifications"
            className="text-slate-600 hover:text-slate-950"
          >
            Notifications
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-500">Current user</p>
                <p className="max-w-[120px] truncate text-sm font-semibold text-slate-950 md:max-w-[160px]">
                  {user.name}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSwitchProfile}
                className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:text-sm"
              >
                Switch
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:px-4 sm:text-sm"
              >
                Login
              </a>

              <a
                href="/onboarding"
                className="rounded-md bg-slate-950 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 sm:px-4 sm:text-sm"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </div>

      <div className="border-t bg-white px-4 py-2 md:hidden">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-x-auto text-xs font-medium">
          <a href="/matches" className="whitespace-nowrap text-slate-600">
            Matches
          </a>

          <a href="/matches/new" className="whitespace-nowrap text-slate-600">
            Create
          </a>

          <a href="/requests" className="whitespace-nowrap text-slate-600">
            Requests
          </a>

          <a
            href="/notifications"
            className="whitespace-nowrap text-slate-600"
          >
            Notifications
          </a>

          <a href="/login" className="whitespace-nowrap text-slate-600">
            Login
          </a>
        </nav>
      </div>
    </header>
  )
}