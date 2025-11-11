import { PropertyWithHistory, ReportData, Recommendation, TimelineEvent } from './types'
import { isAfter, isBefore, subYears, subMonths } from 'date-fns'

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

  const unresolvedTitleIssues = property.titleIssues.filter(t => !t.isResolved).length
  
  const currentUsage = property.usageHistory.find(u => u.isCurrent)?.usageType || null
  
  const environmentalFlags = property.environmentalAssessments.filter(e => 
    e.result === 'Fail' || e.result === 'Presence Detected'
  ).length

  const now = new Date()
  const overdueMaintenance = property.maintenanceRecords.filter(m => {
    if (!m.nextDueDate) return false
    return isBefore(new Date(m.nextDueDate), now)
  }).length

  const riskScore = calculateRiskScore(property)
  const recommendations = generateRecommendations(property, sales, activeWarranties)
  const timeline = generateTimeline(property)

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
      unresolvedTitleIssues,
      currentUsage,
      environmentalFlags,
      overdueMaintenance,
    },
    riskScore,
    recommendations,
    timeline,
  }
}

function calculateRiskScore(property: PropertyWithHistory): ReportData['riskScore'] {
  let titleRisk = 0
  let structuralRisk = 0
  let environmentalRisk = 0
  let maintenanceRisk = 0
  let financialRisk = 0

  const now = new Date()

  // Title Risk (0-25 points)
  const unresolvedTitleIssues = property.titleIssues.filter(t => !t.isResolved)
  titleRisk = Math.min(unresolvedTitleIssues.length * 8, 25)
  
  const foreclosures = property.salesHistory.filter(s => s.saleType === 'Foreclosure').length
  titleRisk += Math.min(foreclosures * 5, 10)

  // Structural Risk (0-25 points)
  const recentClaims = property.insuranceClaims.filter(c =>
    isAfter(new Date(c.claimDate), subYears(now, 5))
  )
  structuralRisk = Math.min(recentClaims.length * 5, 15)
  
  const unpermittedWork = property.workHistory.filter(w => 
    !w.permitIssued && w.workType !== 'Cosmetic'
  )
  structuralRisk += Math.min(unpermittedWork.length * 2, 10)

  // Environmental Risk (0-20 points)
  const failedAssessments = property.environmentalAssessments.filter(e => 
    e.result === 'Fail' || e.result === 'Presence Detected'
  )
  environmentalRisk = Math.min(failedAssessments.length * 5, 20)

  // Maintenance Risk (0-15 points)
  const overdueMaintenance = property.maintenanceRecords.filter(m => {
    if (!m.nextDueDate) return false
    return isBefore(new Date(m.nextDueDate), now)
  })
  maintenanceRisk = Math.min(overdueMaintenance.length * 3, 15)

  // Financial Risk (0-15 points)
  const frequentSales = property.salesHistory.filter(s =>
    isAfter(new Date(s.saleDate), subYears(now, 5))
  )
  if (frequentSales.length >= 3) {
    financialRisk = 10
  }

  const overall = Math.min(
    titleRisk + structuralRisk + environmentalRisk + maintenanceRisk + financialRisk,
    100
  )

  return {
    overall,
    categories: {
      title: titleRisk,
      structural: structuralRisk,
      environmental: environmentalRisk,
      maintenance: maintenanceRisk,
      financial: financialRisk,
    },
  }
}

