"use client"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface HelpCenterDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HelpCenterDialog({ open, onOpenChange }: HelpCenterDialogProps) {
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
          className="absolute top-3 right-3 sm:top-4 sm:right-4 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 border border-white/40 transition-all duration-200 hover:scale-105 shadow-lg text-sm font-medium z-50 text-gray-900 dark:text-gray-900"
        >
          Cancel
        </button>

        <div className="p-6 bg-white dark:bg-white">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Event RSVP Platform - Help Center</h2>
          <p className="text-sm text-gray-600">
            A modern platform for creating beautiful digital invitations with seamless RSVP management for all your
            events.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-white dark:bg-white">
          <div className="space-y-8 pb-8">
            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">How Host Login Works</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  After purchasing your RSVP service, you'll receive a unique <strong>access token</strong> via Etsy
                  message or email.
                </p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    The token is <strong>used only once</strong> for your first login
                  </li>
                  <li>
                    During first login, the token is <strong>permanently linked to your email address</strong>
                  </li>
                  <li>After that, simply login with your email - no token needed again</li>
                  <li>Your session stays active for 24 hours for convenient access</li>
                  <li>The token cannot be reused or transferred to another email</li>
                </ul>
                <p className="mt-3">
                  <span className="font-medium">Lost access?</span> Contact support at{" "}
                  <a href="mailto:sahinturkzehra@gmail.com" className="text-blue-600 hover:underline">
                    sahinturkzehra@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Quick Start Guide</h3>
              <ul className="space-y-2 ml-6 list-disc text-sm text-gray-600">
                <li>Fill in your event details on the homepage</li>
                <li>Click "Create Event" to generate your invitation</li>
                <li>Share the unique RSVP link or QR code with your guests</li>
                <li>Track all responses in real-time from your Dashboard</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Creating Your Event</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Event Types Available:</h4>
                  <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                    <li>Wedding</li>
                    <li>Engagement</li>
                    <li>Birthday Party</li>
                    <li>Baby Shower</li>
                    <li>Bridal Shower</li>
                    <li>Corporate Event</li>
                    <li>Anniversary</li>
                    <li>Graduation</li>
                    <li>Custom Event</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Required Information:</h4>
                  <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                    <li>Event Type (choose from 9 different types)</li>
                    <li>Event Title</li>
                    <li>Date & Time</li>
                    <li>Location</li>
                    <li>Host Name</li>
                    <li>Host Email (for Dashboard access)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Optional Enhancements:</h4>
                  <ul className="ml-6 list-disc text-sm text-gray-600 space-y-1">
                    <li>Location URL (Google Maps link for easy directions)</li>
                    <li>Cover Image (up to 10MB - adds visual appeal to your invitation)</li>
                    <li>Dress Code</li>
                    <li>Program Notes or Special Instructions</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Important:</span> Your host email must be valid and accessible as it's
                    required to access your Dashboard and manage your event.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Sharing Your Invitation</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Each event gets a unique RSVP link and QR code that you can share with guests.</p>
                <p>
                  Use the "Copy Invitation Link" button in your Dashboard to easily share via WhatsApp, email, text
                  message, or social media.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">
                    Security Note: Anyone with this link can submit RSVPs. Only share with your intended guests.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Accessing Your Dashboard</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Method 1:</span> You'll be automatically redirected after creating your
                  event
                </p>
                <p>
                  <span className="font-medium">Method 2:</span> Use the "Host Login" tab and enter your host email and
                  access token to access your events dashboard
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Session Duration:</span> Your login session remains active for 24
                    hours for convenient access.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Managing Your Event</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Click "Edit Event" in your Dashboard, verify your email, and update any event details as needed.</p>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">What You Can Edit:</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Event Type and Title</li>
                    <li>Date, Time, and Location</li>
                    <li>Location URL</li>
                    <li>Cover Image (up to 10MB)</li>
                    <li>Dress Code</li>
                    <li>Program Notes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Protected Information:</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Host Name and Email (cannot be changed for security)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Good News:</span> Your RSVP link and QR code stay the same after
                    edits, and all existing guest responses are preserved.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tracking Guest Responses</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>View comprehensive RSVP data in your Dashboard with real-time updates:</p>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Real-Time Statistics:</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Total Responses Received</li>
                    <li>Attending vs. Not Attending Count</li>
                    <li>Total Guest Count (including all guests)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Detailed Guest List:</h4>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Guest Name and Attendance Status</li>
                    <li>Number of Guests (1-10 per RSVP)</li>
                    <li>Contact Information (Email & Phone - optional)</li>
                    <li>Personal Messages from guests</li>
                    <li>Submission Timestamp</li>
                    <li>Delete Option (for managing responses)</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700">
                    <span className="font-medium">Live Updates:</span> Your dashboard automatically updates when new
                    RSVPs are submitted - no page refresh needed!
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Guest RSVP Experience</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>When guests visit your invitation link, they can:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>View all event details including date, time, location, and dress code</li>
                  <li>See the cover image if you uploaded one</li>
                  <li>Click "View on Map" to get directions to your location</li>
                  <li>Add the event to their calendar with one click</li>
                  <li>Switch between light and dark themes</li>
                  <li>Submit their RSVP with name, contact info, and attendance status</li>
                  <li>Specify number of guests (1-10 people)</li>
                  <li>Leave a message or note dietary restrictions</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">QR Code Feature</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Access your event's QR code via the "View QR Code" button in your Dashboard. Download it in two
                  formats:
                </p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>
                    <span className="font-medium">JPG Format:</span> Ready-to-use QR code image for printing on physical
                    invitations, event signage, posters, or sharing digitally
                  </li>
                  <li>
                    <span className="font-medium">SVG Format (for Canva):</span> Editable vector QR code that you can
                    import into Canva and customize with different colors, sizes, backgrounds, and design elements to
                    match your event theme
                  </li>
                </ul>
                <p>Guests can scan the QR code with their smartphone camera to instantly access the RSVP form.</p>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700">
                    <span className="font-medium">Pro Tip:</span> Use the SVG version in Canva to create custom-designed
                    QR codes that perfectly match your event's branding and color scheme!
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Exporting Guest Data</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Download your complete guest list as a CSV file using the "Export Guest List" button. Open with Excel,
                  Google Sheets, or any spreadsheet application.
                </p>
                <p className="font-medium text-gray-900">
                  Export includes: Guest Name, Attendance Status, Number of Guests, Email, Phone, Message, and
                  Submission Time
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Add to Calendar</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>The "Add to Calendar" button on your invitation creates a universal .ics file that works with:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Apple Calendar (iPhone/iPad/Mac)</li>
                  <li>Google Calendar</li>
                  <li>Microsoft Outlook</li>
                  <li>All other standard calendar apps</li>
                </ul>
                <p>Automatically includes event name, date, time, location, and a helpful 1-hour advance reminder.</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Theme Options</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  Switch between light and dark themes using the theme toggle button (sun/moon icon). Your preference is
                  automatically saved to your browser.
                </p>
                <p>Both the event invitation page and dashboard support theme switching for comfortable viewing.</p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Frequently Asked Questions</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Can I edit my event after creating it?</p>
                  <p className="text-sm text-gray-600">
                    Yes! Use "Edit Event" to modify date, location, images, and most details anytime.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Can I create multiple events with the same email?</p>
                  <p className="text-sm text-gray-600">Create unlimited events using a single email address.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Will my RSVP link change if I edit the event?</p>
                  <p className="text-sm text-gray-600">No, your link and QR code remain permanent even after edits.</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Is there a limit on the number of guests?</p>
                  <p className="text-sm text-gray-600">
                    No limits on total RSVPs! Each individual RSVP can include 1-10 guests.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">How long does my Dashboard access last?</p>
                  <p className="text-sm text-gray-600">
                    Sessions remain active for 24 hours before requiring re-login for security.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Can guests edit their RSVP after submitting?</p>
                  <p className="text-sm text-gray-600">
                    Guests can submit a new RSVP using the same name which will update their previous response.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Is my event data secure?</p>
                  <p className="text-sm text-gray-600">
                    Yes, all data is securely stored in Supabase and only accessible through your verified host email.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    What image formats are supported for cover photos?
                  </p>
                  <p className="text-sm text-gray-600">
                    All standard image formats (JPG, PNG, GIF, WebP) up to 10MB in size.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Do I need to create an account?</p>
                  <p className="text-sm text-gray-600">
                    No account needed! Just use your email to create events and access your dashboards.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <p className="text-sm font-medium text-gray-900">Need Help?</p>
                <p className="text-sm text-gray-600">Contact technical support:</p>
                <a href="mailto:sahinturkzehra@gmail.com" className="text-sm text-blue-600 hover:underline block">
                  sahinturkzehra@gmail.com
                </a>
                <p className="text-sm font-medium text-gray-900 mt-3">Visit Our Shop:</p>
                <a
                  href="https://www.etsy.com/shop/FlorMontana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block"
                >
                  https://www.etsy.com/shop/FlorMontana
                </a>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
