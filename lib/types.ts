import { Property, Sale, WorkRecord, InsuranceClaim, Warranty } from '@prisma/client'

export interface PropertyWithHistory extends Property {
  salesHistory: Sale[]
  workHistory: WorkRecord[]
  insuranceClaims: InsuranceClaim[]
  warranties: Warranty[]
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
  }
  recommendations: Recommendation[]
}

export interface Recommendation {
  type: 'warning' | 'info' | 'positive'
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

