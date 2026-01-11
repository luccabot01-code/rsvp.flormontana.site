import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://v0-digital-invitation-platform-lemon.vercel.app"),
  title: {
    default: "Flor & Montana - Digital Invitations & Event Management",
    template: "%s | Flor & Montana",
  },
  description:
    "Create beautiful digital invitations with seamless RSVP management for weddings, birthdays, corporate events, and more. Easy to use, professional, and mobile-friendly.",
  keywords: [
    "RSVP",
    "digital invitation",
    "event management",
    "wedding invitation",
    "birthday party",
    "corporate events",
    "online RSVP",
  ],
  authors: [{ name: "Flor & Montana" }],
  creator: "Flor & Montana",
  publisher: "Flor & Montana",
  generator: "v0.app",
  applicationName: "Flor & Montana Invitation",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Flor & Montana",
    title: "Flor & Montana - Digital Invitations & Event Management",
    description: "Create beautiful digital invitations with seamless RSVP management for all your events.",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 1200,
        alt: "Flor & Montana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flor & Montana - Digital Invitations & Event Management",
    description: "Create beautiful digital invitations with seamless RSVP management for all your events.",
    images: ["/icon.png"],
    creator: "@flormontana",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
  colorScheme: "light dark",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Flor & Montana Invitation",
  description:
    "Create beautiful digital invitations with seamless RSVP management for weddings, birthdays, corporate events, and more.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
