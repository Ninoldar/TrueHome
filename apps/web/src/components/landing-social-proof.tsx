import { Building2, Users, Shield, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "1.2M+",
    label: "Reports Generated",
  },
  {
    icon: Building2,
    value: "50M+",
    label: "Properties Tracked",
  },
  {
    icon: Shield,
    value: "99.8%",
    label: "Data Accuracy",
  },
  {
    icon: TrendingUp,
    value: "$2.4B",
    label: "In Transactions",
  },
]

export function LandingSocialProof() {
  return (
    <section className="border-b bg-muted/30 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
