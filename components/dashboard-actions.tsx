"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, Check, LinkIcon, QrCode, ExternalLink } from "lucide-react"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import type { Event, RSVP } from "@/lib/types"
import { motion } from "framer-motion"

interface DashboardActionsProps {
  event: Event
  rsvps: RSVP[]
}

export function DashboardActions({ event, rsvps }: DashboardActionsProps) {
  const [copied, setCopied] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/rsvp/${event.slug}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("[v0] Failed to copy:", err)
    }
  }

  const handleExportCSV = () => {
    const validRsvps = rsvps.filter(
      (rsvp) => rsvp.attendance_status === "attending" || rsvp.attendance_status === "not_attending",
    )

    const headers = ["Name", "Status", "Guests", "Contact", "Message", "Submitted At"]
    const rows = validRsvps.map((rsvp) => [
      rsvp.guest_name,
      rsvp.attendance_status === "attending" ? "Attending" : "Not Attending",
      rsvp.number_of_guests,
      [rsvp.guest_email, rsvp.guest_phone].filter(Boolean).join(" | ") || "N/A",
      rsvp.message || "",
      new Date(rsvp.created_at).toLocaleString(),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `${event.slug}-rsvps.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const validRsvpCount = rsvps.filter(
    (rsvp) => rsvp.attendance_status === "attending" || rsvp.attendance_status === "not_attending",
  ).length

  const buttonVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 4 },
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="glass-card shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Manage your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Open Invitation Link Button */}
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.05 }}
            >
              <Button
                onClick={() => window.open(inviteUrl, "_blank")}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-auto py-2.5 px-3 glass hover:bg-primary/5 transition-all duration-300 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left text-sm">Open Invitation Link</span>
              </Button>
            </motion.div>

            {/* Copy Link Button */}
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-auto py-2.5 px-3 glass hover:bg-primary/5 transition-all duration-300 bg-transparent"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="flex-1 text-left text-sm">{copied ? "Link Copied!" : "Copy Invitation Link"}</span>
                {!copied && <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </Button>
            </motion.div>

            {/* QR Code Button */}
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.15 }}
            >
              <Button
                onClick={() => setQrDialogOpen(true)}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 py-2.5 px-3 glass hover:bg-primary/5 transition-all duration-300"
              >
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">View QR Code</span>
              </Button>
            </motion.div>

            {/* Export Button */}
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 py-2.5 px-3 glass hover:bg-primary/5 transition-all duration-300 bg-transparent"
                disabled={validRsvpCount === 0}
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Export Guest List</span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent
          className="sm:max-w-md backdrop-blur-2xl bg-white/40 dark:bg-white/40 border border-white/50 shadow-2xl"
          overlayClassName="backdrop-blur-md bg-black/50"
          showCloseButton={false}
        >
          {/* Cancel button added */}
          <DialogClose asChild>
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 border border-white/40 transition-all duration-300 hover:scale-105 shadow-lg text-sm font-medium z-50"
              aria-label="Close"
            >
              Cancel
            </button>
          </DialogClose>
          <DialogHeader className="pr-20">
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <QRCodeGenerator url={inviteUrl} title={event.title} compact />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
