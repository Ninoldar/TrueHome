import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { MapPin, Bed, Bath, Ruler, TrendingUp } from "lucide-react"

const comparables = [
  {
    address: "2847 Oak Valley Drive",
    city: "Austin, TX 78704",
    price: "$847,000",
    beds: 4,
    baths: 3.5,
    sqft: "2,845",
    pricePerSqft: "$298",
    status: "Subject Property",
    distance: "N/A",
    isCurrent: true,
  },
  {
    address: "2901 Oak Valley Drive",
    city: "Austin, TX 78704",
    price: "$865,000",
    beds: 4,
    baths: 3,
    sqft: "2,920",
    pricePerSqft: "$296",
    status: "Sold Dec 2024",
    distance: "0.2 miles",
    isCurrent: false,
  },
  {
    address: "1523 Maple Ridge Court",
    city: "Austin, TX 78704",
    price: "$825,000",
    beds: 3,
    baths: 3,
    sqft: "2,750",
    pricePerSqft: "$300",
    status: "Sold Nov 2024",
    distance: "0.4 miles",
    isCurrent: false,
  },
  {
    address: "3142 Valley View Lane",
    city: "Austin, TX 78704",
    price: "$892,000",
    beds: 4,
    baths: 4,
    sqft: "3,015",
    pricePerSqft: "$296",
    status: "Sold Oct 2024",
    distance: "0.6 miles",
    isCurrent: false,
  },
]

export function PropertyComps() {
  return (
    <section className="space-y-6 pb-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-balance">Comparable Properties</h2>
        <p className="text-muted-foreground text-lg">Recent sales of similar homes in the neighborhood</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {comparables.map((comp, index) => (
          <Card
            key={index}
            className={`p-6 hover:shadow-lg transition-all ${comp.isCurrent ? "border-primary border-2" : ""}`}
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg">{comp.address}</h3>
                    {comp.isCurrent && <Badge className="bg-primary text-primary-foreground">Subject Property</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{comp.city}</span>
                    {!comp.isCurrent && (
                      <>
                        <span>•</span>
                        <span>{comp.distance}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <p className="text-3xl font-bold text-primary">{comp.price}</p>
                  <p className="text-sm text-muted-foreground">{comp.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{comp.beds}</p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{comp.baths}</p>
                    <p className="text-xs text-muted-foreground">Baths</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{comp.sqft}</p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{comp.pricePerSqft}</p>
                    <p className="text-xs text-muted-foreground">Per Sq Ft</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
