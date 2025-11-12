'use client'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { 
  Home, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calendar,
  DollarSign,
  Wrench,
  Shield,
  FileText,
  MapPin,
  TrendingUp,
  Clock
} from 'lucide-react'

// Sample report data - comprehensive example
const sampleReportData = {
  property: {
    address: "1234 Oak Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    propertyType: "Single Family Home",
    yearBuilt: 1985,
  },
  summary: {
    totalSales: 4,
    totalWorkRecords: 12,
    totalClaims: 2,
    activeWarranties: 3,
    averageSalePrice: 875000,
    unresolvedTitleIssues: 1,
    currentUsage: "Owner Occupied",
    environmentalFlags: 1,
    overdueMaintenance: 2,
  },
  riskScore: {
    overall: 42,
    categories: {
      title: 8,
      structural: 12,
      environmental: 5,
      maintenance: 6,
      financial: 11,
    },
  },
  salesHistory: [
    {
      saleDate: "2023-06-15",
      salePrice: 950000,
      saleType: "Standard",
      buyerName: "John & Sarah Smith",
      sellerName: "Michael Johnson",
    },
    {
      saleDate: "2018-03-22",
      salePrice: 720000,
      saleType: "Standard",
      buyerName: "Michael Johnson",
      sellerName: "Estate of Robert Williams",
    },
    {
      saleDate: "2012-11-08",
      salePrice: 485000,
      saleType: "Foreclosure",
      buyerName: "ABC Investment Group",
      sellerName: "Previous Owner",
    },
    {
      saleDate: "2005-09-14",
      salePrice: 325000,
      saleType: "Standard",
      buyerName: "Previous Owner",
      sellerName: "Original Builder",
    },
  ],
  workHistory: [
    {
      workDate: "2023-08-10",
      workType: "Roofing",
      description: "Complete roof replacement with 30-year warranty",
      contractor: "TrueHome Certified: Bay Area Roofing Co.",
      cost: 18500,
      permitIssued: true,
    },
    {
      workDate: "2023-05-20",
      workType: "HVAC",
      description: "New central air conditioning system installed",
      contractor: "TrueHome Certified: Climate Control Solutions",
      cost: 12500,
      permitIssued: true,
    },
    {
      workDate: "2022-11-15",
      workType: "Electrical",
      description: "Electrical panel upgrade to 200A service",
      contractor: "TrueHome Certified: SafeWire Electric",
      cost: 4200,
      permitIssued: true,
    },
    {
      workDate: "2021-09-30",
      workType: "Plumbing",
      description: "Complete bathroom renovation - master suite",
      contractor: "TrueHome Certified: AquaFlow Plumbing",
      cost: 28000,
      permitIssued: true,
    },
    {
      workDate: "2020-04-12",
      workType: "Foundation",
      description: "Foundation crack repair and waterproofing",
      contractor: "Foundation Experts Inc.",
      cost: 15000,
      permitIssued: true,
    },
    {
      workDate: "2019-07-22",
      workType: "Kitchen",
      description: "Kitchen remodel with new appliances",
      contractor: "Home Renovations LLC",
      cost: 35000,
      permitIssued: true,
    },
  ],
  insuranceClaims: [
    {
      claimDate: "2021-03-15",
      claimType: "Water Damage",
      claimAmount: 12500,
      status: "Settled",
      description: "Burst pipe in master bathroom - fully repaired",
    },
    {
      claimDate: "2019-11-08",
      claimType: "Storm Damage",
      claimAmount: 8500,
      status: "Settled",
      description: "Roof damage from severe storm - partial replacement",
    },
  ],
  warranties: [
    {
      warrantyType: "Roofing",
      provider: "Bay Area Roofing Co.",
      startDate: "2023-08-10",
      endDate: "2053-08-10",
      isActive: true,
      description: "30-year material and labor warranty",
    },
    {
      warrantyType: "HVAC",
      provider: "Climate Control Solutions",
      startDate: "2023-05-20",
      endDate: "2028-05-20",
      isActive: true,
      description: "5-year parts and labor warranty",
    },
    {
      warrantyType: "Electrical",
      provider: "SafeWire Electric",
      startDate: "2022-11-15",
      endDate: "2027-11-15",
      isActive: true,
      description: "5-year warranty on panel and installation",
    },
  ],
  titleIssues: [
    {
      issueType: "Lien",
      recordedDate: "2012-10-15",
      isResolved: false,
      description: "Unpaid contractor lien from 2012 - amount: $8,500",
      priority: "high",
    },
    {
      issueType: "Easement",
      recordedDate: "2005-01-10",
      isResolved: true,
      description: "Utility easement - resolved and documented",
      priority: "low",
    },
  ],
  usageHistory: [
    {
      usageType: "Owner Occupied",
      startDate: "2023-06-15",
      isCurrent: true,
      notes: "Current owner residence",
    },
    {
      usageType: "Rental",
      startDate: "2018-03-22",
      endDate: "2023-06-14",
      isCurrent: false,
      notes: "Property was rented out for 5 years",
    },
  ],
  environmentalAssessments: [
    {
      assessmentType: "Lead Paint",
      assessmentDate: "2023-06-20",
      result: "Pass",
      notes: "No lead-based paint detected",
    },
    {
      assessmentType: "Radon",
      assessmentDate: "2023-06-20",
      result: "Presence Detected",
      notes: "Radon levels at 4.2 pCi/L - mitigation system recommended",
    },
    {
      assessmentType: "Asbestos",
      assessmentDate: "2023-06-20",
      result: "Pass",
      notes: "No asbestos detected in tested areas",
    },
  ],
  maintenanceRecords: [
    {
      maintenanceType: "HVAC Service",
      serviceDate: "2023-10-15",
      nextDueDate: "2024-10-15",
      notes: "Annual maintenance completed - system in good condition",
      contractor: "Climate Control Solutions",
    },
    {
      maintenanceType: "Gutter Cleaning",
      serviceDate: "2023-09-20",
      nextDueDate: "2024-03-20",
      notes: "Fall cleaning completed",
      contractor: "Home Maintenance Pro",
    },
    {
      maintenanceType: "Plumbing Inspection",
      serviceDate: "2022-06-10",
      nextDueDate: "2023-06-10",
      notes: "Overdue - should be scheduled",
      contractor: "AquaFlow Plumbing",
    },
    {
      maintenanceType: "Electrical Safety Check",
      serviceDate: "2022-11-15",
      nextDueDate: "2024-11-15",
      notes: "Biennial inspection completed",
      contractor: "SafeWire Electric",
    },
  ],
  recommendations: [
    {
      type: "warning",
      category: "Title Issues",
      title: "Unresolved Title Issue",
      description: "There is 1 unresolved title issue (unpaid contractor lien from 2012). This may affect property transfer and financing. Recommend title insurance review.",
      priority: "high",
    },
    {
      type: "warning",
      category: "Environmental",
      title: "Radon Detection",
      description: "Radon levels detected at 4.2 pCi/L. EPA recommends mitigation for levels above 4.0 pCi/L. Consider installing a radon mitigation system.",
      priority: "high",
    },
    {
      type: "warning",
      category: "Maintenance",
      title: "Overdue Maintenance",
      description: "2 maintenance items are overdue (Plumbing Inspection, Electrical Safety Check). Schedule inspections and servicing to maintain property condition.",
      priority: "medium",
    },
    {
      type: "info",
      category: "Usage",
      title: "Previous Rental Property",
      description: "This property was used as a rental from 2018-2023. Consider wear and tear implications and review tenant history.",
      priority: "medium",
    },
    {
      type: "positive",
      category: "Maintenance",
      title: "Recent Major System Updates",
      description: "Major systems have been updated recently: Roofing (2023), HVAC (2023), Electrical (2022). These improvements add significant value.",
      priority: "medium",
    },
    {
      type: "info",
      category: "Financial History",
      title: "Foreclosure History",
      description: "This property has 1 foreclosure in its history (2012). Review financial records carefully and consider impact on property value.",
      priority: "medium",
    },
  ],
  timeline: [
    {
      date: "2023-10-15",
      type: "maintenance",
      title: "HVAC Service - Annual Maintenance",
      description: "Annual maintenance completed - system in good condition",
      priority: "low",
    },
    {
      date: "2023-09-20",
      type: "maintenance",
      title: "Gutter Cleaning - Fall Service",
      description: "Fall cleaning completed",
      priority: "low",
    },
    {
      date: "2023-08-10",
      type: "work",
      title: "Roofing - Complete roof replacement",
      description: "TrueHome Certified: Bay Area Roofing Co. - 30-year warranty",
      priority: "low",
    },
    {
      date: "2023-06-20",
      type: "environmental",
      title: "Environmental Assessments",
      description: "Lead Paint: Pass | Radon: Presence Detected | Asbestos: Pass",
      priority: "high",
    },
    {
      date: "2023-06-15",
      type: "sale",
      title: "Property Sold - $950,000",
      description: "Standard sale to John & Sarah Smith",
      priority: "medium",
    },
    {
      date: "2023-05-20",
      type: "work",
      title: "HVAC - New central air conditioning system",
      description: "TrueHome Certified: Climate Control Solutions - 5-year warranty",
      priority: "low",
    },
    {
      date: "2022-11-15",
      type: "work",
      title: "Electrical - Panel upgrade to 200A",
      description: "TrueHome Certified: SafeWire Electric - 5-year warranty",
      priority: "low",
    },
    {
      date: "2021-09-30",
      type: "work",
      title: "Plumbing - Complete bathroom renovation",
      description: "TrueHome Certified: AquaFlow Plumbing",
      priority: "low",
    },
    {
      date: "2021-03-15",
      type: "claim",
      title: "Insurance Claim - Water Damage",
      description: "Burst pipe in master bathroom - $12,500 settled",
      priority: "high",
    },
    {
      date: "2020-04-12",
      type: "work",
      title: "Foundation - Crack repair and waterproofing",
      description: "Foundation Experts Inc.",
      priority: "low",
    },
  ],
}

