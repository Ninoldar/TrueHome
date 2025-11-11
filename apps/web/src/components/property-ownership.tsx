import { Card } from "../components/ui/card"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Calendar, DollarSign, TrendingUp } from "lucide-react"

const owners = [
  {
    name: "John & Sarah Mitchell",
    period: "2019 - Present",
    duration: "5 years, 5 months",
    purchasePrice: "$680,000",
    currentValue: "$847,000",
    gain: "+24.6%",
    initials: "JM",
  },
  {
    name: "Robert Chen",
    period: "2012 - 2018",
    duration: "6 years, 8 months",
    purchasePrice: "$485,000",
    salePrice: "$680,000",
    gain: "+40.2%",
    initials: "RC",
  },
  {
    name: "The Williams Family",
    period: "2002 - 2012",
    duration: "10 years, 2 months",
    purchasePrice: "$298,000",
    salePrice: "$485,000",
    gain: "+62.8%",
    initials: "WF",
  },
  {
    name: "Original Builder",
    period: "1987 - 2002",
    duration: "15 years",
    purchasePrice: "N/A",
    salePrice: "$298,000",
    gain: "N/A",
    initials: "OB",
  },
]

export function PropertyOwnership() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Ownership History</h2>
        <p className="text-muted-foreground text-lg">Track of every owner and transaction since the home was built</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {owners.map((owner, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-14 w-14 bg-primary text-primary-foreground shrink-0">
                  <AvatarFallback className="text-lg font-semibold">{owner.initials}</AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1 min-w-0">
                  <div>
                    <h3 className="font-semibold text-lg">{owner.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{owner.period}</span>
                      <span>•</span>
                      <span>{owner.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Purchase</span>
                  </div>
                  <p className="font-semibold text-lg">{owner.purchasePrice}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>{owner.salePrice ? "Sale" : "Current"}</span>
                  </div>
                  <p className="font-semibold text-lg">{owner.salePrice || owner.currentValue}</p>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Gain</span>
                  </div>
                  <p className={`font-semibold text-lg ${owner.gain !== "N/A" ? "text-chart-2" : ""}`}>{owner.gain}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
