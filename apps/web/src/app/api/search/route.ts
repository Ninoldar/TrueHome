import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 })
    }

    const searchTerm = query.trim()

    // Search properties by address, city, zipCode, or APN
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: searchTerm, mode: 'insensitive' } },
          { city: { contains: searchTerm, mode: 'insensitive' } },
          { zipCode: { contains: searchTerm, mode: 'insensitive' } },
          { apn: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: [
        { address: 'asc' },
        { city: 'asc' },
      ],
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        apn: true,
        bedrooms: true,
        bathrooms: true,
        livingArea: true,
        lotSize: true,
        yearBuilt: true,
        propertyType: true,
      },
    })

    return NextResponse.json({ results: properties })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}
