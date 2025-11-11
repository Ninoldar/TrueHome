import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Search properties by address, city, or zip code
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query } },
          { city: { contains: query } },
          { zipCode: { contains: query } },
        ],
      },
      take: 10,
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        propertyType: true,
      },
      orderBy: {
        address: 'asc',
      },
    })

    const suggestions = properties.map((prop) => ({
      id: prop.id,
      label: `${prop.address}, ${prop.city}, ${prop.state} ${prop.zipCode}`,
      address: prop.address,
      city: prop.city,
      state: prop.state,
      zipCode: prop.zipCode,
      propertyType: prop.propertyType,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error in autocomplete:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

