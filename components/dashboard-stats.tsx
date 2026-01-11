"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, UserPlus } from "lucide-react"
import type { RSVP } from "@/lib/types"
import { motion } from "framer-motion"

interface DashboardStatsProps {
  rsvps: RSVP[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export function DashboardStats({ rsvps }: DashboardStatsProps) {
  const validRsvps = rsvps.filter((r) => r.attendance_status === "attending" || r.attendance_status === "not_attending")

  const totalResponses = validRsvps.length

  const attendingGuests = validRsvps
    .filter((r) => r.attendance_status === "attending")
    .reduce((sum, r) => sum + r.number_of_guests, 0)

  const notAttendingGuests = validRsvps
    .filter((r) => r.attendance_status === "not_attending")
    .reduce((sum, r) => sum + r.number_of_guests, 0)

  const totalGuests = attendingGuests + notAttendingGuests

  const stats = [
    {
      label: "Total Responses",
      value: totalResponses,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950/50",
      gradient: "from-blue-500/20 to-blue-600/10",
    },
    {
      label: "Attending",
      value: attendingGuests,
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950/50",
      gradient: "from-green-500/20 to-green-600/10",
    },
    {
      label: "Not Attending",
      value: notAttendingGuests,
      icon: UserX,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-950/50",
      gradient: "from-red-500/20 to-red-600/10",
    },
    {
      label: "Total Guests",
      value: totalGuests,
      icon: UserPlus,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950/50",
      gradient: "from-purple-500/20 to-purple-600/10",
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 scale-90"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="glass-card shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            <CardContent className="p-4 md:p-6 relative">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <motion.div
                  className={`rounded-xl p-2 md:p-3 ${stat.bgColor}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                </motion.div>
                <motion.p
                  className="text-2xl md:text-3xl font-bold tabular-nums"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
