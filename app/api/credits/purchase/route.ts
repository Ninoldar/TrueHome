import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

/**
 * This endpoint is deprecated in favor of Stripe Checkout.
 * Credits are now created via Stripe webhook after successful payment.
 * 
 * Keeping this for backwards compatibility, but it should not be used.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Please use Stripe Checkout via /api/checkout' },
    { status: 400 }
  )
}

