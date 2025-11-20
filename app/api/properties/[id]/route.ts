import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    console.log(`[Property API] Fetching property with ID: ${propertyId}`)

    if (!propertyId) {
      console.log('[Property API] No property ID provided')
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
      console.log(`[Property API] Property not found for ID: ${propertyId}`)
      return NextResponse.json(
        { error: 'Property not found', propertyId },
        { status: 404 }
      )
    }

    console.log(`[Property API] Successfully fetched property: ${property.address}`)
    return NextResponse.json({ property })
  } catch (error) {
    console.error('[Property API] Error fetching property:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('[Property API] Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      { 
        error: 'Failed to fetch property',
        details: errorMessage,
        propertyId: params.id
      },
      { status: 500 }
    )
  }
}

