import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { generateReport } from '@/lib/report-generator'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Check if user has available credits
    const activeCredits = await prisma.reportCredit.findMany({
      where: {
        userId: session.user.id as string,
        status: 'COMPLETED',
      },
      include: {
        usedCredits: true,
      },
    })

    let availableCredits = 0
    activeCredits.forEach((credit) => {
      availableCredits += credit.credits - credit.usedCredits.length
    })

    if (availableCredits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase credits to generate a report.' },
        { status: 402 } // Payment Required
      )
    }

    // Find the first credit with available credits
    let creditToUse = null
    for (const credit of activeCredits) {
      const unused = credit.credits - credit.usedCredits.length
      if (unused > 0) {
        creditToUse = credit
        break
      }
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
        creditUsages: {
          create: {
            creditId: creditToUse!.id,
          },
        },
      },
    })

    return NextResponse.json({
      report,
      reportData,
      creditsRemaining: availableCredits - 1,
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

