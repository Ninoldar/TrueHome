import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReport } from '@/lib/report-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Fetch property with all related data
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        salesHistory: true,
        workHistory: true,
        insuranceClaims: true,
        warranties: true,
        titleIssues: true,
        usageHistory: true,
        environmentalAssessments: true,
        maintenanceRecords: true,
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Generate report
    const reportData = generateReport(property)

    // Create report record
    const reportNumber = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const report = await prisma.report.create({
      data: {
        propertyId,
        reportNumber,
        price: 49.99, // Default report price
        status: 'GENERATED',
      },
    })

    return NextResponse.json({
      report,
      reportData,
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

