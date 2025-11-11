import { CheckCircle2, Wrench, ShieldCheck } from "lucide-react"

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
  {
    audience: "Homeowners & Contractors",
    description: "Build and maintain your property's verified history",
    points: [
      "Access TrueHome certified professionals",
      "Automatically log all work to property history",
      "Increase property value with documented improvements",
      "Maintain warranty and service records",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

        {/* TrueHome Certified Professionals Section */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shrink-0">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                TrueHome Certified Professionals Network
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Connect with verified electricians, plumbers, roofers, HVAC specialists, and more. 
                All work performed by TrueHome certified professionals is automatically logged to your 
                property&apos;s permanent history, creating a comprehensive record that increases value and transparency.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Licensed Electricians",
                  "Certified Plumbers",
                  "Professional Roofers",
                  "HVAC Specialists",
                  "General Contractors",
                  "Home Inspectors",
                  "Pest Control Experts",
                  "Landscapers",
                ].map((profession, index) => (
                  <div key={index} className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <Wrench className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{profession}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
