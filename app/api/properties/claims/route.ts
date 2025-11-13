import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const claimSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  propertyType: z.string().min(2, 'Property type is required'),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  squareFeet: z.number().int().positive().optional(),
  lotSize: z.number().positive().optional(),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const claims = await prisma.propertyClaim.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        property: true,
      },
      orderBy: {
        claimedAt: 'desc',
      },
    })

    const properties = claims.map((claim) => ({
      claimId: claim.id,
      claimedAt: claim.claimedAt,
      verificationStatus: claim.verificationStatus,
      property: claim.property,
    }))

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Error fetching property claims:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = claimSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      address,
      city,
      state,
      zipCode,
      propertyType,
      yearBuilt,
      squareFeet,
      lotSize,
    } = parsed.data

    // Normalize inputs
    const normalizedAddress = address.trim()
    const normalizedCity = city.trim()
    const normalizedState = state.trim().toUpperCase()
    const normalizedZip = zipCode.trim()
    const normalizedType = propertyType.trim()

    let property = await prisma.property.findUnique({
      where: {
        address_city_state_zipCode: {
          address: normalizedAddress,
          city: normalizedCity,
          state: normalizedState,
          zipCode: normalizedZip,
        },
      },
    })

    if (!property) {
      property = await prisma.property.create({
        data: {
          address: normalizedAddress,
          city: normalizedCity,
          state: normalizedState,
          zipCode: normalizedZip,
          propertyType: normalizedType,
          yearBuilt: yearBuilt ?? null,
          squareFeet: squareFeet ?? null,
          lotSize: lotSize ?? null,
          source: 'USER',
          createdByUserId: session.user.id as string,
        },
      })
    } else {
      const updates: Record<string, any> = {}

      if (!property.yearBuilt && yearBuilt) {
        updates.yearBuilt = yearBuilt
      }
      if (!property.squareFeet && squareFeet) {
        updates.squareFeet = squareFeet
      }
      if (!property.lotSize && lotSize) {
        updates.lotSize = lotSize
      }
      if (!property.propertyType && normalizedType) {
        updates.propertyType = normalizedType
      }

      if (Object.keys(updates).length > 0) {
        property = await prisma.property.update({
          where: { id: property.id },
          data: updates,
        })
      }
    }

    const claim = await prisma.propertyClaim.upsert({
      where: {
        userId_propertyId: {
          userId: session.user.id as string,
          propertyId: property.id,
        },
      },
      update: {
        status: 'ACTIVE',
      },
      create: {
        userId: session.user.id as string,
        propertyId: property.id,
        status: 'ACTIVE',
        verificationStatus: property.source === 'USER' ? 'UNVERIFIED' : 'UNVERIFIED',
      },
      include: {
        property: true,
      },
    })

    return NextResponse.json({
      success: true,
      property: claim.property,
      claim: {
        id: claim.id,
        claimedAt: claim.claimedAt,
        verificationStatus: claim.verificationStatus,
        status: claim.status,
      },
    })
  } catch (error) {
    console.error('Error claiming property:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

