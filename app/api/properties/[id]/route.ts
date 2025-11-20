import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        sales: {
          orderBy: { saleDate: 'desc' },
          take: 10
        },
        ownershipEvents: {
          orderBy: { fromDate: 'desc' },
          take: 10
        },
        workEvents: {
          orderBy: { workDate: 'desc' },
          take: 20,
          select: {
            id: true,
            workType: true,
            description: true,
            workDate: true,
            verificationStatus: true,
            warrantyPeriodMonths: true,
            warrantyExpirationDate: true,
            warrantyType: true,
            warrantyDetails: true,
          }
        },
        permits: {
          orderBy: { issuedDate: 'desc' },
          take: 20
        }
      }
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
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

