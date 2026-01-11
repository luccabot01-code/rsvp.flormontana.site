"use client"

import type React from "react"

import { useState, useCallback, memo } from "react"
import { RSVPForm } from "@/components/rsvp-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddToCalendarButton } from "@/components/add-to-calendar-button"
import { RSVPHeader } from "@/components/rsvp-header"
import { AnimatedBackground } from "@/components/animated-background"
import { Calendar, MapPin } from "lucide-react"
import { formatDate, EVENT_TYPE_LABELS } from "@/lib/utils/event-helpers"
import type { Event } from "@/lib/types"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface RSVPPageClientProps {
  event: Event
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const DetailItem = memo(function DetailItem({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: any
  title: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="p-2 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10">
        <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-semibold mb-2">{title}</p>
        {children}
      </div>
    </motion.div>
  )
})

export function RSVPPageClient({ event }: RSVPPageClientProps) {
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)

  const handleModalSuccess = useCallback(() => {
    setIsRsvpModalOpen(false)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsRsvpModalOpen(open)
  }, [])

  const shouldTruncateDetails = event.program_notes && event.program_notes.length > 30
  const truncatedDetails = shouldTruncateDetails ? event.program_notes.slice(0, 30) : event.program_notes

  return (
    <div className="min-h-screen hero-gradient relative">
      <AnimatedBackground />

      <main
        className={`container mx-auto px-4 py-12 relative z-10 transition-all duration-500 ${
          isRsvpModalOpen ? "blur-sm" : "blur-0"
        }`}
        role="main"
      >
        <motion.article
          className="mx-auto max-w-2xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <RSVPHeader />

          <motion.header variants={itemVariants} className="text-center space-y-4">
            <motion.div
              className="inline-block px-4 py-1.5 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-foreground rounded-full text-sm font-medium md:backdrop-blur-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.15 }}
            >
              {EVENT_TYPE_LABELS[event.event_type as keyof typeof EVENT_TYPE_LABELS]}
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight text-balance text-gradient-title break-words overflow-wrap-anywhere max-w-full px-4">
              {event.title}
            </h1>
            <p className="text-xl text-muted-foreground">You're invited!</p>
          </motion.header>

          {event.cover_image_url && (
            <motion.figure variants={itemVariants}>
              <motion.div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={event.cover_image_url || "/placeholder.svg"}
                  alt={`${event.title} event cover image`}
                  className="w-full h-auto object-contain max-h-[600px] bg-muted"
                  loading="eager"
                  fetchPriority="high"
                />
              </motion.div>
            </motion.figure>
          )}

          <motion.section variants={itemVariants} aria-label="Event details">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
              <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-2xl md:backdrop-blur-lg">
                <CardContent className="pt-6 space-y-6">
                  <DetailItem icon={Calendar} title="Date & Time" delay={0.2}>
                    <time dateTime={event.date} className="text-muted-foreground block mb-3">
                      {formatDate(event.date)}
                    </time>
                    <AddToCalendarButton
                      event={{
                        title: event.title,
                        description: event.program_notes,
                        location: event.location,
                        startDate: event.date,
                      }}
                    />
                  </DetailItem>

                  <DetailItem icon={MapPin} title="Location" delay={0.25}>
                    <address className="text-muted-foreground not-italic mb-3">{event.location}</address>
                    {event.location_url && (
                      <motion.a
                        href={event.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-200 font-medium text-sm shadow-soft"
                        aria-label={`View ${event.location} on map`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        View on Map
                      </motion.a>
                    )}
                  </DetailItem>

                  {event.dress_code && (
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <div className="p-2 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10">
                        <span className="text-lg" aria-hidden="true">
                          👔
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">Dress Code</p>
                        <p className="text-muted-foreground">{event.dress_code}</p>
                      </div>
                    </motion.div>
                  )}

                  {event.program_notes && (
                    <motion.div
                      className="pt-4 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <p className="font-semibold mb-2">Event Details</p>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
                        {truncatedDetails}
                        {shouldTruncateDetails && "..."}
                      </p>
                      {shouldTruncateDetails && (
                        <Dialog open={showFullDetails} onOpenChange={setShowFullDetails}>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-primary hover:underline mt-2">
                              See more...
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            showCloseButton={true}
                            className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50 shadow-2xl p-6"
                          >
                            <div className="pr-2 w-full max-w-full">
                              <h3 className="text-lg font-semibold mb-4 break-words">Program / Notes</h3>
                              <p className="text-muted-foreground whitespace-pre-wrap break-all leading-relaxed max-w-full">
                                {event.program_notes}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          <motion.section variants={itemVariants} aria-labelledby="rsvp-heading" className="text-center">
            <Dialog open={isRsvpModalOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
                  <Button
                    size="lg"
                    className="w-full text-lg py-6 btn-gradient backdrop-blur-md bg-primary/90 border border-white/20 shadow-2xl hover:shadow-xl transition-all duration-200"
                  >
                    Click here to RSVP
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar p-4 md:p-6 backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50 shadow-2xl"
              >
                <button
                  onClick={() => setIsRsvpModalOpen(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 border border-white/40 transition-all duration-200 hover:scale-105 shadow-lg text-sm font-medium z-50"
                  aria-label="Close"
                >
                  Cancel
                </button>
                <RSVPForm event={event} onSuccess={handleModalSuccess} />
              </DialogContent>
            </Dialog>
          </motion.section>
        </motion.article>
      </main>
    </div>
  )
}