function generateTimeline(property: PropertyWithHistory): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Sales
  property.salesHistory.forEach(sale => {
    events.push({
      date: new Date(sale.saleDate),
      type: 'sale',
      title: `Property Sold - $${sale.salePrice.toLocaleString()}`,
      description: `${sale.saleType} sale${sale.buyerName ? ` to ${sale.buyerName}` : ''}`,
      priority: sale.saleType === 'Foreclosure' ? 'high' : 'medium',
    })
  })

  // Work Records
  property.workHistory.forEach(work => {
    events.push({
      date: new Date(work.workDate),
      type: 'work',
      title: `${work.workType} - ${work.description}`,
      description: work.contractor || 'Work performed',
      priority: work.permitIssued ? 'low' : 'high',
    })
  })

  // Insurance Claims
  property.insuranceClaims.forEach(claim => {
    events.push({
      date: new Date(claim.claimDate),
      type: 'claim',
      title: `Insurance Claim - ${claim.claimType}`,
      description: claim.status,
      priority: 'high',
    })
  })

  // Title Issues
  property.titleIssues.forEach(issue => {
    events.push({
      date: new Date(issue.recordedDate),
      type: 'title',
      title: `Title Issue - ${issue.issueType}`,
      description: issue.description,
      priority: issue.isResolved ? 'low' : 'high',
    })
  })

  // Usage History
  property.usageHistory.forEach(usage => {
    events.push({
      date: new Date(usage.startDate),
      type: 'usage',
      title: `Usage Change - ${usage.usageType}`,
      description: usage.notes || '',
      priority: usage.usageType === 'Rental' ? 'medium' : 'low',
    })
  })

  // Environmental Assessments
  property.environmentalAssessments.forEach(assessment => {
    events.push({
      date: new Date(assessment.assessmentDate),
      type: 'environmental',
      title: `${assessment.assessmentType} Assessment`,
      description: `Result: ${assessment.result}`,
      priority: assessment.result === 'Fail' || assessment.result === 'Presence Detected' ? 'high' : 'low',
    })
  })

  // Maintenance Records
  property.maintenanceRecords.forEach(maintenance => {
    events.push({
      date: new Date(maintenance.serviceDate),
      type: 'maintenance',
      title: `${maintenance.maintenanceType}`,
      description: maintenance.notes || 'Maintenance performed',
      priority: 'low',
    })
  })

  // Sort by date (newest first)
  return events.sort((a, b) => b.date.getTime() - a.date.getTime())
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

  // Check for unresolved title issues
  const unresolvedTitleIssues = property.titleIssues.filter(t => !t.isResolved)
  if (unresolvedTitleIssues.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Title Issues',
      title: 'Unresolved Title Issues',
      description: `There are ${unresolvedTitleIssues.length} unresolved title issue(s). This may affect property transfer and financing.`,
      priority: 'high',
    })
  }

  // Check for foreclosures
  const foreclosures = sales.filter(s => s.saleType === 'Foreclosure')
  if (foreclosures.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Financial History',
      title: 'Foreclosure History',
      description: `This property has ${foreclosures.length} foreclosure(s) in its history. Review financial records carefully.`,
      priority: 'high',
    })
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

  // Check for environmental issues
  const environmentalIssues = property.environmentalAssessments.filter(e =>
    e.result === 'Fail' || e.result === 'Presence Detected'
  )
  if (environmentalIssues.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Environmental',
      title: 'Environmental Concerns',
      description: `Environmental assessments have identified ${environmentalIssues.length} issue(s). Review assessment details and remediation requirements.`,
      priority: 'high',
    })
  }

  // Check for rental usage
  const currentRental = property.usageHistory.find(u => 
    u.isCurrent && (u.usageType === 'Rental' || u.usageType === 'Short-term Rental')
  )
  if (currentRental) {
    recommendations.push({
      type: 'info',
      category: 'Usage',
      title: 'Current Rental Property',
      description: `This property is currently used as ${currentRental.usageType.toLowerCase()}. Consider wear and tear implications.`,
      priority: 'medium',
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

  // Check for overdue maintenance
  const overdueMaintenance = property.maintenanceRecords.filter(m => {
    if (!m.nextDueDate) return false
    return isBefore(new Date(m.nextDueDate), now)
  })
  if (overdueMaintenance.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'Maintenance',
      title: 'Overdue Maintenance',
      description: `${overdueMaintenance.length} maintenance item(s) are overdue. Schedule inspections and servicing.`,
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
