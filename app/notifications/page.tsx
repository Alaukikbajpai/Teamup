"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"

type UserProfile = {
  userId: string
  name: string
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function NotificationsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  function loadNotifications() {
    const savedProfile = localStorage.getItem("teamup_user_profile")
    const savedNotifications = localStorage.getItem("teamup_notifications")

    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUser(profile)

      const allNotifications: Notification[] = savedNotifications
        ? JSON.parse(savedNotifications)
        : []

      const userNotifications = allNotifications.filter(
        (notification) => notification.userId === profile.userId
      )

      setNotifications(userNotifications)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  function markAsRead(notificationId: string) {
    const existingNotifications: Notification[] = JSON.parse(
      localStorage.getItem("teamup_notifications") || "[]"
    )

    const updatedNotifications = existingNotifications.map((notification) =>
      notification.notificationId === notificationId
        ? { ...notification, read: true }
        : notification
    )

    localStorage.setItem(
      "teamup_notifications",
      JSON.stringify(updatedNotifications)
    )

    loadNotifications()
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Step 5 of MVP</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Notifications
          </h1>
          <p className="mt-3 text-slate-600">
            See updates when your join requests are approved or rejected.
          </p>
        </div>

        {!user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create your profile first to view notifications.
          </div>
        )}

        {user && notifications.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              No notifications yet
            </h2>
            <p className="mt-2 text-slate-600">
              Once an organizer approves or rejects your request, it will appear here.
            </p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification.notificationId}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-950">
                        {notification.title}
                      </h2>

                      {!notification.read && (
                        <span className="rounded-full bg-slate-950 px-2 py-1 text-xs font-medium text-white">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.notificationId)}
                      className="rounded-md border bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}