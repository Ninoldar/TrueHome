'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  apn: string | null
  lotSize: number | null
  livingArea: number | null
  bedrooms: number | null
  bathrooms: number | null
  yearBuilt: number | null
  propertyType: string | null
  ownershipEvents: any[]
  sales: any[]
  permits: any[]
  workEvents: any[]
  rentalSignals: any[]
  insuranceClaims: any[]
}

export default function PropertyPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${API_URL}/properties/${params.id}`)
        if (!response.ok) {
          throw new Error('Property not found')
        }
        const data = await response.json()
        setProperty(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading property...</div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link href="/" className="text-primary-600 hover:underline">
            Return to search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Back to Search
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
          <p className="text-gray-600 mt-1">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.apn && (
                  <div>
                    <span className="text-gray-600">APN:</span>
                    <span className="ml-2 font-medium">{property.apn}</span>
                  </div>
                )}
                {property.lotSize && (
                  <div>
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="ml-2 font-medium">{property.lotSize.toLocaleString()} sq ft</span>
                  </div>
                )}
                {property.livingArea && (
                  <div>
                    <span className="text-gray-600">Living Area:</span>
                    <span className="ml-2 font-medium">{property.livingArea.toLocaleString()} sq ft</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div>
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="ml-2 font-medium">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="ml-2 font-medium">{property.bathrooms}</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div>
                    <span className="text-gray-600">Year Built:</span>
                    <span className="ml-2 font-medium">{property.yearBuilt}</span>
                  </div>
                )}
                {property.propertyType && (
                  <div>
                    <span className="text-gray-600">Property Type:</span>
                    <span className="ml-2 font-medium">{property.propertyType}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Ownership History */}
            {property.ownershipEvents.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Ownership History</h2>
                <div className="space-y-4">
                  {property.ownershipEvents.map((event, idx) => (
                    <div key={idx} className="border-l-4 border-primary-500 pl-4">
                      <div className="font-medium">{event.ownerName}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.fromDate).toLocaleDateString()} -{' '}
                        {event.toDate ? new Date(event.toDate).toLocaleDateString() : 'Present'}
                      </div>
                      {event.ownerType && (
                        <div className="text-sm text-gray-500">Type: {event.ownerType}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sales History */}
            {property.sales.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Sales History</h2>
                <div className="space-y-4">
                  {property.sales.map((sale, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4">
                      <div className="font-medium text-lg">
                        ${sale.salePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </div>
                      {sale.buyerName && (
                        <div className="text-sm text-gray-500">Buyer: {sale.buyerName}</div>
                      )}
                      {sale.sellerName && (
                        <div className="text-sm text-gray-500">Seller: {sale.sellerName}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Permits */}
            {property.permits.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Building Permits</h2>
                <div className="space-y-3">
                  {property.permits.map((permit, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <div className="font-medium">{permit.permitType}</div>
                      <div className="text-sm text-gray-600">
                        Permit #: {permit.permitNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        Status: {permit.status}
                      </div>
                      {permit.issuedDate && (
                        <div className="text-sm text-gray-500">
                          Issued: {new Date(permit.issuedDate).toLocaleDateString()}
                        </div>
                      )}
                      {permit.description && (
                        <div className="text-sm text-gray-500 mt-1">{permit.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Events */}
            {property.workEvents.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Contractor Work History</h2>
                <div className="space-y-3">
                  {property.workEvents.map((work, idx) => (
                    <div key={idx} className="border-l-4 border-purple-500 pl-4">
                      <div className="font-medium">{work.workType}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(work.workDate).toLocaleDateString()}
                      </div>
                      {work.contractor && (
                        <div className="text-sm text-gray-500">Contractor: {work.contractor.name}</div>
                      )}
                      {work.cost && (
                        <div className="text-sm text-gray-500">Cost: ${work.cost.toLocaleString()}</div>
                      )}
                      {work.description && (
                        <div className="text-sm text-gray-500 mt-1">{work.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rental History */}
            {property.rentalSignals.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Rental History</h3>
                <div className="space-y-2">
                  {property.rentalSignals.map((rental, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-medium">
                        {rental.startDate && new Date(rental.startDate).toLocaleDateString()} -{' '}
                        {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'Present'}
                      </div>
                      <div className="text-gray-500">Source: {rental.source}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Insurance Claims */}
            {property.insuranceClaims.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Insurance Claims</h3>
                <div className="space-y-2">
                  {property.insuranceClaims.map((claim, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-medium">{claim.claimType}</div>
                      <div className="text-gray-600">
                        {new Date(claim.claimDate).toLocaleDateString()}
                      </div>
                      {claim.amount && (
                        <div className="text-gray-500">Amount: ${claim.amount.toLocaleString()}</div>
                      )}
                      {claim.status && (
                        <div className="text-gray-500">Status: {claim.status}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Generate Report Button */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Generate Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a comprehensive PDF report of this property's history
              </p>
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Generate Report
              </button>
            </section>

            {/* Quick Stats */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales:</span>
                  <span className="font-medium">{property.sales.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Permits:</span>
                  <span className="font-medium">{property.permits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Work Events:</span>
                  <span className="font-medium">{property.workEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ownership Changes:</span>
                  <span className="font-medium">{property.ownershipEvents.length}</span>
                </div>
                {property.insuranceClaims.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance Claims:</span>
                    <span className="font-medium">{property.insuranceClaims.length}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

