"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EVENT_TYPE_LABELS } from "@/lib/utils/event-helpers"
import type { Event, EventType, UpdateEventInput } from "@/lib/types"
import { Upload, X } from "lucide-react"

interface EventEditFormProps {
  event: Event
  onSuccess?: () => void
}

export function EventEditForm({ event, onSuccess }: EventEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(event.cover_image_url || null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(event.cover_image_url || null)
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [imageUrlInput, setImageUrlInput] = useState<string>("")

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    // Veritabanından "2026-01-31 20:00" formatında gelir
    // Input için "2026-01-31T20:00" formatına çevir
    return dateString.replace(" ", "T").slice(0, 16)
  }

  const [formData, setFormData] = useState<UpdateEventInput>({
    event_type: event.event_type,
    title: event.title,
    date: formatDateForInput(event.date),
    location: event.location,
    location_url: event.location_url || "",
    dress_code: event.dress_code || "",
    program_notes: event.program_notes || "",
    allow_plusone: event.allow_plusone,
    require_meal_choice: event.require_meal_choice,
    meal_options: event.meal_options || [],
    custom_attendance_options: event.custom_attendance_options,
    theme_color: event.theme_color,
    host_email: event.host_email,
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

      console.log("[v0] Photo uploaded successfully:", result.url)
      setPhotoUrl(result.url)
    } catch (err) {
      console.error("[v0] Photo upload error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to upload photo"
      setError(errorMessage + " - Try using URL input instead")
      setPhotoPreview(event.cover_image_url || null)
      setPhotoUrl(event.cover_image_url || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUrlSubmit = () => {
    if (!imageUrlInput.trim()) {
      setError("Please enter a valid image URL")
      return
    }
    setPhotoUrl(imageUrlInput.trim())
    setPhotoPreview(imageUrlInput.trim())
    setError(null)
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setPhotoUrl(null)
    setImageUrlInput("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let adjustedDate = formData.date
      if (formData.date) {
        const offsetMinutes = new Date().getTimezoneOffset()
        const localDate = new Date(formData.date)
        localDate.setMinutes(localDate.getMinutes() - offsetMinutes)
        adjustedDate = localDate.toISOString().slice(0, 16)
      }

      const updateData: UpdateEventInput = {
        ...formData,
        date: adjustedDate ? adjustedDate + ":00Z" : null,
        cover_image_url: photoUrl || null,
      }

      console.log("[v0] Updating event with data:", updateData)

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update event")
      }

      const data = await response.json()
      console.log("[v0] Event updated successfully:", data)

      if (onSuccess) {
        onSuccess()
      }

      // Force a full page reload to ensure all data is fresh
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (err) {
      console.error("[v0] Event update error:", err)
      setError(err instanceof Error ? err.message : "Failed to update event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Update information about your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select
              value={formData.event_type}
              onValueChange={(value) => setFormData({ ...formData, event_type: value as EventType })}
            >
              <SelectTrigger id="event_type" className="bg-white/30 dark:bg-white/20">
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
              className="bg-white/30 dark:bg-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Event Photo (Optional)</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={uploadMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMode("upload")}
              >
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMode("url")}
              >
                Use URL
              </Button>
            </div>
            <div className="space-y-4">
              {!photoPreview ? (
                <>
                  {uploadMode === "upload" ? (
                    <div className="relative">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <Label
                        htmlFor="photo"
                        className="flex items-center justify-center gap-2 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        {isUploading ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm">Click to upload photo</span>
                            <span className="text-xs">Max 10MB</span>
                          </div>
                        )}
                      </Label>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="bg-white/30 dark:bg-white/20"
                      />
                      <Button type="button" onClick={handleImageUrlSubmit}>
                        Add
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Event preview"
                    className="w-full h-auto object-contain max-h-96 bg-muted"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white/30 dark:bg-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Grand Hotel Ballroom, 123 Main St"
              className="bg-white/30 dark:bg-white/20"
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
              className="bg-white/30 dark:bg-white/20"
              style={{ wordBreak: "break-all" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dress_code">Dress Code (Optional)</Label>
            <Input
              id="dress_code"
              value={formData.dress_code}
              onChange={(e) => setFormData({ ...formData, dress_code: e.target.value })}
              placeholder="Formal / Black Tie / Casual"
              className="bg-white/30 dark:bg-white/20"
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
              className="bg-white/30 dark:bg-white/20 resize-none"
              style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
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
              Updating Event...
            </>
          ) : (
            "Update Event"
          )}
        </Button>
      </div>
    </form>
  )
}
