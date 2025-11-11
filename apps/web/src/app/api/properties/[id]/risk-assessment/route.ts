import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@truehome/db'

async function calculateRiskScore(propertyId: string): Promise<number> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      insuranceClaims: true,
      workEvents: true,
      rentalSignals: true,
      ownershipEvents: true,
    },
  })

  if (!property) return 0

  let riskScore = 0
  const maxScore = 100

  // Insurance claims
  const claimCount = property.insuranceClaims.length
  riskScore += Math.min(claimCount * 10, 30)

  // High-value claims
  const highValueClaims = property.insuranceClaims.filter(c => c.amount && c.amount > 20000)
  riskScore += highValueClaims.length * 5

  // Frequent repairs
  const recentWorkEvents = property.workEvents.filter(w => {
    const workDate = new Date(w.workDate)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    return workDate > twoYearsAgo
  })
  if (recentWorkEvents.length > 5) {
    riskScore += 15
  }

  // Rental history
  const rentalYears = property.rentalSignals.reduce((total, rental) => {
    const start = rental.startDate ? new Date(rental.startDate) : new Date()
    const end = rental.endDate ? new Date(rental.endDate) : new Date()
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }, 0)
  if (rentalYears > 5) {
    riskScore += 10
  }

  // Property age
  if (property.yearBuilt) {
    const age = new Date().getFullYear() - property.yearBuilt
    if (age > 30) riskScore += 10
    if (age > 50) riskScore += 5
  }

  // Multiple ownership changes
  if (property.ownershipEvents.length > 4) {
    riskScore += 10
  }

  return Math.min(Math.round(riskScore), maxScore)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        insuranceClaims: true,
        workEvents: true,
        rentalSignals: true,
        ownershipEvents: true,
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const riskScore = await calculateRiskScore(params.id)
    const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Moderate' : 'High'
    const riskColor = riskScore < 30 ? 'green' : riskScore < 60 ? 'yellow' : 'red'

    const factors = []

    if (property.insuranceClaims.length > 0) {
      factors.push({
        type: 'insurance_claims',
        severity: property.insuranceClaims.length > 2 ? 'high' : 'medium',
        message: `${property.insuranceClaims.length} insurance claim${property.insuranceClaims.length !== 1 ? 's' : ''} on record`,
        details: property.insuranceClaims.map(c => ({
          type: c.claimType,
          date: c.claimDate,
          amount: c.amount,
        })),
      })
    }

    if (property.workEvents.length > 5) {
      factors.push({
        type: 'frequent_repairs',
        severity: 'medium',
        message: `${property.workEvents.length} work events recorded - may indicate ongoing issues`,
      })
    }

    if (property.rentalSignals.length > 0) {
      const rentalYears = property.rentalSignals.reduce((total, rental) => {
        const start = rental.startDate ? new Date(rental.startDate) : new Date()
        const end = rental.endDate ? new Date(rental.endDate) : new Date()
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
      }, 0)
      if (rentalYears > 3) {
        factors.push({
          type: 'rental_history',
          severity: 'low',
          message: `Property rented for ${rentalYears.toFixed(1)} years - potential for more wear`,
        })
      }
    }

    if (property.yearBuilt && new Date().getFullYear() - property.yearBuilt > 30) {
      factors.push({
        type: 'property_age',
        severity: 'medium',
        message: `Property built in ${property.yearBuilt} - major systems may need attention`,
      })
    }

    const recommendation = riskScore < 30
      ? 'This property shows a low risk profile with minimal concerns.'
      : riskScore < 60
      ? 'This property has some risk factors to consider. Review the details below.'
      : 'This property has multiple risk factors. We recommend a thorough inspection and review of all records.'

    return NextResponse.json({
      score: riskScore,
      level: riskLevel,
      color: riskColor,
      factors,
      recommendation,
    })
  } catch (error) {
    console.error('Risk assessment error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate risk assessment' },
      { status: 500 }
    )
  }
}
