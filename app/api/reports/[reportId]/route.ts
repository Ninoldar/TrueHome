import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReport } from '@/lib/report-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.reportId },
      include: {
        property: {
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
        },
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Generate report data
    const reportData = generateReport(report.property)

    return NextResponse.json({
      report,
      reportData,
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

