"use client"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface DashboardHelpDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DashboardHelpDialog({ open, onOpenChange }: DashboardHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent text-xs md:text-sm" aria-label="Help Center">
          <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0 gap-0 backdrop-blur-md bg-white/40 dark:bg-white/40 border-white/50 shadow-2xl"
        overlayClassName="backdrop-blur-md bg-black/50"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 border border-white/40 transition-all duration-200 hover:scale-105 shadow-lg text-sm font-medium z-50"
        >
          Cancel
        </button>

        <div className="p-6 bg-white dark:bg-white">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Dashboard Help Center</h2>
          <p className="text-sm text-gray-600">
            Learn how to use your event dashboard and manage your RSVP page effectively.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-white dark:bg-white">
          <div className="space-y-8 pb-8">
            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">What is the Dashboard?</h3>
              <p className="text-sm text-gray-600 mb-2">
                Your Dashboard is the control center for your event. Here you can view all guest responses, manage event
                details, share your invitation, and track RSVPs in real-time.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Live Updates:</span> Your dashboard automatically refreshes when new
                  RSVPs are submitted. Both the statistics and guest list update in real-time - no manual refresh
                  needed!
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Dashboard Buttons & Features</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">🌓 Theme Toggle</h4>
                  <p className="text-sm text-gray-600">
                    Switch between light and dark mode for comfortable viewing. Your preference is saved automatically.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">➕ Create New Event</h4>
                  <p className="text-sm text-gray-600">
                    Takes you back to the homepage to create another event. You can manage multiple events with the same
                    email.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">✏️ Edit Event</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Opens a form to update your event details. You'll need to verify your email first for security.
                  </p>
                  <p className="text-sm text-gray-700 font-medium">What you can edit:</p>
                  <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1 mt-1">
                    <li>Event Type and Title</li>
                    <li>Date, Time, and Location</li>
                    <li>Location URL (Google Maps link)</li>
                    <li>Cover Image (up to 10MB)</li>
                    <li>Dress Code</li>
                    <li>Program Notes</li>
                  </ul>
                  <div className="bg-yellow-50 p-2 rounded border border-yellow-200 mt-2">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Note:</span> Your RSVP link and QR code stay the same after editing.
                      All guest responses are preserved.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">❓ Help</h4>
                  <p className="text-sm text-gray-600">
                    Opens this help dialog with information about dashboard features and RSVP page management.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">🔄 Refresh</h4>
                  <p className="text-sm text-gray-600">
                    Manually reloads the page if needed. The dashboard updates automatically, but you can use this
                    button to force a full page reload.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">🖼️ Cover Image Preview</h4>
                  <p className="text-sm text-gray-600">
                    If you uploaded a cover image, click the thumbnail to view it in full size.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Actions Panel</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">🔗 Open Invitation Link</h4>
                  <p className="text-sm text-gray-600">
                    Opens your event's RSVP page in a new tab so you can see how guests view your invitation.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">📋 Copy Invitation Link</h4>
                  <p className="text-sm text-gray-600">
                    Copies your unique RSVP link to clipboard. Share this link with guests via WhatsApp, email, text
                    message, or social media.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">📱 View QR Code</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Opens a dialog showing your event's QR code. Download it in two formats:
                  </p>
                  <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                    <li>
                      <span className="font-medium">JPG Format:</span> Ready-to-use image for printing or sharing
                      digitally
                    </li>
                    <li>
                      <span className="font-medium">SVG Format (for Canva):</span> Editable vector file that you can
                      customize in Canva with different colors, sizes, and designs
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Use QR codes on printed invitations, event signage, email signatures, or digital posts. Guests can
                    scan with their smartphone camera to instantly access the RSVP page.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">📥 Export Guest List</h4>
                  <p className="text-sm text-gray-600">
                    Downloads a CSV file with all RSVP responses. Open with Excel, Google Sheets, or any spreadsheet
                    app. Includes: Guest Name, Status, Number of Guests, Contact Info, Messages, and Submission Time.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">RSVP Statistics</h3>
              <p className="text-sm text-gray-600 mb-2">View real-time metrics at the top of your dashboard:</p>
              <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Total Responses:</span> How many people have submitted an RSVP
                </li>
                <li>
                  <span className="font-medium">Attending:</span> Number of RSVPs with "Attending" status
                </li>
                <li>
                  <span className="font-medium">Not Attending:</span> Number of RSVPs with "Not Attending" status
                </li>
                <li>
                  <span className="font-medium">Total Guests:</span> Sum of all guests (including plus-ones, up to 10
                  per RSVP)
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Guest List Management</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  View detailed information for each RSVP submission in the guest list table:
                </p>
                <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                  <li>Guest Name and Attendance Status (Attending/Not Attending)</li>
                  <li>Number of Guests (1-10 per RSVP)</li>
                  <li>Contact Information (Email and Phone if provided)</li>
                  <li>Personal Messages from guests</li>
                  <li>Submission Date and Time</li>
                </ul>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Delete Option:</span> Click the delete button (trash icon) to remove
                    individual RSVP responses if needed. This action cannot be undone.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Understanding Your RSVP Page</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>When guests visit your invitation link, they see:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Event title, type, date, time, and location</li>
                  <li>Cover image (if uploaded)</li>
                  <li>Dress code and program notes</li>
                  <li>"View on Map" button (if location URL provided)</li>
                  <li>"Add to Calendar" button (creates universal .ics file)</li>
                  <li>Theme toggle for light/dark mode</li>
                  <li>RSVP form to submit their response</li>
                </ul>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-2">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Guest Experience:</span> Guests can submit their name, contact info,
                    attendance status, number of guests (1-10), and a personal message. The form is simple and
                    mobile-friendly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Dashboard Access & Security</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">How to access:</span> Enter your host email on the "Host Login" tab of
                  the homepage to view all events associated with your email.
                </p>
                <p>
                  <span className="font-medium">Session duration:</span> Your login session remains active for 24 hours
                  before requiring re-login.
                </p>
                <p>
                  <span className="font-medium">Security:</span> Only you (with the verified host email) can access and
                  manage your event dashboard. Guest data is securely stored in Supabase.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Common Questions</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Why isn't my dashboard updating?</p>
                  <p className="text-sm text-gray-600">
                    The dashboard should update automatically. Try clicking the Refresh button or clearing your browser
                    cache.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Can guests see other RSVPs?</p>
                  <p className="text-sm text-gray-600">
                    No, only you (the host) can see the full guest list. Guests only see the RSVP form.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">What happens if I delete an RSVP?</p>
                  <p className="text-sm text-gray-600">
                    The RSVP is permanently removed from your guest list and statistics. The guest can submit a new RSVP
                    if needed.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">How do I share my invitation?</p>
                  <p className="text-sm text-gray-600">
                    Copy the invitation link or download the QR code. Share via WhatsApp, email, social media, or print
                    on physical invitations.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <p className="text-sm font-medium text-gray-900">Need More Help?</p>
                <p className="text-sm text-gray-600">Contact support:</p>
                <a href="mailto:sahinturkzehra@gmail.com" className="text-sm text-blue-600 hover:underline block">
                  sahinturkzehra@gmail.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
