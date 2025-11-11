import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const claimSchema = z.object({
  propertyId: z.string(),
  claimDate: z.string(),
  claimType: z.string(),
  claimAmount: z.number().optional(),
  status: z.string(),
  description: z.string().optional(),
  insuranceCompany: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = claimSchema.parse(body)

    const claim = await prisma.insuranceClaim.create({
      data: {
        propertyId: validatedData.propertyId,
        claimDate: new Date(validatedData.claimDate),
        claimType: validatedData.claimType,
        claimAmount: validatedData.claimAmount,
        status: validatedData.status,
        description: validatedData.description,
        insuranceCompany: validatedData.insuranceCompany,
      },
    })

    return NextResponse.json({ claim }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

