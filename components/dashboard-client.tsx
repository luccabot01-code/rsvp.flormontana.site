"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardStats } from "@/components/dashboard-stats"
import { RSVPTable } from "@/components/rsvp-table"
import { DashboardActions } from "@/components/dashboard-actions"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Event, RSVP } from "@/lib/types"

interface DashboardClientProps {
  initialEvent: Event
  slug: string
  eventId: string
}

export function DashboardClient({ initialEvent, slug, eventId }: DashboardClientProps) {
  const [event] = useState<Event>(initialEvent)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchRsvps = async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventId)
        .in("attendance_status", ["attending", "not_attending"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching RSVPs:", error)
      } else {
        setRsvps(data as RSVP[])
      }

      setIsLoading(false)
    }

    fetchRsvps()
  }, [eventId])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`rsvps-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newRsvp = payload.new as RSVP
          if (newRsvp.attendance_status === "attending" || newRsvp.attendance_status === "not_attending") {
            setRsvps((current) => [newRsvp, ...current])
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const updatedRsvp = payload.new as RSVP
          setRsvps((current) => current.map((rsvp) => (rsvp.id === updatedRsvp.id ? updatedRsvp : rsvp)))
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "rsvps",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          setRsvps((current) => current.filter((rsvp) => rsvp.id !== (payload.old as RSVP).id))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div
      data-dashboard="true"
      className="min-h-screen lg:h-screen bg-background overflow-x-hidden overflow-y-auto lg:overflow-hidden flex flex-col"
    >
      <div className="w-full mx-auto px-4 md:px-6 py-4 md:py-4 max-w-[1600px] flex-1 flex flex-col gap-6 md:gap-4 lg:gap-4 lg:overflow-hidden">
        <DashboardHeader event={event} />

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6 md:gap-4 lg:gap-4 flex-1 lg:overflow-hidden">
          <div className="flex flex-col gap-6 md:gap-4 lg:gap-3 lg:overflow-hidden">
            <DashboardStats rsvps={rsvps} />

            <div className="flex-1 lg:overflow-hidden">
              <RSVPTable rsvps={rsvps} eventId={event.id} slug={slug} />
            </div>
          </div>

          <div className="space-y-6 md:space-y-4 lg:space-y-6 lg:order-none order-first lg:overflow-y-auto">
            <DashboardActions event={event} rsvps={rsvps} />
          </div>
        </div>
      </div>
    </div>
  )
}
