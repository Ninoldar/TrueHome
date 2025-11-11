import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const saleSchema = z.object({
  propertyId: z.string(),
  saleDate: z.string(),
  salePrice: z.number().positive(),
  buyerName: z.string().optional(),
  sellerName: z.string().optional(),
  saleType: z.string().optional(),
  recordedDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = saleSchema.parse(body)

    const sale = await prisma.sale.create({
      data: {
        propertyId: validatedData.propertyId,
        saleDate: new Date(validatedData.saleDate),
        salePrice: validatedData.salePrice,
        buyerName: validatedData.buyerName,
        sellerName: validatedData.sellerName,
        saleType: validatedData.saleType || 'Standard',
        recordedDate: validatedData.recordedDate ? new Date(validatedData.recordedDate) : null,
      },
    })

    return NextResponse.json({ sale }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

