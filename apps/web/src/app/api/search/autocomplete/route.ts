import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rawQuery = searchParams.get('q')?.trim() || ''
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 8

    if (!rawQuery || rawQuery.length < 2) {
      return NextResponse.json({ suggestions: [] }, { status: 200 })
    }

    const tokens = rawQuery.split(/\s+/).filter(Boolean)
    const firstToken = tokens[0]
    const remainingTokens = tokens.slice(1).join(' ')
    const [addressPart, cityPart] = rawQuery.includes(',')
      ? rawQuery.split(',').map((part) => part.trim())
      : [rawQuery, '']

    const insensitive = 'insensitive' as Prisma.QueryMode

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: rawQuery, mode: insensitive } },
          { city: { contains: rawQuery, mode: insensitive } },
          { zipCode: { contains: rawQuery, mode: insensitive } },
          {
            address: { contains: addressPart, mode: insensitive },
            ...(cityPart && { city: { contains: cityPart, mode: insensitive } }),
          },
          ...(firstToken
            ? [{
                address: { contains: firstToken, mode: insensitive },
                ...(remainingTokens && {
                  city: { contains: remainingTokens, mode: insensitive },
                }),
              }]
            : []),
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

    const suggestions = properties.map((p: { id: string; address: string; city: string; state: string; zipCode: string }) => ({
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
