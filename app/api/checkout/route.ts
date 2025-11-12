import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { stripe, PRICING, type PackType } from '@/lib/stripe'

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
    const { packType } = body

    if (!packType || !(packType in PRICING)) {
      return NextResponse.json(
        { error: 'Invalid pack type' },
        { status: 400 }
      )
    }

    const pack = PRICING[packType as PackType]
    const priceInCents = Math.round(pack.price * 100)

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
              description: `${pack.credits} Property Report Credit${pack.credits > 1 ? 's' : ''}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?payment=cancelled`,
      client_reference_id: session.user.id as string,
      metadata: {
        userId: session.user.id as string,
        packType: packType as string,
        credits: pack.credits.toString(),
        amount: pack.price.toString(),
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

