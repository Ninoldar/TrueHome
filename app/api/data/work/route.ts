import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const workSchema = z.object({
  propertyId: z.string(),
  workType: z.string(),
  description: z.string(),
  contractor: z.string().optional(),
  contractorLicense: z.string().optional(),
  workDate: z.string(),
  cost: z.number().optional(),
  permitNumber: z.string().optional(),
  permitIssued: z.boolean().optional(),
  warrantyYears: z.number().int().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = workSchema.parse(body)

    // Calculate warranty expiration if warranty years provided
    let warrantyExpires: Date | null = null
    if (validatedData.warrantyYears) {
      const workDate = new Date(validatedData.workDate)
      warrantyExpires = new Date(workDate)
      warrantyExpires.setFullYear(warrantyExpires.getFullYear() + validatedData.warrantyYears)
    }

    const workRecord = await prisma.workRecord.create({
      data: {
        propertyId: validatedData.propertyId,
        workType: validatedData.workType,
        description: validatedData.description,
        contractor: validatedData.contractor,
        contractorLicense: validatedData.contractorLicense,
        workDate: new Date(validatedData.workDate),
        cost: validatedData.cost,
        permitNumber: validatedData.permitNumber,
        permitIssued: validatedData.permitIssued || false,
        warrantyYears: validatedData.warrantyYears,
        warrantyExpires,
      },
    })

    return NextResponse.json({ workRecord }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating work record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

