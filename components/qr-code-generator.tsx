"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeGeneratorProps {
  url: string
  title?: string
  compact?: boolean
}

export function QRCodeGenerator({ url, title = "QR Code", compact = false }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrGenerated, setQrGenerated] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      try {
        const size = compact ? 240 : 300
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(img, 0, 0, size, size)
              setQrGenerated(true)
            }
          }
        }
        img.src = qrApiUrl
      } catch (error) {
        console.error("[v0] QR generation error:", error)
      }
    }

    generateQR()
  }, [url, compact])

  const handleDownloadJPG = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-qr-code.jpg`
    link.href = canvas.toDataURL("image/jpeg", 0.95)
    link.click()
  }

  const handleDownloadSVG = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const size = compact ? 240 : 300

    // Create SVG with embedded image
    const imgData = canvas.toDataURL("image/png")
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <image width="${size}" height="${size}" xlinkHref="${imgData}"/>
</svg>`

    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-qr-code.svg`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  if (compact) {
    const size = 240
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <canvas ref={canvasRef} width={size} height={size} className="max-w-full h-auto" />
        </div>
        <Button onClick={handleDownloadJPG} variant="outline" className="w-full bg-transparent" disabled={!qrGenerated}>
          <Download className="h-4 w-4 mr-2" />
          Download QR Code (JPG)
        </Button>
        <Button onClick={handleDownloadSVG} variant="outline" className="w-full bg-transparent" disabled={!qrGenerated}>
          <Download className="h-4 w-4 mr-2" />
          Editable QR Code (SVG for Canva)
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">QR Code</CardTitle>
        <CardDescription>Scan to open RSVP page</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <canvas ref={canvasRef} width={300} height={300} className="max-w-full h-auto" />
        </div>
        <Button onClick={handleDownloadJPG} variant="outline" className="w-full bg-transparent" disabled={!qrGenerated}>
          <Download className="h-4 w-4 mr-2" />
          Download QR Code (JPG)
        </Button>
        <Button onClick={handleDownloadSVG} variant="outline" className="w-full bg-transparent" disabled={!qrGenerated}>
          <Download className="h-4 w-4 mr-2" />
          Editable QR Code (SVG for Canva)
        </Button>
      </CardContent>
    </Card>
  )
}
