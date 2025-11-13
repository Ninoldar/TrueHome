'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string | null
  yearBuilt: number | null
  squareFeet: number | null
  source: string
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
    dataSource: string
    enteredByUser?: {
      id: string
      name: string | null
      email: string | null
    } | null
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
  maintenanceRecords: Array<{
    id: string
    maintenanceType: string
    serviceDate: string
    serviceProvider: string | null
    notes: string | null
    cost: number | null
    dataSource: string
    enteredByUser?: {
      id: string
      name: string | null
      email: string | null
    } | null
  }>
}

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const propertyId = params.id as string

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setLoading(false)
        return
      }
      try {
        console.log('Fetching property with ID:', propertyId)
        const response = await fetch(`/api/properties/${propertyId}`)
        const data = await response.json()
        console.log('API Response:', { status: response.status, ok: response.ok, hasProperty: !!data.property })
        
        if (response.ok && data.property) {
          setProperty(data.property)
        } else {
          console.error('Property not found:', data.error, 'Property ID:', propertyId, 'Response:', data)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [propertyId])

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      })
      const data = await response.json()
      if (response.ok) {
        setReportId(data.report.id)
        router.push(`/report/${data.report.id}`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setGeneratingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-destructive">Property not found</div>
      </div>
    )
  }

  const activeWarranties = property.warranties.filter(w => w.isActive)
  const expiredWarranties = property.warranties.filter(w => !w.isActive)

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {property.address}
          </h1>
          <p className="text-lg text-muted-foreground">
            {property.city}, {property.state} {property.zipCode}
          </p>
          {property.source === 'USER' && (
            <span className="inline-flex items-center gap-2 mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Self-entered property
            </span>
          )}
          {property.propertyType && (
            <p className="text-sm text-muted-foreground mt-1">
              {property.propertyType}
              {property.yearBuilt && ` • Built ${property.yearBuilt}`}
              {property.squareFeet && ` • ${property.squareFeet.toLocaleString()} sq ft`}
            </p>
          )}
        </div>

        {/* Generate Report Button */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Property History Report
              </h2>
              <p className="text-muted-foreground">
                Get a comprehensive report with recommendations and analysis
              </p>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              size="lg"
            >
              {generatingReport ? 'Generating...' : 'Generate Report - $49.99'}
            </Button>
          </div>
        </div>

        {/* Sales History */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Sales History ({property.salesHistory.length})
          </h2>
          {property.salesHistory.length > 0 ? (
            <div className="space-y-4">
              {property.salesHistory.map((sale) => (
                <div key={sale.id} className="border-l-4 border-primary pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">
                        ${sale.salePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(sale.saleDate), 'MMMM d, yyyy')} • {sale.saleType}
                      </p>
                      {sale.buyerName && (
                        <p className="text-xs text-muted-foreground mt-1">Buyer: {sale.buyerName}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No sales history available</p>
          )}
        </div>

        {/* Work History */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Work History ({property.workHistory.length})
          </h2>
          {property.workHistory.length > 0 ? (
            <div className="space-y-4">
              {property.workHistory.map((work) => (
                <div key={work.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{work.workType}</p>
                      <p className="text-sm text-muted-foreground">{work.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(work.workDate), 'MMMM d, yyyy')}
                        {work.contractor && ` • ${work.contractor}`}
                        {work.cost && ` • $${work.cost.toLocaleString()}`}
                      </p>
                      {work.warrantyExpires && (
                        <p className="text-xs text-green-600 mt-1">
                          Warranty expires: {format(new Date(work.warrantyExpires), 'MMMM d, yyyy')}
                        </p>
                      )}
                      {work.dataSource === 'USER' && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Self-entered
                          {work.enteredByUser?.name && (
                            <span className="text-muted-foreground">
                              • {work.enteredByUser.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No work history available</p>
          )}
        </div>

        {/* Maintenance Records */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Maintenance ({property.maintenanceRecords.length})
          </h2>
          {property.maintenanceRecords.length > 0 ? (
            <div className="space-y-4">
              {property.maintenanceRecords.map((record) => (
                <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div>
                    <p className="font-semibold text-foreground">{record.maintenanceType}</p>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(record.serviceDate), 'MMMM d, yyyy')}
                      {record.serviceProvider && ` • ${record.serviceProvider}`}
                      {record.cost && ` • $${record.cost.toLocaleString()}`}
                    </p>
                    {record.dataSource === 'USER' && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Self-entered
                        {record.enteredByUser?.name && (
                          <span className="text-muted-foreground">
                            • {record.enteredByUser.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No maintenance records available</p>
          )}
        </div>

        {/* Insurance Claims */}
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Insurance Claims ({property.insuranceClaims.length})
          </h2>
          {property.insuranceClaims.length > 0 ? (
            <div className="space-y-4">
              {property.insuranceClaims.map((claim) => (
                <div key={claim.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{claim.claimType}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {claim.status}
                        {claim.claimAmount && ` • $${claim.claimAmount.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(claim.claimDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No insurance claims available</p>
          )}
        </div>

        {/* Warranties */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
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
                    <p className="font-semibold text-foreground">{warranty.warrantyType}</p>
                    <p className="text-sm text-muted-foreground">Provider: {warranty.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {format(new Date(warranty.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expiredWarranties.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-3">
                Expired Warranties ({expiredWarranties.length})
              </h3>
              <div className="space-y-3">
                {expiredWarranties.map((warranty) => (
                  <div key={warranty.id} className="bg-muted border border-border rounded p-4">
                    <p className="font-semibold text-muted-foreground">{warranty.warrantyType}</p>
                    <p className="text-sm text-muted-foreground">Provider: {warranty.provider}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expired: {format(new Date(warranty.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {property.warranties.length === 0 && (
            <p className="text-muted-foreground">No warranties available</p>
          )}
        </div>
      </div>
    </main>
  )
}
