'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Check, FileText, TrendingUp, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const pricingTiers = [
  {
    name: 'Single Report',
    price: 49.99,
    credits: 1,
    packType: 'SINGLE',
    description: 'Perfect for one-time property research',
    features: [
      'Complete property history report',
      'Sales history & price trends',
      'Work records & permits',
      'Insurance claims history',
      'Warranty information',
      'Title issues & liens',
      'Environmental assessments',
      'Maintenance records',
      'Risk score & recommendations',
      'Downloadable PDF report',
    ],
    popular: false,
  },
  {
    name: '3-Pack',
    price: 139.99,
    credits: 3,
    packType: 'PACK_3',
    originalPrice: 149.97,
    savings: 9.98,
    description: 'Great for comparing multiple properties',
    features: [
      '3 complete property reports',
      'Save $9.98 vs. buying individually',
      'All features included',
      'Credits never expire',
      'Use anytime, anywhere',
    ],
    popular: true,
  },
  {
    name: '5-Pack',
    price: 229.99,
    credits: 5,
    packType: 'PACK_5',
    originalPrice: 249.95,
    savings: 19.96,
    description: 'Best value for serious buyers',
    features: [
      '5 complete property reports',
      'Save $19.96 vs. buying individually',
      'All features included',
      'Credits never expire',
      'Use anytime, anywhere',
    ],
    popular: false,
  },
  {
    name: '10-Pack',
    price: 449.99,
    credits: 10,
    packType: 'PACK_10',
    originalPrice: 499.90,
    savings: 49.91,
    description: 'Maximum savings for power users',
    features: [
      '10 complete property reports',
      'Save $49.91 vs. buying individually',
      'All features included',
      'Credits never expire',
      'Use anytime, anywhere',
      'Best per-report price',
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handlePurchase = async (packType: string, credits: number, price: number) => {
    if (!session) {
      router.push(`/signup?redirect=pricing&pack=${packType}`)
      return
    }

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16 mt-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get comprehensive property history reports. Buy individually or save with bulk packs.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pricingTiers.map((tier) => (
              <div
                key={tier.packType}
                className={`relative bg-card border rounded-lg p-6 ${
                  tier.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">
                      ${tier.price.toFixed(2)}
                    </span>
                    {tier.credits > 1 && (
                      <span className="text-muted-foreground ml-2">
                        / ${(tier.price / tier.credits).toFixed(2)} each
                      </span>
                    )}
                  </div>
                  {tier.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground line-through">
                        ${tier.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        Save ${tier.savings?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handlePurchase(tier.packType, tier.credits, tier.price)}
                >
                  {tier.credits === 1 ? 'Buy Report' : `Buy ${tier.credits}-Pack`}
                </Button>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-muted/50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              What's Included in Every Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Complete History
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Full property history including all sales, work records, claims, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Risk Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive risk scoring with category breakdowns and recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Instant Access
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get your report immediately after purchase. No waiting, no delays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Do credits expire?
                </h3>
                <p className="text-muted-foreground">
                  No, your report credits never expire. Use them whenever you need a property report.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Can I share reports with others?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can download and share your reports. Each report is yours to keep and use as needed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, and PayPal. All transactions are secure and encrypted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Can I get a refund?
                </h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your report, contact us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

