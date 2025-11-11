import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, Bell } from "lucide-react"

export function PropertyHero() {
  return (
    <div className="relative bg-secondary text-secondary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('/modern-residential-home-exterior.jpg')] bg-cover bg-center opacity-20" />

      <div className="relative container mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Active Listing
              </Badge>
              <Badge variant="outline" className="border-secondary-foreground/30 text-secondary-foreground">
                Last Updated: Jan 2025
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">2847 Oak Valley Drive</h1>

            <p className="text-xl lg:text-2xl text-secondary-foreground/80">Austin, TX 78704</p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold">$847,000</div>
                <div className="text-sm text-secondary-foreground/70">Current Value</div>
              </div>
              <div className="border-l border-secondary-foreground/20 pl-4 space-y-1">
                <div className="text-3xl font-bold text-primary">+24%</div>
                <div className="text-sm text-secondary-foreground/70">5-Year Growth</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 bg-transparent"
            >
              <Bell className="mr-2 h-4 w-4" />
              Watch
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
