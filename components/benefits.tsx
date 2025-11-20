import { CheckCircle2 } from "lucide-react"

const benefits = [
  {
    audience: "Home Buyers",
    description: "Make informed decisions with complete transparency",
    points: [
      "Avoid costly surprises after purchase",
      "Negotiate better with detailed insights",
      "Understand true property condition",
      "Compare multiple properties easily",
    ],
  },
  {
    audience: "Real Estate Agents",
    description: "Close deals faster with trusted data",
    points: [
      "Build client trust with transparency",
      "Answer buyer questions confidently",
      "Streamline due diligence process",
      "Stand out from competition",
    ],
  },
  {
    audience: "Property Investors",
    description: "Maximize ROI with data-driven decisions",
    points: [
      "Evaluate true property potential",
      "Identify hidden value opportunities",
      "Assess renovation needs accurately",
      "Track market trends and patterns",
    ],
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {"Built for everyone in real estate"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {"Whether you're buying your first home or managing a portfolio, TrueHome has you covered."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-card border border-border rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{benefit.audience}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>

              <ul className="space-y-4">
                {benefit.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
