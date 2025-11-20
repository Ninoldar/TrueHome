'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

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

interface RiskAssessment {
  score: number
  level: string
  color: string
  factors: Array<{
    type: string
    severity: string
    message: string
    details?: any[]
  }>
  recommendation: string
}

export default function PropertyPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
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

        // Fetch risk assessment
        try {
          const riskResponse = await fetch(`${API_URL}/properties/${params.id}/risk-assessment`)
          if (riskResponse.ok) {
            const riskData = await riskResponse.json()
            setRiskAssessment(riskData)
          }
        } catch (err) {
          console.warn('Could not load risk assessment:', err)
        }
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
        {/* Risk Assessment Banner */}
        {riskAssessment && (
          <div className={`mb-6 rounded-lg shadow-md p-6 border-l-4 ${
            riskAssessment.color === 'green' ? 'bg-green-50 border-green-500' :
            riskAssessment.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Property Risk Assessment</h2>
              <div className="text-right">
                <div className={`text-4xl font-bold ${
                  riskAssessment.color === 'green' ? 'text-green-700' :
                  riskAssessment.color === 'yellow' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {riskAssessment.score}/100
                </div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              riskAssessment.color === 'green' ? 'bg-green-200 text-green-800' :
              riskAssessment.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {riskAssessment.level} Risk
            </div>
            <p className="mt-3 text-gray-700">{riskAssessment.recommendation}</p>
            {riskAssessment.factors.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-semibold text-gray-700">Key Factors:</div>
                {riskAssessment.factors.map((factor, idx) => (
                  <div key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-300">
                    {factor.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <strong>{property.ownershipEvents.length}</strong> ownership change{property.ownershipEvents.length !== 1 ? 's' : ''} recorded
                    {property.ownershipEvents.filter(e => e.isCurrent).length > 0 && (
                      <span className="ml-2">• Current owner since {new Date(property.ownershipEvents.find(e => e.isCurrent)?.fromDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {property.ownershipEvents.map((event, idx) => {
                    const duration = event.toDate 
                      ? Math.round((new Date(event.toDate).getTime() - new Date(event.fromDate).getTime()) / (1000 * 60 * 60 * 24))
                      : Math.round((new Date().getTime() - new Date(event.fromDate).getTime()) / (1000 * 60 * 60 * 24));
                    const years = Math.floor(duration / 365);
                    const months = Math.floor((duration % 365) / 30);
                    
                    return (
                      <div key={idx} className="border-l-4 border-primary-500 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-lg">
                              {event.isCurrent ? 'Current Owner' : `Previous Owner ${property.ownershipEvents.length - idx}`}
                            </div>
                            {event.ownerType && (
                              <div className="text-sm text-gray-500 mt-1">
                                Type: {event.ownerType}
                              </div>
                            )}
                          </div>
                          {event.isCurrent && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Period:</strong> {new Date(event.fromDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} - {event.toDate ? new Date(event.toDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Present'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Duration:</strong> {years > 0 ? `${years} year${years !== 1 ? 's' : ''} ` : ''}{months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : ''}{years === 0 && months === 0 ? 'Less than a month' : ''}
                          {' '}({duration.toLocaleString()} days)
                        </div>
                        {event.documentRef && (
                          <div className="text-xs text-gray-500 mt-1">
                            Document: {event.documentRef}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Sales History */}
            {property.sales.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Sales History</h2>
                <div className="space-y-4">
                  {property.sales.map((sale, idx) => {
                    // Show first seller only if it looks like a builder/developer
                    const isFirstSale = idx === property.sales.length - 1; // Most recent is last in array
                    const isBuilder = sale.sellerName && (
                      sale.sellerName.toLowerCase().includes('builder') ||
                      sale.sellerName.toLowerCase().includes('corp') ||
                      sale.sellerName.toLowerCase().includes('llc') ||
                      sale.sellerName.toLowerCase().includes('development') ||
                      sale.sellerName.toLowerCase().includes('construction')
                    );
                    const showSeller = isFirstSale && isBuilder;
                    
                    return (
                      <div key={idx} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <div className="font-medium text-lg">
                            ${sale.salePrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(sale.saleDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        {sale.saleType && (
                          <div className="text-sm text-gray-600 mb-1">
                            Type: {sale.saleType}
                          </div>
                        )}
                        {showSeller && (
                          <div className="text-sm text-gray-500 italic">
                            Original Builder: {sale.sellerName}
                          </div>
                        )}
                        {idx < property.sales.length - 1 && (
                          <div className="text-xs text-gray-400 mt-2">
                            {Math.round((new Date(property.sales[idx + 1].saleDate).getTime() - new Date(sale.saleDate).getTime()) / (1000 * 60 * 60 * 24))} days between sales
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {property.sales.length > 1 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Price History:</strong> From ${Math.min(...property.sales.map(s => s.salePrice)).toLocaleString()} 
                      {' '}to ${Math.max(...property.sales.map(s => s.salePrice)).toLocaleString()}
                      {' '}({((Math.max(...property.sales.map(s => s.salePrice)) / Math.min(...property.sales.map(s => s.salePrice)) - 1) * 100).toFixed(1)}% change)
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Permits */}
            {property.permits.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Building Permits & Inspections</h2>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <strong>{property.permits.length}</strong> permit{property.permits.length !== 1 ? 's' : ''} on record
                    {property.permits.filter(p => p.status === 'Completed').length > 0 && (
                      <span className="ml-2">
                        • <strong>{property.permits.filter(p => p.status === 'Completed').length}</strong> completed
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {property.permits.map((permit, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-lg">{permit.permitType}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          permit.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          permit.status === 'Issued' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {permit.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Permit #:</strong> {permit.permitNumber}
                      </div>
                      {permit.jurisdiction && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Jurisdiction:</strong> {permit.jurisdiction}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        {permit.issuedDate && (
                          <div>
                            <strong>Issued:</strong> {new Date(permit.issuedDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                        {permit.completedDate && (
                          <div>
                            <strong>Completed:</strong> {new Date(permit.completedDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                        {permit.issuedDate && permit.completedDate && (
                          <div className="col-span-2 text-xs text-gray-500">
                            Duration: {Math.round((new Date(permit.completedDate).getTime() - new Date(permit.issuedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        )}
                      </div>
                      {permit.description && (
                        <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                          <strong>Details:</strong> {permit.description}
                        </div>
                      )}
                      {permit.contractorName && (
                        <div className="text-sm text-gray-600 mt-2">
                          <strong>Contractor:</strong> {permit.contractorName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Events */}
            {property.workEvents.length > 0 && (
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Contractor Work History & Warranties</h2>
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <strong>{property.workEvents.length}</strong> work event{property.workEvents.length !== 1 ? 's' : ''} recorded
                    {property.workEvents.filter(w => w.cost).length > 0 && (
                      <span className="ml-2">
                        • Total documented: <strong>${property.workEvents
                          .filter(w => w.cost)
                          .reduce((sum, w) => sum + (w.cost || 0), 0)
                          .toLocaleString()}</strong>
                      </span>
                    )}
                    {property.workEvents.filter(w => w.warrantyExpirationDate && new Date(w.warrantyExpirationDate) > new Date()).length > 0 && (
                      <span className="ml-2">
                        • <strong>{property.workEvents.filter(w => w.warrantyExpirationDate && new Date(w.warrantyExpirationDate) > new Date()).length}</strong> active warranty{property.workEvents.filter(w => w.warrantyExpirationDate && new Date(w.warrantyExpirationDate) > new Date()).length !== 1 ? 'ies' : 'y'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {property.workEvents.map((work, idx) => {
                    const warrantyActive = work.warrantyExpirationDate && new Date(work.warrantyExpirationDate) > new Date();
                    const warrantyExpired = work.warrantyExpirationDate && new Date(work.warrantyExpirationDate) <= new Date();
                    const daysUntilExpiry = work.warrantyExpirationDate 
                      ? Math.round((new Date(work.warrantyExpirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null;
                    
                    return (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-lg">{work.workType}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(work.workDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        {work.description && (
                          <div className="text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded">
                            <strong>Work Performed:</strong> {work.description}
                          </div>
                        )}
                        
                        {/* Contractor Information - Prominent */}
                        {work.contractor && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-semibold text-blue-900 mb-1">Contractor Information</div>
                            <div className="text-sm text-gray-700">
                              <div className="font-medium">{work.contractor.name}</div>
                              {work.contractor.licenseNumber && (
                                <div className="text-xs text-gray-600 mt-1">
                                  License: {work.contractor.licenseNumber} ({work.contractor.licenseType || 'General'})
                                </div>
                              )}
                              {work.contractor.phone && (
                                <div className="text-xs text-gray-600">Phone: {work.contractor.phone}</div>
                              )}
                              {work.contractor.email && (
                                <div className="text-xs text-gray-600">Email: {work.contractor.email}</div>
                              )}
                              {work.contractor.website && (
                                <div className="text-xs text-gray-600">
                                  Website: <a href={work.contractor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{work.contractor.website}</a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Warranty Information - Prominent */}
                        {work.warrantyExpirationDate && (
                          <div className={`mb-3 p-3 rounded-lg border ${
                            warrantyActive 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-semibold text-gray-900">Warranty Information</div>
                              {warrantyActive && (
                                <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded font-medium">
                                  Active
                                </span>
                              )}
                              {warrantyExpired && (
                                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded font-medium">
                                  Expired
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                              {work.warrantyType && (
                                <div><strong>Type:</strong> {work.warrantyType}</div>
                              )}
                              {work.warrantyPeriodMonths && (
                                <div><strong>Period:</strong> {work.warrantyPeriodMonths} months</div>
                              )}
                              <div>
                                <strong>Expiration:</strong> {new Date(work.warrantyExpirationDate).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                                {warrantyActive && daysUntilExpiry !== null && (
                                  <span className="ml-2 text-green-700 font-medium">
                                    ({daysUntilExpiry} days remaining)
                                  </span>
                                )}
                                {warrantyExpired && (
                                  <span className="ml-2 text-red-700 font-medium">
                                    (Expired)
                                  </span>
                                )}
                              </div>
                              {work.warrantyDetails && (
                                <div className="text-xs text-gray-600 mt-1">{work.warrantyDetails}</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Insurance Claim Link */}
                        {work.insuranceClaim && (
                          <div className="mb-2 text-xs text-gray-500">
                            Related to: <span className="font-medium">{work.insuranceClaim.claimType}</span> claim from {new Date(work.insuranceClaim.claimDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {work.cost && (
                            <div className="text-gray-600">
                              <strong>Cost:</strong> ${work.cost.toLocaleString()}
                            </div>
                          )}
                          {work.invoiceNumber && (
                            <div className="text-xs text-gray-500">
                              Invoice: {work.invoiceNumber}
                            </div>
                          )}
                          {work.verificationStatus && (
                            <div className="text-xs">
                              <span className={`px-2 py-1 rounded ${
                                work.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                work.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {work.verificationStatus}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                <h3 className="text-xl font-semibold mb-4">Insurance Claims History</h3>
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    <strong>{property.insuranceClaims.length}</strong> claim{property.insuranceClaims.length !== 1 ? 's' : ''} on record
                    {property.insuranceClaims.filter(c => c.amount).length > 0 && (
                      <span className="ml-2">
                        • Total: <strong>${property.insuranceClaims
                          .filter(c => c.amount)
                          .reduce((sum, c) => sum + (c.amount || 0), 0)
                          .toLocaleString()}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {property.insuranceClaims.map((claim, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-lg">{claim.claimType}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(claim.claimDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      {/* Contractor who did the work (if claim-related) */}
                      {(claim.contractor || (claim.workEvents && claim.workEvents.length > 0)) && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-semibold text-blue-900 mb-1">Work Performed By</div>
                          {claim.contractor && (
                            <div className="text-sm text-gray-700">
                              <div className="font-medium">{claim.contractor.name}</div>
                              {claim.contractor.licenseNumber && (
                                <div className="text-xs text-gray-600 mt-1">
                                  License: {claim.contractor.licenseNumber} ({claim.contractor.licenseType || 'General'})
                                </div>
                              )}
                              {claim.contractor.phone && (
                                <div className="text-xs text-gray-600">Phone: {claim.contractor.phone}</div>
                              )}
                            </div>
                          )}
                          {claim.workDescription && (
                            <div className="text-sm text-gray-700 mt-2">
                              <strong>Work:</strong> {claim.workDescription}
                            </div>
                          )}
                          {/* Show work events with warranties */}
                          {claim.workEvents && claim.workEvents.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {claim.workEvents.map((workEvent: any, workIdx: number) => (
                                <div key={workIdx} className="text-xs bg-white p-2 rounded border border-blue-100">
                                  <div className="font-medium">{workEvent.workType}</div>
                                  {workEvent.contractor && (
                                    <div className="text-gray-600">Contractor: {workEvent.contractor.name}</div>
                                  )}
                                  {workEvent.warrantyExpirationDate && (
                                    <div className="text-gray-600">
                                      Warranty expires: {new Date(workEvent.warrantyExpirationDate).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                      {new Date(workEvent.warrantyExpirationDate) > new Date() && (
                                        <span className="ml-1 text-green-700">
                                          (Active - {Math.round((new Date(workEvent.warrantyExpirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {claim.amount && (
                          <div className="text-gray-600">
                            <strong>Amount:</strong> ${claim.amount.toLocaleString()}
                          </div>
                        )}
                        {claim.status && (
                          <div className="text-gray-600">
                            <strong>Status:</strong> 
                            <span className={`ml-1 px-2 py-1 rounded text-xs ${
                              claim.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              claim.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                              claim.status === 'Denied' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                        )}
                        {claim.verificationStatus && (
                          <div className="text-xs text-gray-500">
                            Verification: {claim.verificationStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Generate Report Button */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Generate Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a comprehensive PDF report of this property&apos;s history
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
