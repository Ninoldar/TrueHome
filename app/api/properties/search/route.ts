import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode')

    if (!address || !city || !state) {
      return NextResponse.json(
        { error: 'Address, city, and state are required' },
        { status: 400 }
      )
    }

    const property = await prisma.property.findFirst({
      where: {
        address: { contains: address },
        city: { contains: city },
        state: { contains: state },
        ...(zipCode && { zipCode }),
      },
      include: {
        salesHistory: {
          orderBy: { saleDate: 'desc' },
          take: 5, // Get most recent 5 sales
        },
        workHistory: {
          orderBy: { workDate: 'desc' },
          take: 10,
        },
        insuranceClaims: {
          orderBy: { claimDate: 'desc' },
        },
        warranties: {
          where: { isActive: true },
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
    console.error('Error searching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

