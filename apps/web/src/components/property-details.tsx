import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

const details = [
  {
    category: "Structural",
    status: "excellent",
    items: [
      { label: "Foundation", value: "Concrete Slab", status: "good" },
      { label: "Roof", value: "Architectural Shingle (2021)", status: "excellent" },
      { label: "Exterior", value: "Brick & Siding", status: "good" },
    ],
  },
  {
    category: "Systems",
    status: "good",
    items: [
      { label: "HVAC", value: "Central AC/Heat (2015)", status: "good" },
      { label: "Plumbing", value: "Copper & PEX", status: "good" },
      { label: "Electrical", value: "200 Amp Service", status: "excellent" },
    ],
  },
  {
    category: "Interior",
    status: "excellent",
    items: [
      { label: "Kitchen", value: "Recently Renovated (2023)", status: "excellent" },
      { label: "Flooring", value: "Hardwood & Tile", status: "good" },
      { label: "Windows", value: "Double Pane Vinyl", status: "good" },
    ],
  },
  {
    category: "Lot & Land",
    status: "good",
    items: [
      { label: "Lot Size", value: "0.34 acres (14,810 sq ft)", status: "info" },
      { label: "Landscaping", value: "Mature Trees & Lawn", status: "good" },
      { label: "Fence", value: "Privacy Fence (2020)", status: "good" },
    ],
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "excellent":
      return <CheckCircle2 className="h-4 w-4 text-chart-2" />
    case "good":
      return <CheckCircle2 className="h-4 w-4 text-accent" />
    case "warning":
      return <AlertCircle className="h-4 w-4 text-destructive" />
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "excellent":
      return <Badge className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 border-0">Excellent</Badge>
    case "good":
      return <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-0">Good</Badge>
    case "warning":
      return <Badge variant="destructive">Needs Attention</Badge>
    default:
      return <Badge variant="outline">Info</Badge>
  }
}

export function PropertyDetails() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Property Details</h2>
        <p className="text-muted-foreground text-lg">Comprehensive breakdown of property features and conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{detail.category}</h3>
              {getStatusBadge(detail.status)}
            </div>

            <div className="space-y-3">
              {detail.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <p className="font-medium text-sm">{item.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
