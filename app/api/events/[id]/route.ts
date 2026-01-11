import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { getHostSession } from "@/lib/auth/host-session"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    const dateString = body.date || null

    // Update the event
    const { data, error } = await supabase
      .from("events")
      .update({
        event_type: body.event_type,
        title: body.title,
        date: dateString,
        location: body.location,
        location_url: body.location_url || null,
        dress_code: body.dress_code || null,
        program_notes: body.program_notes || null,
        allow_plusone: body.allow_plusone,
        require_meal_choice: body.require_meal_choice,
        meal_options: body.meal_options?.filter(Boolean) || [],
        custom_attendance_options: body.custom_attendance_options,
        theme_color: body.theme_color,
        cover_image_url: body.cover_image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("host_email", body.host_email) // Security: only allow host to update
      .select()
      .single()

    if (error) {
      console.error("[v0] Event update error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Event update error:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const hostEmail = await getHostSession()

    if (!hostEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // First verify the event belongs to this host
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("id, host_email")
      .eq("id", id)
      .eq("host_email", hostEmail)
      .single()

    if (fetchError || !event) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
    }

    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from("events")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Event delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Event delete error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
