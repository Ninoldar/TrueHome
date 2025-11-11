"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Home, Hammer, FileText } from "lucide-react"

const events = [
  {
    date: "Jan 2025",
    type: "listing",
    title: "Listed for Sale",
    description: "Property listed at $847,000 by Keller Williams Realty",
    icon: Home,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    date: "Aug 2023",
    type: "permit",
    title: "Kitchen Renovation Permit",
    description: "Full kitchen remodel completed - $42,000 investment",
    icon: Hammer,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    date: "Mar 2019",
    type: "sale",
    title: "Sold",
    description: "Sold for $680,000 to John & Sarah Mitchell",
    icon: TrendingUp,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    date: "Nov 2018",
    type: "listing",
    title: "Listed for Sale",
    description: "Property listed at $665,000 by Century 21",
    icon: Home,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    date: "Jul 2015",
    type: "permit",
    title: "HVAC System Replacement",
    description: "New central AC and heating system installed",
    icon: FileText,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  {
    date: "Apr 2012",
    type: "sale",
    title: "Sold",
    description: "Sold for $485,000 to Robert Chen",
    icon: TrendingUp,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
]

export function PropertyTimeline() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Property Timeline</h2>
        <p className="text-muted-foreground text-lg">Complete history of ownership, sales, and major improvements</p>
      </div>

      <Card className="p-6 lg:p-8">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {events.map((event, index) => {
              const Icon = event.icon
              return (
                <div key={index} className="relative flex gap-6 group">
                  {/* Icon */}
                  <div
                    className={`relative z-10 rounded-full ${event.bgColor} p-3 hidden md:flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${event.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 pb-8 border-b border-border last:border-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${event.color} md:hidden`} />
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {event.date}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </section>
  )
}