export default function SampleReportPage() {
  const router = useRouter()
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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="w-4 h-4" />
      case 'work':
        return <Wrench className="w-4 h-4" />
      case 'claim':
        return <Shield className="w-4 h-4" />
      case 'title':
        return <FileText className="w-4 h-4" />
      case 'maintenance':
        return <Clock className="w-4 h-4" />
      case 'environmental':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Report Header */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Property History Report
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">Sample Report - Full Version</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-sm font-semibold text-primary">SAMPLE</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-xl font-semibold text-foreground">
                    {sampleReportData.property.address}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {sampleReportData.property.city}, {sampleReportData.property.state} {sampleReportData.property.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sampleReportData.property.propertyType} • Built {sampleReportData.property.yearBuilt}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
                <div className="text-3xl font-bold text-primary">
                  {sampleReportData.summary.totalSales}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Sales</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/20">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {sampleReportData.summary.totalWorkRecords}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Work Records</div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-500/20">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {sampleReportData.summary.totalClaims}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Insurance Claims</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {sampleReportData.summary.activeWarranties}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Active Warranties</div>
              </div>
            </div>

            {/* Risk Score */}
            <div className="mt-8 p-6 bg-muted rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Risk Assessment Score
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">
                  <span className={getRiskColor(sampleReportData.riskScore.overall)}>
                    {sampleReportData.riskScore.overall}
                  </span>
                  <span className="text-muted-foreground text-2xl">/100</span>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        sampleReportData.riskScore.overall >= 70 ? 'bg-red-500' :
                        sampleReportData.riskScore.overall >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${sampleReportData.riskScore.overall}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-semibold">{sampleReportData.riskScore.categories.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Structural:</span>
                  <span className="font-semibold">{sampleReportData.riskScore.categories.structural}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Environmental:</span>
                  <span className="font-semibold">{sampleReportData.riskScore.categories.environmental}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Maintenance:</span>
                  <span className="font-semibold">{sampleReportData.riskScore.categories.maintenance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Financial:</span>
                  <span className="font-semibold">{sampleReportData.riskScore.categories.financial}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg text-muted-foreground">
                Average Sale Price: <span className="font-bold text-foreground">
                  ${sampleReportData.summary.averageSalePrice.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Recommendations & Insights
            </h2>
            <div className="space-y-4">
              {sampleReportData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`border-l-4 ${getRecommendationColor(rec.type)} rounded p-4`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
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
          </div>

          {/* Sales History */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Sales History ({sampleReportData.salesHistory.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.salesHistory.map((sale, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        ${sale.salePrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(sale.saleDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      sale.saleType === 'Foreclosure' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {sale.saleType}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    Buyer: {sale.buyerName} • Seller: {sale.sellerName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6" />
              Work History ({sampleReportData.workHistory.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.workHistory.map((work, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{work.workType}</h3>
                        {work.contractor.includes('TrueHome Certified') && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            TrueHome Certified
                          </span>
                        )}
                        {work.permitIssued && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-foreground mb-1">{work.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {work.contractor} • {format(new Date(work.workDate), 'MMMM d, yyyy')}
                      </p>
                      {work.cost && (
                        <p className="text-sm font-medium text-foreground mt-1">
                          Cost: ${work.cost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Claims */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Insurance Claims ({sampleReportData.insuranceClaims.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.insuranceClaims.map((claim, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{claim.claimType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(claim.claimDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${claim.claimAmount.toLocaleString()}
                      </p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                        {claim.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{claim.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warranties */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Active Warranties ({sampleReportData.warranties.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.warranties.map((warranty, index) => (
                <div key={index} className="border border-border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{warranty.warrantyType}</h3>
                      <p className="text-sm text-muted-foreground">{warranty.description}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-foreground">
                      Provider: <span className="font-medium">{warranty.provider}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Valid until: {format(new Date(warranty.endDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title Issues */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Title Issues ({sampleReportData.titleIssues.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.titleIssues.map((issue, index) => (
                <div key={index} className={`border-l-4 rounded p-4 ${
                  issue.isResolved 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{issue.issueType}</h3>
                      <p className="text-sm text-muted-foreground">
                        Recorded: {format(new Date(issue.recordedDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      issue.isResolved
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {issue.isResolved ? 'Resolved' : 'Unresolved'}
                    </span>
                  </div>
                  <p className="text-foreground">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Assessments */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Environmental Assessments ({sampleReportData.environmentalAssessments.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.environmentalAssessments.map((assessment, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  assessment.result === 'Pass' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{assessment.assessmentType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(assessment.assessmentDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      assessment.result === 'Pass'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {assessment.result}
                    </span>
                  </div>
                  <p className="text-foreground">{assessment.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Records */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Maintenance Records ({sampleReportData.maintenanceRecords.length})
            </h2>
            <div className="space-y-4">
              {sampleReportData.maintenanceRecords.map((maintenance, index) => {
                const isOverdue = maintenance.nextDueDate && 
                  new Date(maintenance.nextDueDate) < new Date()
                return (
                  <div key={index} className={`border rounded-lg p-4 ${
                    isOverdue 
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' 
                      : 'border-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{maintenance.maintenanceType}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last Service: {format(new Date(maintenance.serviceDate), 'MMMM d, yyyy')}
                        </p>
                        {maintenance.contractor && (
                          <p className="text-sm text-muted-foreground">
                            Contractor: {maintenance.contractor}
                          </p>
                        )}
                      </div>
                      {isOverdue && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-foreground mb-2">{maintenance.notes}</p>
                    {maintenance.nextDueDate && (
                      <p className="text-sm text-muted-foreground">
                        Next Due: {format(new Date(maintenance.nextDueDate), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Property Timeline
            </h2>
            <div className="space-y-4">
              {sampleReportData.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <div className="text-primary">
                      {getTimelineIcon(event.type)}
                    </div>
                  </div>
                  <div className="flex-1 border-l-2 border-border pl-4 pb-4">
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

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-8 text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Your Full Report?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              This is just a sample. Get a complete, personalized report for any property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base"
                onClick={() => router.push('/pricing')}
              >
                Get Your Report - $49.99
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base"
                onClick={() => router.push('/')}
              >
                Search Properties
              </Button>
            </div>
          </div>

          {/* Print/Download Section */}
          <div className="bg-card rounded-lg shadow-lg p-6 text-center">
            <Button
              onClick={() => window.print()}
              size="lg"
              variant="outline"
            >
              Print Report
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

