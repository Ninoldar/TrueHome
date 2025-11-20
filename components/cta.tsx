import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {"Ready to discover your home's true story?"}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            {"Get started with a property address and receive your comprehensive report in minutes."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter property address..."
                className="h-14 text-base bg-background text-foreground border-0"
              />
            </div>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base">
              <Search className="w-5 h-5 mr-2" />
              {"Search Property"}
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70">
            {"Try it free • No credit card required • Instant access"}
          </p>
        </div>
      </div>
    </section>
  )
}
