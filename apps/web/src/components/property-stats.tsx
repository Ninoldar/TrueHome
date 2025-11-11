import { Card } from "../components/ui/card"
import { Home, Calendar, Ruler, Bed } from "lucide-react"

const stats = [
  {
    label: "Year Built",
    value: "1987",
    icon: Calendar,
    subtext: "37 years old",
  },
  {
    label: "Living Area",
    value: "2,845",
    unit: "sq ft",
    icon: Ruler,
    subtext: "Above avg for area",
  },
  {
    label: "Bedrooms",
    value: "4",
    icon: Bed,
    subtext: "3 full, 1 half bath",
  },
  {
    label: "Property Type",
    value: "Single Family",
    icon: Home,
    subtext: "Detached",
  },
]

export function PropertyStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
