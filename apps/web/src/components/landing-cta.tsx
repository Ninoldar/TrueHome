import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search } from "lucide-react"

export function LandingCTA() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 lg:p-12 text-center space-y-8 border">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Ready to uncover your home's history?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Join thousands of smart home buyers who trust TrueHome for complete property transparency.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Enter property address..." className="h-12 pl-10 text-base bg-background" />
              </div>
              <Button size="lg" className="h-12 px-8">
                Get Started
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Instant access • Money-back guarantee
          </p>
        </div>
      </div>
    </section>
  )
}
