'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'

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
  }
  recommendations: Array<{
    type: 'warning' | 'info' | 'positive'
    category: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export default function ReportPage() {
  const params = useParams()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [params.reportId])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading report...</div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Report not found</div>
      </div>
    )
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      case 'positive':
        return 'border-green-500 bg-green-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800',
    }
    return colors[priority as keyof typeof colors] || colors.low
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Report Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Property History Report
            </h1>
            <p className="text-xl text-gray-600">
              {reportData.property.address}
            </p>
            <p className="text-lg text-gray-500">
              {reportData.property.city}, {reportData.property.state} {reportData.property.zipCode}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {reportData.summary.totalSales}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Sales</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {reportData.summary.totalWorkRecords}
              </div>
              <div className="text-sm text-gray-600 mt-1">Work Records</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {reportData.summary.totalClaims}
              </div>
              <div className="text-sm text-gray-600 mt-1">Insurance Claims</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {reportData.summary.activeWarranties}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active Warranties</div>
            </div>
          </div>

          {reportData.summary.averageSalePrice && (
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-600">
                Average Sale Price: <span className="font-bold text-gray-900">
                  ${reportData.summary.averageSalePrice.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
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
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{rec.category}</p>
                      <p className="text-gray-700">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recommendations available</p>
          )}
        </div>

        {/* Print/Download Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Print Report
          </button>
        </div>
      </div>
    </main>
  )
}

