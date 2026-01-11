"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import type { Event, CreateRSVPInput } from "@/lib/types"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

interface RSVPFormProps {
  event: Event
  isPreview?: boolean
  onSuccess?: () => void
}

export function RSVPForm({ event, isPreview = false, onSuccess }: RSVPFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<CreateRSVPInput, "event_id">>({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    attendance_status: "attending",
    number_of_guests: 1,
    has_plusone: false,
    plusone_name: "",
    meal_choices: [],
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isPreview) {
      setIsSubmitted(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const ip_address = "unknown"
      const user_agent = navigator.userAgent

      const rsvpData = {
        event_id: event.id,
        ...formData,
        ip_address,
        user_agent,
      }

      const { data, error: insertError } = await supabase.from("rsvps").insert([rsvpData]).select()

      if (insertError) {
        throw insertError
      }

      setIsSubmitted(true)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit RSVP")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <motion.div
              className="rounded-full bg-green-100 dark:bg-green-950/50 p-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h3
              className="text-2xl font-semibold text-gradient"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank You!
            </motion.h3>
            <motion.p
              className="text-muted-foreground max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isPreview
                ? "This is how guests will see the confirmation message after submitting their RSVP."
                : "Your RSVP has been received. We look forward to seeing you at the event!"}
            </motion.p>
            {!isPreview && !onSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setFormData({
                      guest_name: "",
                      guest_email: "",
                      guest_phone: "",
                      attendance_status: "attending",
                      number_of_guests: 1,
                      has_plusone: false,
                      plusone_name: "",
                      meal_choices: [],
                      message: "",
                    })
                  }}
                  variant="outline"
                  className="mt-4 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10"
                >
                  Submit Another Response
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>RSVP</CardTitle>
          <CardDescription>Please confirm your attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest_name">Your Name *</Label>
            <Input
              id="guest_name"
              required
              value={formData.guest_name}
              onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
              placeholder="John Doe"
              className="bg-white/30 dark:bg-white/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest_email">Email</Label>
              <Input
                id="guest_email"
                type="email"
                value={formData.guest_email}
                onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                placeholder="john@example.com"
                className="bg-white/30 dark:bg-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest_phone">Phone</Label>
              <Input
                id="guest_phone"
                type="tel"
                value={formData.guest_phone}
                onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="bg-white/30 dark:bg-white/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Will you be attending? *</Label>
            <RadioGroup
              value={formData.attendance_status}
              onValueChange={(value) =>
                setFormData({ ...formData, attendance_status: value as "attending" | "not_attending" })
              }
            >
              <div className="flex items-center space-x-2 p-3 rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                <RadioGroupItem value="attending" id="attending" />
                <Label htmlFor="attending" className="font-normal cursor-pointer">
                  Attending
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                <RadioGroupItem value="not_attending" id="not_attending" />
                <Label htmlFor="not_attending" className="font-normal cursor-pointer">
                  Not Attending
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="number_of_guests">Number of Guests *</Label>
            <Input
              id="number_of_guests"
              type="number"
              min="1"
              max="10"
              required
              value={formData.number_of_guests}
              onChange={(e) => setFormData({ ...formData, number_of_guests: Number.parseInt(e.target.value) || 1 })}
              className="bg-white/30 dark:bg-white/20"
            />
            <p className="text-sm text-muted-foreground">Include yourself and any additional guests</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
              <Checkbox
                id="has_plusone"
                checked={formData.has_plusone}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    has_plusone: checked as boolean,
                    plusone_name: checked ? formData.plusone_name : "",
                  })
                }
              />
              <Label htmlFor="has_plusone" className="font-normal cursor-pointer">
                I'm bringing a +1
              </Label>
            </div>

            {formData.has_plusone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="plusone_name">+1 Guest Name</Label>
                <Input
                  id="plusone_name"
                  value={formData.plusone_name}
                  onChange={(e) => setFormData({ ...formData, plusone_name: e.target.value })}
                  placeholder="Guest's full name"
                  className="bg-white/30 dark:bg-white/20"
                />
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Host (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any special notes or dietary restrictions..."
              rows={4}
              className="bg-white/30 dark:bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Submitting RSVP...
            </>
          ) : (
            "Submit RSVP"
          )}
        </Button>
      </div>
    </form>
  )
}
