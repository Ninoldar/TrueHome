import { FileText, History, AlertCircle, TrendingUp, Shield, Clock } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"

const features = [
  {
    icon: History,
    title: "Complete Ownership History",
    description:
      "Track every owner, sale price, and transaction since the property was built. Identify red flags and ownership patterns.",
    highlight: true,
  },
  {
    icon: FileText,
    title: "Permits & Renovations",
    description: "See all building permits, renovations, and improvements made to the property over time.",
  },
  {
    icon: AlertCircle,
    title: "Problem Detection",
    description: "Discover past issues including insurance claims, flood history, foundation problems, and more.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Compare with similar properties and understand market trends in the neighborhood.",
  },
  {
    icon: Shield,
    title: "Title & Liens",
    description: "Verify clean title, uncover liens, easements, and any legal issues attached to the property.",
  },
  {
    icon: Clock,
    title: "Instant Reports",
    description: "Get comprehensive reports in seconds. No waiting, no hassle. Download and share easily.",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
            Everything you need to know before buying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Our comprehensive reports reveal the complete story behind every property.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className={feature.highlight ? "border-primary/50 bg-primary/5" : ""}>
              <CardContent className="p-6 space-y-4">
                <div className="rounded-lg bg-primary/10 w-fit p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
