import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const warrantySchema = z.object({
  propertyId: z.string(),
  warrantyType: z.string(),
  provider: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  coverage: z.string().optional(),
  isActive: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = warrantySchema.parse(body)

    const warranty = await prisma.warranty.create({
      data: {
        propertyId: validatedData.propertyId,
        warrantyType: validatedData.warrantyType,
        provider: validatedData.provider,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        coverage: validatedData.coverage,
        isActive: validatedData.isActive ?? true,
      },
    })

    return NextResponse.json({ warranty }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating warranty:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

