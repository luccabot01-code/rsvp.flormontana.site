"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

export function RSVPHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <Sun className="h-3.5 w-3.5 md:h-4 md:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-3.5 w-3.5 md:h-4 md:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Dark / Light</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
