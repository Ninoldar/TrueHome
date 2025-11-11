import { Search, Database, FileCheck } from "lucide-react"

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Enter Address",
    description:
      "Simply type in the property address you want to research. Works for any residential property in the US.",
  },
  {
    icon: Database,
    number: "02",
    title: "We Scan Records",
    description: "Our system instantly searches millions of public records, databases, and historical archives.",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Get Your Report",
    description: "Receive a comprehensive, easy-to-read report with everything you need to make an informed decision.",
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="border-y bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
            Get insights in three simple steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            From address to answers in seconds. It's that easy.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center space-y-4">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border -z-10" />
              )}

              <div className="relative rounded-full bg-background border-4 border-primary/20 p-6">
                <step.icon className="h-8 w-8 text-primary" />
                <div className="absolute -top-2 -right-2 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                  {step.number}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
