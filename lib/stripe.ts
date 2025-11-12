import Stripe from 'stripe'

// Initialize Stripe only if secret key is available
// This allows the app to build even without Stripe configured
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null

export const PRICING = {
  SINGLE: { credits: 1, price: 49.99, name: 'Single Report' },
  PACK_3: { credits: 3, price: 139.99, name: '3-Pack' },
  PACK_5: { credits: 5, price: 229.99, name: '5-Pack' },
  PACK_10: { credits: 10, price: 449.99, name: '10-Pack' },
} as const

export type PackType = keyof typeof PRICING

