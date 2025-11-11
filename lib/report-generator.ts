import { PropertyWithHistory, ReportData, Recommendation } from './types'
import { isAfter, isBefore, subYears } from 'date-fns'

export function generateReport(property: PropertyWithHistory): ReportData {
  const sales = property.salesHistory.sort((a, b) => 
    new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime()
  )
  
  const totalSales = sales.length
  const oldestSale = sales.length > 0 ? new Date(sales[0].saleDate) : null
  const newestSale = sales.length > 0 ? new Date(sales[sales.length - 1].saleDate) : null
  const averageSalePrice = sales.length > 0
    ? sales.reduce((sum, sale) => sum + sale.salePrice, 0) / sales.length
    : null

  const activeWarranties = property.warranties.filter(
    w => w.isActive && isAfter(new Date(w.endDate), new Date())
  )

  const recommendations = generateRecommendations(property, sales, activeWarranties)

  return {
    property,
    summary: {
      totalSales,
      totalWorkRecords: property.workHistory.length,
      totalClaims: property.insuranceClaims.length,
      activeWarranties: activeWarranties.length,
      oldestSale,
      newestSale,
      averageSalePrice,
    },
    recommendations,
  }
}

function generateRecommendations(
  property: PropertyWithHistory,
  sales: typeof property.salesHistory,
  activeWarranties: typeof property.warranties
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const now = new Date()

  // Check for frequent sales (red flag)
  if (sales.length >= 3) {
    const recentSales = sales.filter(s => 
      isAfter(new Date(s.saleDate), subYears(now, 5))
    )
    if (recentSales.length >= 3) {
      recommendations.push({
        type: 'warning',
        category: 'Sales History',
        title: 'Frequent Sales Activity',
        description: `This property has been sold ${recentSales.length} times in the last 5 years. This may indicate underlying issues or market volatility.`,
        priority: 'high',
      })
    }
  }

  // Check for insurance claims
  const recentClaims = property.insuranceClaims.filter(c =>
    isAfter(new Date(c.claimDate), subYears(now, 5))
  )
  if (recentClaims.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Insurance',
      title: 'Recent Insurance Claims',
      description: `There have been ${recentClaims.length} insurance claim(s) in the last 5 years. Review claim details for potential property concerns.`,
      priority: recentClaims.length >= 2 ? 'high' : 'medium',
    })
  }

  // Check for major systems work
  const majorSystems = ['Roofing', 'HVAC', 'Plumbing', 'Electrical', 'Foundation']
  const recentMajorWork = property.workHistory.filter(w => {
    const isMajor = majorSystems.some(system => 
      w.workType.toLowerCase().includes(system.toLowerCase())
    )
    return isMajor && isAfter(new Date(w.workDate), subYears(now, 10))
  })

  if (recentMajorWork.length > 0) {
    recommendations.push({
      type: 'positive',
      category: 'Maintenance',
      title: 'Recent Major System Updates',
      description: `Major systems have been updated recently: ${recentMajorWork.map(w => w.workType).join(', ')}.`,
      priority: 'medium',
    })
  }

  // Check warranty status
  const expiringWarranties = activeWarranties.filter(w => {
    const endDate = new Date(w.endDate)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    return isBefore(endDate, sixMonthsFromNow) && isAfter(endDate, now)
  })

  if (expiringWarranties.length > 0) {
    recommendations.push({
      type: 'info',
      category: 'Warranty',
      title: 'Warranties Expiring Soon',
      description: `${expiringWarranties.length} warranty(ies) will expire within 6 months. Consider renewal or inspection.`,
      priority: 'medium',
    })
  }

  // Check for work without permits
  const unpermittedWork = property.workHistory.filter(w => 
    !w.permitIssued && w.workType !== 'Cosmetic'
  )
  if (unpermittedWork.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Compliance',
      title: 'Unpermitted Work Detected',
      description: `Some work was performed without permits. This may affect insurance coverage and resale value.`,
      priority: 'high',
    })
  }

  // Check for old property with no recent work
  if (property.yearBuilt && property.yearBuilt < 1990 && property.workHistory.length === 0) {
    recommendations.push({
      type: 'info',
      category: 'Maintenance',
      title: 'Limited Work History',
      description: 'This older property has no recorded work history. Consider a professional inspection to assess current condition.',
      priority: 'medium',
    })
  }

  return recommendations
}

