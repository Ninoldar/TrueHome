import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Search, FileCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-accent font-medium">Trusted by 50,000+ home buyers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              {"Know the full story before you buy"}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              {
                "Get comprehensive property history reports that reveal everything about a home—from past repairs to ownership changes. Make informed decisions with confidence."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base">
                {"Get Your Report"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                {"See Sample Report"}
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">{"Verified Data"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">{"Deep Research"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">{"Instant Access"}</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <img src="/modern-home-facade-with-warm-sunset-lighting.jpg" alt="Beautiful home" className="w-full h-auto rounded-2xl" />
              <div className="absolute -bottom-6 left-8 right-8 bg-background border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{"Report Ready"}</p>
                    <p className="text-sm text-muted-foreground">{"45+ data points analyzed"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-xs text-accent font-medium">{"Live"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
