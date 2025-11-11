import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@truehome/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        ownershipEvents: {
          orderBy: { fromDate: 'desc' },
        },
        sales: {
          orderBy: { saleDate: 'desc' },
        },
        permits: {
          orderBy: { issuedDate: 'desc' },
        },
        workEvents: {
          include: {
            contractor: true,
            insuranceClaim: true,
          },
          orderBy: { workDate: 'desc' },
        },
        rentalSignals: {
          orderBy: { startDate: 'desc' },
        },
        insuranceClaims: {
          include: {
            contractor: true,
            workEvents: {
              include: {
                contractor: true,
              },
            },
          },
          orderBy: { claimDate: 'desc' },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { error: 'Failed to get property' },
      { status: 500 }
    )
  }
}
