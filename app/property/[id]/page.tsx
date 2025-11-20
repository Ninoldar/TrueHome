'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Wrench,
  Building2,
  TrendingUp,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Property {
  id: string
  address: string
  addressLine2: string | null
  city: string
  state: string
  zipCode: string
  county: string | null
  apn: string | null
  lotSize: number | null
  livingArea: number | null
  bedrooms: number | null
  bathrooms: number | null
  yearBuilt: number | null
  propertyType: string | null
  latitude: number | null
  longitude: number | null
  sales: Array<{
    id: string
    saleDate: string
    salePrice: number
    buyerName: string | null
    sellerName: string | null
    saleType: string | null
  }>
  ownershipEvents: Array<{
    id: string
    ownerName: string
    ownerType: string | null
    fromDate: string
    toDate: string | null
    isCurrent: boolean
  }>
  workEvents: Array<{
    id: string
    workType: string
    description: string | null
    workDate: string
    verificationStatus: string
  }>
  permits: Array<{
    id: string
    permitNumber: string
    permitType: string
    issuedDate: string | null
    status: string
    description: string | null
  }>
}

export default function PropertyPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/properties/${propertyId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch property')
      }

      const data = await response.json()
      setProperty(data.property)
    } catch (err) {
      console.error('Error fetching property:', err)
      setError(err instanceof Error ? err.message : 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <p>Loading property details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error || 'Property not found'}</p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Property Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5" />
                  <span className="text-blue-100 text-sm">Property Address</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
                {property.addressLine2 && (
                  <p className="text-xl text-blue-100">{property.addressLine2}</p>
                )}
                <p className="text-xl text-blue-100">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                {property.county && (
                  <p className="text-sm text-blue-200 mt-1">{property.county} County</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {property.yearBuilt && (
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Year Built</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
              </div>
            )}
            {property.livingArea && (
              <div className="bg-white rounded-xl p-6 border-2 border-green-100 shadow-sm">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Home className="w-5 h-5" />
                  <span className="text-sm font-medium">Square Feet</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {property.livingArea.toLocaleString()}
                </div>
              </div>
            )}
            {(property.bedrooms || property.bathrooms) && (
              <div className="bg-white rounded-xl p-6 border-2 border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Bed / Bath</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {property.bedrooms || 'N/A'} / {property.bathrooms || 'N/A'}
                </div>
              </div>
            )}
            {property.lotSize && (
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Lot Size</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {property.lotSize.toLocaleString()} sq ft
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {property.propertyType && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Property Type</div>
                        <div className="font-semibold">{property.propertyType}</div>
                      </div>
                    )}
                    {property.apn && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">APN / Parcel ID</div>
                        <div className="font-semibold font-mono text-sm">{property.apn}</div>
                      </div>
                    )}
                    {property.county && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">County</div>
                        <div className="font-semibold">{property.county}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sales History */}
              {property.sales && property.sales.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Sales History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.sales.map((sale) => (
                        <div key={sale.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{formatDate(sale.saleDate)}</div>
                              {sale.buyerName && (
                                <div className="text-sm text-muted-foreground">Buyer: {sale.buyerName}</div>
                              )}
                              {sale.sellerName && (
                                <div className="text-sm text-muted-foreground">Seller: {sale.sellerName}</div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">
                                {formatCurrency(sale.salePrice)}
                              </div>
                              {sale.saleType && (
                                <div className="text-xs text-muted-foreground">{sale.saleType}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ownership History */}
              {property.ownershipEvents && property.ownershipEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Ownership History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.ownershipEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{event.ownerName}</div>
                              {event.ownerType && (
                                <div className="text-sm text-muted-foreground">{event.ownerType}</div>
                              )}
                              <div className="text-sm text-muted-foreground mt-1">
                                {formatDate(event.fromDate)}
                                {event.toDate && ` - ${formatDate(event.toDate)}`}
                                {!event.toDate && event.isCurrent && ' - Present'}
                              </div>
                            </div>
                            {event.isCurrent && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Work History */}
              {property.workEvents && property.workEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Work History & Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.workEvents.map((work) => (
                        <div key={work.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{work.workType}</div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {formatDate(work.workDate)}
                              </div>
                              {work.description && (
                                <div className="text-sm">{work.description}</div>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              work.verificationStatus === 'verified' 
                                ? 'bg-green-100 text-green-800' 
                                : work.verificationStatus === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {work.verificationStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Permits */}
              {property.permits && property.permits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Building Permits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.permits.map((permit) => (
                        <div key={permit.id} className="border rounded-lg p-4">
                          <div className="font-medium">{permit.permitType}</div>
                          <div className="text-sm text-muted-foreground">Permit #{permit.permitNumber}</div>
                          {permit.issuedDate && (
                            <div className="text-sm text-muted-foreground">
                              Issued: {formatDate(permit.issuedDate)}
                            </div>
                          )}
                          {permit.description && (
                            <div className="text-sm text-muted-foreground mt-1">{permit.description}</div>
                          )}
                          <div className="text-sm mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              permit.status.toLowerCase() === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : permit.status.toLowerCase() === 'issued'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {permit.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/pricing">Generate Report</Link>
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/dashboard">Add Update</Link>
                  </Button>
                </CardContent>
              </Card>

              {property.latitude && property.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
