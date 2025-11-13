import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        salesHistory: {
          orderBy: { saleDate: 'desc' },
        },
        workHistory: {
          orderBy: { workDate: 'desc' },
          include: {
            enteredByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        insuranceClaims: {
          orderBy: { claimDate: 'desc' },
        },
        warranties: {
          orderBy: { endDate: 'desc' },
        },
        titleIssues: {
          orderBy: { recordedDate: 'desc' },
        },
        usageHistory: {
          orderBy: { startDate: 'desc' },
        },
        environmentalAssessments: {
          orderBy: { assessmentDate: 'desc' },
        },
        maintenanceRecords: {
          orderBy: { serviceDate: 'desc' },
          include: {
            enteredByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        claims: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

