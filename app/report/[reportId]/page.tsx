'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface ReportData {
  property: {
    address: string
    city: string
    state: string
    zipCode: string
    propertyType: string | null
    yearBuilt: number | null
  }
  summary: {
    totalSales: number
    totalWorkRecords: number
    totalClaims: number
    activeWarranties: number
    averageSalePrice: number | null
    unresolvedTitleIssues?: number
    currentUsage?: string | null
    environmentalFlags?: number
    overdueMaintenance?: number
  }
  riskScore?: {
    overall: number
    categories: {
      title: number
      structural: number
      environmental: number
      maintenance: number
      financial: number
    }
  }
  recommendations: Array<{
    type: 'warning' | 'info' | 'positive'
    category: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  timeline?: Array<{
    date: string
    type: string
    title: string
    description: string
    priority: string
  }>
}

export default function ReportPage() {
  const params = useParams()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${params.reportId}`)
        const data = await response.json()
        if (response.ok) {
          setReportData(data.reportData)
        }
      } catch (error) {
        console.error('Error fetching report:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [params.reportId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading report...</div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-destructive">Report not found</div>
      </div>
    )
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'positive':
        return 'border-green-500 bg-green-50 dark:bg-green-950'
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-muted text-muted-foreground',
    }
    return colors[priority as keyof typeof colors] || colors.low
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 dark:text-red-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Report Header */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Property History Report
            </h1>
            <p className="text-xl text-muted-foreground">
              {reportData.property.address}
            </p>
            <p className="text-lg text-muted-foreground">
              {reportData.property.city}, {reportData.property.state} {reportData.property.zipCode}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {reportData.summary.totalSales}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Sales</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {reportData.summary.totalWorkRecords}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Work Records</div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {reportData.summary.totalClaims}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Insurance Claims</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {reportData.summary.activeWarranties}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Warranties</div>
            </div>
          </div>

          {/* Risk Score */}
          {reportData.riskScore && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Risk Assessment</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">
                  <span className={getRiskColor(reportData.riskScore.overall)}>
                    {reportData.riskScore.overall}
                  </span>
                  <span className="text-muted-foreground text-2xl">/100</span>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        reportData.riskScore.overall >= 70 ? 'bg-red-500' :
                        reportData.riskScore.overall >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${reportData.riskScore.overall}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div>Title: {reportData.riskScore.categories.title}</div>
                <div>Structural: {reportData.riskScore.categories.structural}</div>
                <div>Environmental: {reportData.riskScore.categories.environmental}</div>
                <div>Maintenance: {reportData.riskScore.categories.maintenance}</div>
                <div>Financial: {reportData.riskScore.categories.financial}</div>
              </div>
            </div>
          )}

          {reportData.summary.averageSalePrice && (
            <div className="mt-6 text-center">
              <p className="text-lg text-muted-foreground">
                Average Sale Price: <span className="font-bold text-foreground">
                  ${reportData.summary.averageSalePrice.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Recommendations & Insights
          </h2>
          {reportData.recommendations.length > 0 ? (
            <div className="space-y-4">
              {reportData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${getRecommendationColor(rec.type)} rounded p-4`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{rec.category}</p>
                      <p className="text-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recommendations available</p>
          )}
        </div>

        {/* Timeline */}
        {reportData.timeline && reportData.timeline.length > 0 && (
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Property Timeline
            </h2>
            <div className="space-y-4">
              {reportData.timeline.slice(0, 10).map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Print/Download Section */}
        <div className="bg-card rounded-lg shadow-lg p-6 text-center">
          <Button
            onClick={() => window.print()}
            size="lg"
          >
            Print Report
          </Button>
        </div>
      </div>
    </main>
  )
}
