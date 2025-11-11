import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, Hammer, Zap } from "lucide-react"

const permits = [
  {
    date: "Aug 2023",
    type: "Renovation",
    description: "Kitchen Remodel",
    details: "Full kitchen renovation including new cabinets, countertops, appliances, and electrical work",
    cost: "$42,000",
    status: "completed",
    contractor: "Austin Kitchen Pros",
    icon: Hammer,
  },
  {
    date: "Mar 2021",
    type: "Replacement",
    description: "Roof Replacement",
    details: "Complete roof replacement with architectural shingles",
    cost: "$18,500",
    status: "completed",
    contractor: "Texas Roofing Co.",
    icon: FileText,
  },
  {
    date: "Nov 2020",
    type: "Installation",
    description: "Fence Installation",
    details: "Privacy fence installation around backyard perimeter",
    cost: "$6,200",
    status: "completed",
    contractor: "Hill Country Fencing",
    icon: CheckCircle2,
  },
  {
    date: "Jul 2015",
    type: "Replacement",
    description: "HVAC System",
    details: "New central air conditioning and heating system with 16 SEER rating",
    cost: "$12,800",
    status: "completed",
    contractor: "Cool Air Solutions",
    icon: Zap,
  },
]

export function PropertyPermits() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Permits & Improvements</h2>
        <p className="text-muted-foreground text-lg">Official building permits and documented property improvements</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {permits.map((permit, index) => {
          const Icon = permit.icon
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="rounded-xl bg-primary/10 p-4 flex items-center justify-center shrink-0 w-fit">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{permit.description}</h3>
                        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                          {permit.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {permit.date} • {permit.contractor}
                      </p>
                    </div>

                    <div className="text-right sm:text-right space-y-1">
                      <p className="text-2xl font-bold text-primary">{permit.cost}</p>
                      <div className="flex items-center gap-1.5 text-sm text-chart-2 justify-end">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="capitalize">{permit.status}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">{permit.details}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
