import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const propertySchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().min(5),
  propertyType: z.string().optional(),
  yearBuilt: z.number().int().optional(),
  squareFeet: z.number().int().optional(),
  lotSize: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = propertySchema.parse(body)

    // Check if property already exists
    const existing = await prisma.property.findFirst({
      where: {
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Property already exists', propertyId: existing.id },
        { status: 409 }
      )
    }

    const property = await prisma.property.create({
      data: {
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        propertyType: validatedData.propertyType || 'Unknown',
        ...(validatedData.yearBuilt !== undefined && { yearBuilt: validatedData.yearBuilt }),
        ...(validatedData.squareFeet !== undefined && { squareFeet: validatedData.squareFeet }),
        ...(validatedData.lotSize !== undefined && { lotSize: validatedData.lotSize }),
      },
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

