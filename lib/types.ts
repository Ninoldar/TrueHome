import { 
  Property, 
  Sale, 
  WorkRecord, 
  InsuranceClaim, 
  Warranty,
  TitleIssue,
  UsageRecord,
  EnvironmentalAssessment,
  MaintenanceRecord
} from '@prisma/client'

export interface PropertyWithHistory extends Property {
  salesHistory: Sale[]
  workHistory: WorkRecord[]
  insuranceClaims: InsuranceClaim[]
  warranties: Warranty[]
  titleIssues: TitleIssue[]
  usageHistory: UsageRecord[]
  environmentalAssessments: EnvironmentalAssessment[]
  maintenanceRecords: MaintenanceRecord[]
}

export interface ReportData {
  property: PropertyWithHistory
  summary: {
    totalSales: number
    totalWorkRecords: number
    totalClaims: number
    activeWarranties: number
    oldestSale: Date | null
    newestSale: Date | null
    averageSalePrice: number | null
    unresolvedTitleIssues: number
    currentUsage: string | null
    environmentalFlags: number
    overdueMaintenance: number
  }
  riskScore: {
    overall: number // 0-100, higher is riskier
    categories: {
      title: number
      structural: number
      environmental: number
      maintenance: number
      financial: number
    }
  }
  recommendations: Recommendation[]
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  date: Date
  type: 'sale' | 'work' | 'claim' | 'warranty' | 'title' | 'usage' | 'environmental' | 'maintenance'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  type: 'warning' | 'info' | 'positive'
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

