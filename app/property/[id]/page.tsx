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
  Shield,
  Award
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
    warrantyPeriodMonths: number | null
    warrantyExpirationDate: string | null
    warrantyType: string | null
    warrantyDetails: string | null
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
          {/* Property Header with Details */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5" />
                  <span className="text-blue-100 text-sm">Property Address</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{property.address}</h1>
                {property.addressLine2 && (
                  <p className="text-xl text-blue-100">{property.addressLine2}</p>
                )}
                <p className="text-xl text-blue-100 mb-4">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                {property.county && (
                  <p className="text-sm text-blue-200 mb-4">{property.county} County</p>
                )}
                
                {/* Property Details in Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {property.yearBuilt && (
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Year Built</div>
                      <div className="text-lg font-semibold">{property.yearBuilt}</div>
                    </div>
                  )}
                  {property.livingArea && (
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Square Feet</div>
                      <div className="text-lg font-semibold">{property.livingArea.toLocaleString()}</div>
                    </div>
                  )}
                  {(property.bedrooms || property.bathrooms) && (
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Bed / Bath</div>
                      <div className="text-lg font-semibold">
                        {property.bedrooms || 'N/A'} / {property.bathrooms || 'N/A'}
                      </div>
                    </div>
                  )}
                  {property.lotSize && (
                    <div>
                      <div className="text-xs text-blue-200 mb-1">Lot Size</div>
                      <div className="text-lg font-semibold">
                        {(property.lotSize / 43560).toFixed(2)} acres
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-100 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Owners</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {property.ownershipEvents?.length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total ownership records</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                <Wrench className="w-5 h-5" />
                <span className="text-sm font-medium">Work History</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {property.workEvents?.length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Maintenance records</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-green-100 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Active Warranties</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {property.workEvents?.filter(w => {
                  if (!w.warrantyExpirationDate) return false
                  return new Date(w.warrantyExpirationDate) > new Date()
                }).length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Warranties in effect</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-100 shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Permits</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {property.permits?.length || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Building permits</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ownership & Sales History (Consolidated) */}
              {(property.ownershipEvents && property.ownershipEvents.length > 0) || (property.sales && property.sales.length > 0) ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Ownership & Sales History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Combine ownership events with sales data */}
                      {property.ownershipEvents.map((event, index) => {
                        // Find corresponding sale if available
                        const relatedSale = property.sales?.find(sale => {
                          const saleDate = new Date(sale.saleDate)
                          const eventFromDate = new Date(event.fromDate)
                          // Check if sale date is close to ownership start date
                          return Math.abs(saleDate.getTime() - eventFromDate.getTime()) < 90 * 24 * 60 * 60 * 1000 // 90 days
                        })

                        return (
                          <div key={event.id} className="border-l-4 border-purple-400 pl-4 py-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{event.ownerName}</span>
                                  {event.isCurrent && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>
                                {event.ownerType && (
                                  <div className="text-sm text-muted-foreground">{event.ownerType}</div>
                                )}
                                <div className="text-sm text-muted-foreground mt-1">
                                  {formatDate(event.fromDate)}
                                  {event.toDate && ` - ${formatDate(event.toDate)}`}
                                  {!event.toDate && event.isCurrent && ' - Present'}
                                </div>
                              </div>
                              {relatedSale && (
                                <div className="text-right ml-4">
                                  <div className="text-xl font-bold text-primary">
                                    {formatCurrency(relatedSale.salePrice)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(relatedSale.saleDate)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Show any sales that don't have matching ownership events */}
                      {property.sales?.filter(sale => {
                        return !property.ownershipEvents?.some(event => {
                          const saleDate = new Date(sale.saleDate)
                          const eventFromDate = new Date(event.fromDate)
                          return Math.abs(saleDate.getTime() - eventFromDate.getTime()) < 90 * 24 * 60 * 60 * 1000
                        })
                      }).map((sale) => (
                        <div key={sale.id} className="border-l-4 border-blue-400 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{formatDate(sale.saleDate)}</div>
                              {sale.buyerName && (
                                <div className="text-sm text-muted-foreground">Buyer: {sale.buyerName}</div>
                              )}
                              {sale.sellerName && (
                                <div className="text-sm text-muted-foreground">Seller: {sale.sellerName}</div>
                              )}
                            </div>
                            <div className="text-right ml-4">
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
              ) : null}

              {/* Remaining Warranties */}
              {property.workEvents && property.workEvents.some(w => {
                if (!w.warrantyExpirationDate) return false
                const expiration = new Date(w.warrantyExpirationDate)
                return expiration > new Date()
              }) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Remaining Warranties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {property.workEvents
                        .filter(w => {
                          if (!w.warrantyExpirationDate) return false
                          const expiration = new Date(w.warrantyExpirationDate)
                          return expiration > new Date()
                        })
                        .map((work) => {
                          const expiration = work.warrantyExpirationDate ? new Date(work.warrantyExpirationDate) : null
                          const daysRemaining = expiration ? Math.ceil((expiration.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
                          const yearsRemaining = daysRemaining ? (daysRemaining / 365).toFixed(1) : null
                          
                          return (
                            <div key={work.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">{work.workType}</span>
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Active</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-1">
                                    Installed: {formatDate(work.workDate)}
                                  </div>
                                  {work.warrantyType && (
                                    <div className="text-sm font-medium mb-1">
                                      {work.warrantyType} Warranty
                                    </div>
                                  )}
                                  {work.warrantyDetails && (
                                    <div className="text-xs text-muted-foreground">{work.warrantyDetails}</div>
                                  )}
                                </div>
                              </div>
                              {expiration && (
                                <div className="pt-3 border-t border-green-200">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Expires:</span>
                                    <span className="font-semibold text-green-700">{formatDate(expiration.toISOString())}</span>
                                  </div>
                                  {yearsRemaining && (
                                    <div className="flex items-center justify-between text-sm mt-1">
                                      <span className="text-muted-foreground">Time Remaining:</span>
                                      <span className="font-semibold text-green-700">~{yearsRemaining} years</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
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
                      {property.workEvents.map((work) => {
                        const hasActiveWarranty = work.warrantyExpirationDate && new Date(work.warrantyExpirationDate) > new Date()
                        
                        return (
                          <div key={work.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{work.workType}</div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  {formatDate(work.workDate)}
                                </div>
                                {work.description && (
                                  <div className="text-sm mb-2">{work.description}</div>
                                )}
                                {hasActiveWarranty && work.warrantyType && (
                                  <div className="flex items-center gap-1 text-xs text-green-700 font-medium mt-2">
                                    <Award className="w-3 h-3" />
                                    <span>
                                      Warranty: {work.warrantyType}
                                      {work.warrantyExpirationDate && (
                                        ` (Expires ${formatDate(work.warrantyExpirationDate)})`
                                      )}
                                    </span>
                                  </div>
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
                        )
                      })}
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
