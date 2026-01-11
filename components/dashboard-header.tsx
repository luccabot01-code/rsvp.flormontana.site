"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Calendar, MapPin, Pencil, Moon, Sun, Plus } from "lucide-react"
import { EVENT_TYPE_LABELS } from "@/lib/utils/event-helpers"
import { formatDate } from "@/lib/utils/event-helpers"
import type { Event } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { EventEditForm } from "@/components/event-edit-form"
import { DashboardHelpDialog } from "@/components/dashboard-help-dialog"

interface DashboardHeaderProps {
  event: Event
}

export function DashboardHeader({ event }: DashboardHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <div className="flex items-start md:items-center justify-between gap-3 md:gap-4 pb-4 md:pb-6 border-b flex-wrap">
      <div className="flex items-start md:items-center gap-3 md:gap-4 lg:gap-6 flex-1 min-w-0 w-full md:w-auto flex-wrap">
        {/* Event Title & Type */}
        <div className="min-w-0 flex-shrink">
          <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight truncate">{event.title}</h1>
            <Badge variant="secondary" className="flex-shrink-0 text-xs">
              {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Event Dashboard</p>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-[200px]">{event.location}</span>
            {event.cover_image_url && (
              <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
                <DialogTrigger asChild>
                  <button className="rounded-md overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow ml-2 cursor-pointer">
                    <img
                      src={event.cover_image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="w-8 h-8 md:w-10 md:h-10 object-cover"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[95vh] p-2 md:p-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={event.cover_image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {event.cover_image_url && (
          <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
            <DialogTrigger asChild>
              <button className="lg:hidden rounded-md overflow-hidden border border-border/50 cursor-pointer">
                <img
                  src={event.cover_image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="w-8 h-8 object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[95vh] p-2 md:p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={event.cover_image_url || "/placeholder.svg"}
                  alt={event.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-transparent text-xs md:text-sm md:shadow-[0_0_35px_rgba(0,0,0,0.5)] md:hover:shadow-[0_0_45px_rgba(0,0,0,0.7)] md:dark:shadow-[0_0_35px_rgba(251,191,36,0.6)] md:dark:hover:shadow-[0_0_50px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Toggle theme"
        >
          <Sun className="h-3.5 w-3.5 md:h-4 md:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-3.5 w-3.5 md:h-4 md:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" asChild>
          <Link href="/">
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden sm:inline">Create New Event</span>
          </Link>
        </Button>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm">
              <Pencil className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
              <span className="hidden sm:inline">Edit Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar p-4 md:p-6 backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50 shadow-2xl"
            showCloseButton={false}
          >
            <DialogClose asChild>
              <button
                className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 border border-white/40 transition-all duration-200 hover:scale-105 shadow-lg text-sm font-medium z-50"
                aria-label="Close"
              >
                Cancel
              </button>
            </DialogClose>
            <EventEditForm event={event} onSuccess={() => setIsEditModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <DashboardHelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-transparent text-xs md:text-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  )
}
