import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Get metadata from the session
      const userId = session.metadata?.userId
      const packType = session.metadata?.packType
      const credits = session.metadata?.credits
      const amount = session.metadata?.amount

      if (!userId || !packType || !credits || !amount) {
        console.error('Missing metadata in checkout session:', session.id)
        return NextResponse.json({ received: true })
      }

      // Create credit record
      await prisma.reportCredit.create({
        data: {
          userId,
          credits: parseInt(credits, 10),
          packType,
          amount: parseFloat(amount),
          paymentId: session.payment_intent as string,
          status: 'COMPLETED',
        },
      })

      console.log(`Credits added for user ${userId}: ${credits} credits from ${packType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

