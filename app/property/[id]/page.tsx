'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string | null
  yearBuilt: number | null
  squareFeet: number | null
  salesHistory: Array<{
    id: string
    saleDate: string
    salePrice: number
    buyerName: string | null
    sellerName: string | null
    saleType: string
  }>
  workHistory: Array<{
    id: string
    workType: string
    description: string
    contractor: string | null
    workDate: string
    cost: number | null
    warrantyExpires: string | null
  }>
  insuranceClaims: Array<{
    id: string
    claimDate: string
    claimType: string
    claimAmount: number | null
    status: string
  }>
  warranties: Array<{
    id: string
    warrantyType: string
    provider: string
    endDate: string
    isActive: boolean
  }>
}

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()
        if (response.ok) {
          setProperty(data.property)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [params.id])

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: params.id }),
      })
      const data = await response.json()
      if (response.ok) {
        setReportId(data.report.id)
        router.push(`/report/${data.report.id}`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGeneratingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Property not found</div>
      </div>
    )
  }

  const activeWarranties = property.warranties.filter(w => w.isActive)
  const expiredWarranties = property.warranties.filter(w => !w.isActive)

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.address}
          </h1>
          <p className="text-lg text-gray-600">
            {property.city}, {property.state} {property.zipCode}
          </p>
          {property.propertyType && (
            <p className="text-sm text-gray-500 mt-1">
              {property.propertyType}
              {property.yearBuilt && ` • Built ${property.yearBuilt}`}
              {property.squareFeet && ` • ${property.squareFeet.toLocaleString()} sq ft`}
            </p>
          )}
        </div>

        {/* Generate Report Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Property History Report
              </h2>
              <p className="text-gray-600">
                Get a comprehensive report with recommendations and analysis
              </p>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {generatingReport ? 'Generating...' : 'Generate Report - $49.99'}
            </button>
          </div>
        </div>

        {/* Sales History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sales History ({property.salesHistory.length})
          </h2>
          {property.salesHistory.length > 0 ? (
            <div className="space-y-4">
              {property.salesHistory.map((sale) => (
                <div key={sale.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        ${sale.salePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(sale.saleDate), 'MMMM d, yyyy')} • {sale.saleType}
                      </p>
                      {sale.buyerName && (
                        <p className="text-xs text-gray-500 mt-1">Buyer: {sale.buyerName}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sales history available</p>
          )}
        </div>

        {/* Work History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Work History ({property.workHistory.length})
          </h2>
          {property.workHistory.length > 0 ? (
            <div className="space-y-4">
              {property.workHistory.map((work) => (
                <div key={work.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{work.workType}</p>
                      <p className="text-sm text-gray-600">{work.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(work.workDate), 'MMMM d, yyyy')}
                        {work.contractor && ` • ${work.contractor}`}
                        {work.cost && ` • $${work.cost.toLocaleString()}`}
                      </p>
                      {work.warrantyExpires && (
                        <p className="text-xs text-green-600 mt-1">
                          Warranty expires: {format(new Date(work.warrantyExpires), 'MMMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No work history available</p>
          )}
        </div>

        {/* Insurance Claims */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Insurance Claims ({property.insuranceClaims.length})
          </h2>
          {property.insuranceClaims.length > 0 ? (
            <div className="space-y-4">
              {property.insuranceClaims.map((claim) => (
                <div key={claim.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{claim.claimType}</p>
                      <p className="text-sm text-gray-600">
                        Status: {claim.status}
                        {claim.claimAmount && ` • $${claim.claimAmount.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(claim.claimDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No insurance claims available</p>
          )}
        </div>

        {/* Warranties */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Warranties ({property.warranties.length})
          </h2>
          {activeWarranties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Active Warranties ({activeWarranties.length})
              </h3>
              <div className="space-y-3">
                {activeWarranties.map((warranty) => (
                  <div key={warranty.id} className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="font-semibold text-gray-900">{warranty.warrantyType}</p>
                    <p className="text-sm text-gray-600">Provider: {warranty.provider}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {format(new Date(warranty.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expiredWarranties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">
                Expired Warranties ({expiredWarranties.length})
              </h3>
              <div className="space-y-3">
                {expiredWarranties.map((warranty) => (
                  <div key={warranty.id} className="bg-gray-50 border border-gray-200 rounded p-4">
                    <p className="font-semibold text-gray-700">{warranty.warrantyType}</p>
                    <p className="text-sm text-gray-600">Provider: {warranty.provider}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expired: {format(new Date(warranty.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {property.warranties.length === 0 && (
            <p className="text-gray-500">No warranties available</p>
          )}
        </div>
      </div>
    </main>
  )
}

