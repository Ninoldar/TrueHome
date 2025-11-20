import { FileText, Clock, Users, Award, MapPin, TrendingUp } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Complete History",
    description: "Access detailed records including ownership changes, renovations, and major repairs.",
  },
  {
    icon: Clock,
    title: "Instant Reports",
    description: "Get comprehensive property reports delivered in minutes, not days.",
  },
  {
    icon: MapPin,
    title: "Neighborhood Insights",
    description: "Understand the area with crime stats, school ratings, and development plans.",
  },
  {
    icon: Award,
    title: "Verified Sources",
    description: "All data sourced from official records, inspections, and trusted databases.",
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Perfect for home buyers, real estate agents, and property investors.",
  },
  {
    icon: TrendingUp,
    title: "Value Insights",
    description: "Discover how past changes have affected property value over time.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {"Everything you need to know about any home"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {"Our comprehensive reports give you the confidence to make one of life's biggest decisions."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
