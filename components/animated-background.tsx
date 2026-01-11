"use client"

import { motion } from "framer-motion"
import { memo } from "react"

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blob 1 - Sol üst */}
      <motion.div
        className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-gradient-to-r from-gray-900 to-black rounded-full blur-3xl opacity-10 dark:opacity-20"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      {/* Blob 2 - Sağ orta */}
      <motion.div
        className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-gradient-to-l from-gray-800 to-gray-950 rounded-full blur-3xl opacity-10 dark:opacity-20"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      {/* Blob 3 - Alt orta */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-full blur-3xl opacity-5 dark:opacity-15"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      <motion.div
        className="absolute top-20 right-10 w-[300px] h-[300px] md:hidden bg-gradient-to-br from-gray-800 to-gray-950 rounded-full blur-3xl opacity-10 dark:opacity-15"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "loop",
        }}
      />
    </div>
  )
})
