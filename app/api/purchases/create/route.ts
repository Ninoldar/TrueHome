import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const purchaseSchema = z.object({
  userId: z.string(),
  reportId: z.string(),
  paymentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = purchaseSchema.parse(body)

    // Verify report exists
    const report = await prisma.report.findUnique({
      where: { id: validatedData.reportId },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: validatedData.userId,
        reportId: validatedData.reportId,
        amount: report.price,
        paymentId: validatedData.paymentId,
        status: validatedData.paymentId ? 'COMPLETED' : 'PENDING',
      },
      include: {
        report: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ purchase }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating purchase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

