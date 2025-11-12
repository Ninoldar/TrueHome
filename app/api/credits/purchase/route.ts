import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const purchaseSchema = z.object({
  packType: z.enum(['SINGLE', 'PACK_3', 'PACK_5', 'PACK_10']),
  credits: z.number().int().positive(),
  amount: z.number().positive(),
})

const PRICING = {
  SINGLE: { credits: 1, price: 49.99 },
  PACK_3: { credits: 3, price: 139.99 },
  PACK_5: { credits: 5, price: 229.99 },
  PACK_10: { credits: 10, price: 449.99 },
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { packType, credits, amount } = purchaseSchema.parse(body)

    // Validate pricing
    const expectedPricing = PRICING[packType]
    if (credits !== expectedPricing.credits || amount !== expectedPricing.price) {
      return NextResponse.json(
        { error: 'Invalid pricing' },
        { status: 400 }
      )
    }

    // TODO: Integrate with payment processor (Stripe)
    // For now, we'll create the credit record with PENDING status
    // In production, this would only be created after successful payment

    const credit = await prisma.reportCredit.create({
      data: {
        userId: session.user.id as string,
        credits,
        packType,
        amount,
        status: 'COMPLETED', // In production, start as PENDING until payment confirmed
        // expiresAt: null, // Credits never expire
      },
    })

    return NextResponse.json({
      success: true,
      credit: {
        id: credit.id,
        credits: credit.credits,
        packType: credit.packType,
        amount: credit.amount,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error purchasing credits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

