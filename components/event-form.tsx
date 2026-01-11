"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, MapPin, Eye, Upload } from "lucide-react"
import { createEventAction } from "@/app/actions"
import type { CreateEventInput } from "@/lib/types"
import { motion } from "framer-motion"
import { RSVPForm } from "./rsvp-form"
import { EVENT_TYPE_LABELS, generateSlug, formatDate } from "@/lib/utils/event-helpers"

const formCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

export function EventForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdEventSlug, setCreatedEventSlug] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateEventInput>({
    event_type: "wedding",
    title: "",
    date: "",
    location: "",
    location_url: "",
    dress_code: "",
    program_notes: "",
    allow_plusone: true,
    require_meal_choice: false,
    meal_options: [],
    custom_attendance_options: ["attending", "not_attending"],
    theme_color: "#000000",
    host_name: "",
    host_email: "",
  })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      console.log("[v0] Uploading file to API...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      console.log("[v0] Upload successful:", result.url)
      setPhotoUrl(result.url)
    } catch (err) {
      console.error("[v0] Photo upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload photo")
      setPhotoPreview(null)
      setPhotoUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePreview = () => {
    if (!formData.title || !formData.date || !formData.location || !formData.host_name || !formData.host_email) {
      setError("Please fill in all required fields before previewing")
      return
    }
    setError(null)
    setShowPreview(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const slug = generateSlug(formData.title)

      const dateForDatabase = formData.date ? formData.date.replace("T", " ") : null

      const insertData = {
        event_type: formData.event_type,
        title: formData.title,
        date: dateForDatabase,
        location: formData.location,
        location_url: formData.location_url || null,
        dress_code: formData.dress_code || null,
        program_notes: formData.program_notes || null,
        allow_plusone: formData.allow_plusone,
        require_meal_choice: formData.require_meal_choice,
        meal_options: formData.meal_options?.filter(Boolean) || [],
        custom_attendance_options: formData.custom_attendance_options,
        theme_color: formData.theme_color,
        cover_image_url: photoUrl || null,
        host_name: formData.host_name,
        host_email: formData.host_email,
        slug,
      }

      console.log("[v0] Inserting event with data:", insertData)

      const event = await createEventAction(insertData)

      console.log("[v0] Event created successfully:", event)

      setCreatedEventSlug(slug)
      setIsSuccess(true)
      setIsLoading(false)
    } catch (err) {
      console.error("[v0] Event creation error:", err)
      setError(err instanceof Error ? err.message : "Failed to create event")
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass-card shadow-soft">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <CardTitle className="text-2xl">Event Created Successfully!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your event has been created. To manage it and view RSVPs, please log in as host.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("switchToHostLogin"))
                }}
              >
                Log In as Host
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setIsSuccess(false)
                  setCreatedEventSlug(null)
                  setFormData({
                    event_type: "wedding",
                    title: "",
                    date: "",
                    location: "",
                    location_url: "",
                    dress_code: "",
                    program_notes: "",
                    allow_plusone: true,
                    require_meal_choice: false,
                    meal_options: [],
                    custom_attendance_options: ["attending", "not_attending"],
                    theme_color: "#000000",
                    host_name: "",
                    host_email: "",
                  })
                  setPhotoPreview(null)
                  setPhotoUrl(null)
                }}
              >
                Create Another Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (showPreview) {
    const previewEvent = {
      id: "preview",
      slug: "preview",
      event_type: formData.event_type,
      title: formData.title,
      date: formData.date ? formData.date.replace("T", " ") : new Date().toISOString(), // Convert "YYYY-MM-DDTHH:MM" to "YYYY-MM-DD HH:MM"
      location: formData.location,
      location_url: formData.location_url,
      dress_code: formData.dress_code,
      program_notes: formData.program_notes,
      cover_image_url: photoUrl,
      allow_plusone: formData.allow_plusone,
      require_meal_choice: formData.require_meal_choice,
      meal_options: formData.meal_options,
      custom_attendance_options: formData.custom_attendance_options,
      theme_color: formData.theme_color,
      host_name: formData.host_name,
      host_email: formData.host_email,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          className="max-w-[95vw] md:max-w-3xl max-h-[90vh] p-0 gap-0 backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50 overflow-hidden"
          showCloseButton={false}
        >
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 z-50 rounded-lg px-4 py-2 text-sm font-medium backdrop-blur-md bg-white/20 border border-white/40 hover:bg-white/30 transition-all duration-200"
          >
            Close Preview
          </button>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar max-h-[90vh]">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center">
                <motion.div
                  className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium glass"
                  whileHover={{ scale: 1.05 }}
                >
                  Preview Mode
                </motion.div>
              </div>

              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {EVENT_TYPE_LABELS[formData.event_type as keyof typeof EVENT_TYPE_LABELS]}
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-balance text-gradient">{formData.title}</h1>
                <p className="text-xl text-muted-foreground">You're invited!</p>
              </motion.div>

              {photoPreview && (
                <motion.div
                  className="relative w-full rounded-2xl overflow-hidden shadow-soft-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt={formData.title}
                    className="w-full h-auto object-contain max-h-[600px] bg-muted"
                  />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass-card shadow-soft">
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-semibold">Date & Time</p>
                        <p className="text-muted-foreground">
                          {formData.date ? formatDate(formData.date.replace("T", " ")) : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">Location</p>
                        <p className="text-muted-foreground">{formData.location}</p>
                        {formData.location_url && (
                          <a
                            href={formData.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm mt-1 inline-block"
                          >
                            View on map →
                          </a>
                        )}
                      </div>
                    </div>

                    {formData.dress_code && (
                      <div className="flex items-start gap-4">
                        <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">👔</div>
                        <div>
                          <p className="font-semibold">Dress Code</p>
                          <p className="text-muted-foreground">{formData.dress_code}</p>
                        </div>
                      </div>
                    )}

                    {formData.program_notes && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="font-semibold mb-2">Event Details</p>
                        {formData.program_notes.length > 30 ? (
                          <div>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                              {formData.program_notes.slice(0, 30)}...
                            </p>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="text-primary hover:underline text-sm mt-2">See more...</button>
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-[95vw] md:max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50"
                                showCloseButton={true}
                              >
                                <div className="pt-4 pb-4 px-2 bg-white dark:bg-white rounded-lg w-full">
                                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Event Details</h3>
                                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere w-full">
                                    {formData.program_notes}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {formData.program_notes}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h2 className="text-3xl font-semibold mb-6 text-center text-gradient">RSVP</h2>
                <RSVPForm event={previewEvent} isPreview={true} />
              </motion.div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-6"
    >
      <motion.div variants={formCardVariants} initial="hidden" animate="visible">
        <Card className="glass-card shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Basic information about your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => setFormData({ ...formData, event_type: value })}
              >
                <SelectTrigger id="event_type" className="input-glow transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sarah & John's Wedding"
                className="input-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Event Photo (Optional)</Label>
              <div className="space-y-4">
                <input id="cover_image" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                {!photoPreview && (
                  <div
                    onClick={() => document.getElementById("cover_image")?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-white/30 dark:bg-white/20"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                  </div>
                )}
                {photoPreview && (
                  <div className="relative">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPhotoPreview(null)
                        setPhotoUrl(null)
                        const input = document.getElementById("cover_image") as HTMLInputElement
                        if (input) input.value = ""
                      }}
                      className="absolute top-2 right-2 rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur-md bg-white/20 border border-white/40 hover:bg-white/30 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-glow transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Grand Hotel Ballroom, 123 Main St"
                className="input-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_url">Location URL (Optional)</Label>
              <Input
                id="location_url"
                type="url"
                value={formData.location_url}
                onChange={(e) => setFormData({ ...formData, location_url: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="input-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dress_code">Dress Code (Optional)</Label>
              <Input
                id="dress_code"
                value={formData.dress_code}
                onChange={(e) => setFormData({ ...formData, dress_code: e.target.value })}
                placeholder="Formal / Black Tie / Casual"
                className="input-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_notes">Program / Notes (Optional)</Label>
              <Textarea
                id="program_notes"
                value={formData.program_notes}
                onChange={(e) => setFormData({ ...formData, program_notes: e.target.value })}
                placeholder="Ceremony starts at 4 PM, followed by cocktail hour..."
                rows={4}
                className="input-glow transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={formCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card className="glass-card shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Host Information</CardTitle>
            <CardDescription>Your contact details to manage the event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host_name">Your Name</Label>
              <Input
                id="host_name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.host_name}
                onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
                placeholder="Sarah Johnson"
                className="input-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="host_email">Your Email</Label>
              <Input
                id="host_email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={formData.host_email}
                onChange={(e) => setFormData({ ...formData, host_email: e.target.value })}
                placeholder="sarah@example.com"
                className="input-glow transition-all duration-300"
              />
              <p className="text-sm text-muted-foreground">Used to access your event dashboard</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full glass-card shadow-soft hover:shadow-soft-lg transition-all duration-300 bg-transparent"
            onClick={handlePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview RSVP Form
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="submit"
            size="lg"
            className="w-full btn-gradient shadow-soft hover:shadow-soft-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Creating Event...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  )
}
