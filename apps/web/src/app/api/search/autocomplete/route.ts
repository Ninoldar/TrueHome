import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 8

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] }, { status: 200 })
    }

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          {
            AND: [
              { address: { contains: query.split(' ')[0], mode: 'insensitive' } },
              { city: { contains: query.split(' ').slice(1).join(' '), mode: 'insensitive' } },
            ],
          },
        ],
      },
      take: limit,
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
      },
    })

    const suggestions = properties.map((p) => ({
      id: p.id,
      fullAddress: `${p.address}, ${p.city}, ${p.state} ${p.zipCode}`,
      address: p.address,
      city: p.city,
      state: p.state,
      zipCode: p.zipCode,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Autocomplete error:', error)
    return NextResponse.json(
      { error: 'Failed to get autocomplete suggestions' },
      { status: 500 }
    )
  }
}

