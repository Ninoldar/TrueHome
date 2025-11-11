import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@truehome/db';

@Injectable()
export class PropertiesService {
  async findById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        ownershipEvents: {
          orderBy: { fromDate: 'desc' },
        },
        sales: {
          orderBy: { saleDate: 'desc' },
        },
        permits: {
          orderBy: { issuedDate: 'desc' },
        },
        workEvents: {
          include: {
            contractor: true,
            insuranceClaim: true,
          },
          orderBy: { workDate: 'desc' },
        },
        rentalSignals: {
          orderBy: { startDate: 'desc' },
        },
        insuranceClaims: {
          include: {
            contractor: true,
            workEvents: {
              include: {
                contractor: true,
              },
            },
          },
          orderBy: { claimDate: 'desc' },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findByApn(apn: string) {
    const property = await prisma.property.findUnique({
      where: { apn },
    });

    if (!property) {
      throw new NotFoundException(`Property with APN ${apn} not found`);
    }

    return this.findById(property.id);
  }

  /**
   * Calculate property risk score (0-100)
   * Lower score = lower risk, higher score = higher risk
   */
  async calculateRiskScore(propertyId: string): Promise<number> {
    const property = await this.findById(propertyId);
    
    let riskScore = 0;
    const maxScore = 100;

    // Insurance claims (higher = more risk)
    const claimCount = property.insuranceClaims.length;
    riskScore += Math.min(claimCount * 10, 30); // Max 30 points

    // High-value claims
    const highValueClaims = property.insuranceClaims.filter(c => c.amount && c.amount > 20000);
    riskScore += highValueClaims.length * 5; // Max 15 points

    // Frequent repairs (indicates ongoing issues)
    const recentWorkEvents = property.workEvents.filter(w => {
      const workDate = new Date(w.workDate);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return workDate > twoYearsAgo;
    });
    if (recentWorkEvents.length > 5) {
      riskScore += 15; // Frequent repairs = potential issues
    }

    // Rental history (more wear and tear)
    const rentalYears = property.rentalSignals.reduce((total, rental) => {
      const start = rental.startDate ? new Date(rental.startDate) : new Date();
      const end = rental.endDate ? new Date(rental.endDate) : new Date();
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    }, 0);
    if (rentalYears > 5) {
      riskScore += 10; // Long rental history
    }

    // Age of property (older = more risk)
    if (property.yearBuilt) {
      const age = new Date().getFullYear() - property.yearBuilt;
      if (age > 30) riskScore += 10;
      if (age > 50) riskScore += 5; // Additional for very old
    }

    // Multiple ownership changes (frequent turnover)
    if (property.ownershipEvents.length > 4) {
      riskScore += 10;
    }

    // Unpermitted work (if we detect it)
    // This would require additional data

    return Math.min(Math.round(riskScore), maxScore);
  }

  /**
   * Get property risk assessment with details
   */
  async getRiskAssessment(propertyId: string) {
    const property = await this.findById(propertyId);
    const riskScore = await this.calculateRiskScore(propertyId);

    const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Moderate' : 'High';
    const riskColor = riskScore < 30 ? 'green' : riskScore < 60 ? 'yellow' : 'red';

    const factors = [];
    
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
      });
    }

    if (property.workEvents.length > 5) {
      factors.push({
        type: 'frequent_repairs',
        severity: 'medium',
        message: `${property.workEvents.length} work events recorded - may indicate ongoing issues`,
      });
    }

    if (property.rentalSignals.length > 0) {
      const rentalYears = property.rentalSignals.reduce((total, rental) => {
        const start = rental.startDate ? new Date(rental.startDate) : new Date();
        const end = rental.endDate ? new Date(rental.endDate) : new Date();
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }, 0);
      if (rentalYears > 3) {
        factors.push({
          type: 'rental_history',
          severity: 'low',
          message: `Property rented for ${rentalYears.toFixed(1)} years - potential for more wear`,
        });
      }
    }

    if (property.yearBuilt && new Date().getFullYear() - property.yearBuilt > 30) {
      factors.push({
        type: 'property_age',
        severity: 'medium',
        message: `Property built in ${property.yearBuilt} - major systems may need attention`,
      });
    }

    return {
      score: riskScore,
      level: riskLevel,
      color: riskColor,
      factors,
      recommendation: this.getRiskRecommendation(riskScore, factors),
    };
  }

  private getRiskRecommendation(score: number, factors: any[]): string {
    if (score < 30) {
      return 'This property shows a low risk profile with minimal concerns.';
    } else if (score < 60) {
      return 'This property has some risk factors to consider. Review the details below.';
    } else {
      return 'This property has multiple risk factors. We recommend a thorough inspection and review of all records.';
    }
  }

  /**
   * Get comprehensive property timeline
   */
  async getTimeline(propertyId: string) {
    const property = await this.findById(propertyId);

    const timeline = [
      ...property.ownershipEvents.map((e) => ({
        type: 'ownership',
        date: e.fromDate,
        title: e.isCurrent ? 'Current Owner' : 'Ownership Change',
        description: `Owner type: ${e.ownerType || 'Unknown'}`,
        icon: '👤',
        data: e,
      })),
      ...property.sales.map((s) => ({
        type: 'sale',
        date: s.saleDate,
        title: `Sale: $${s.salePrice.toLocaleString()}`,
        description: s.saleType || 'Property sale',
        icon: '💰',
        data: s,
      })),
      ...property.permits.map((p) => ({
        type: 'permit',
        date: p.issuedDate || p.createdAt,
        title: `${p.permitType} Permit`,
        description: p.description || p.permitNumber,
        icon: '📋',
        data: p,
      })),
      ...property.workEvents.map((w) => ({
        type: 'work',
        date: w.workDate,
        title: `${w.workType} Work`,
        description: w.description || `Work performed by ${w.contractor?.name || 'contractor'}`,
        icon: '🔧',
        data: w,
      })),
      ...property.insuranceClaims.map((c) => ({
        type: 'insurance',
        date: c.claimDate,
        title: `${c.claimType} Claim`,
        description: c.amount ? `Claim amount: $${c.amount.toLocaleString()}` : 'Insurance claim filed',
        icon: '🛡️',
        data: c,
      })),
      ...property.rentalSignals.map((r) => ({
        type: 'rental',
        date: r.startDate || r.createdAt,
        title: 'Rental Period',
        description: `Property was rented (confidence: ${(r.confidence * 100).toFixed(0)}%)`,
        icon: '🏠',
        data: r,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      property: {
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
      },
      timeline,
      summary: {
        totalEvents: timeline.length,
        byType: {
          ownership: timeline.filter(e => e.type === 'ownership').length,
          sales: timeline.filter(e => e.type === 'sale').length,
          permits: timeline.filter(e => e.type === 'permit').length,
          work: timeline.filter(e => e.type === 'work').length,
          insurance: timeline.filter(e => e.type === 'insurance').length,
          rental: timeline.filter(e => e.type === 'rental').length,
        },
      },
    };
  }

  /**
   * Get comparable properties
   */
  async getComparables(propertyId: string, radiusMiles: number = 1) {
    const property = await this.findById(propertyId);
    
    if (!property.latitude || !property.longitude) {
      // If no coordinates, search by city and similar characteristics
      const comps = await prisma.property.findMany({
        where: {
          AND: [
            { city: property.city },
            { id: { not: propertyId } },
            property.livingArea ? {
              livingArea: {
                gte: property.livingArea * 0.8,
                lte: property.livingArea * 1.2,
              },
            } : {},
            property.bedrooms ? {
              bedrooms: property.bedrooms,
            } : {},
          ],
        },
        include: {
          sales: {
            orderBy: { saleDate: 'desc' },
            take: 1,
          },
        },
        take: 5,
      });

      return comps.map(comp => ({
        id: comp.id,
        address: comp.address,
        city: comp.city,
        livingArea: comp.livingArea,
        bedrooms: comp.bedrooms,
        bathrooms: comp.bathrooms,
        lastSalePrice: comp.sales[0]?.salePrice,
        lastSaleDate: comp.sales[0]?.saleDate,
        pricePerSqFt: comp.sales[0] && comp.livingArea 
          ? comp.sales[0].salePrice / comp.livingArea 
          : null,
      }));
    }

    // TODO: Implement geospatial search when PostGIS is enabled
    // For now, return city-based comparison (already done above)
    return [];
  }

  async getHistory(propertyId: string) {
    const property = await this.findById(propertyId);

    // Combine all historical events into a timeline
    const timeline = [
      ...property.ownershipEvents.map((e) => ({
        type: 'ownership',
        date: e.fromDate,
        data: e,
      })),
      ...property.sales.map((s) => ({
        type: 'sale',
        date: s.saleDate,
        data: s,
      })),
      ...property.permits.map((p) => ({
        type: 'permit',
        date: p.issuedDate || p.createdAt,
        data: p,
      })),
      ...property.workEvents.map((w) => ({
        type: 'work',
        date: w.workDate,
        data: w,
      })),
      ...property.insuranceClaims.map((c) => ({
        type: 'insurance',
        date: c.claimDate,
        data: c,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      property: {
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
      },
      timeline,
    };
  }

  async getPermits(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return prisma.permit.findMany({
      where: { propertyId },
      orderBy: { issuedDate: 'desc' },
    });
  }

  async getSales(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return prisma.sale.findMany({
      where: { propertyId },
      orderBy: { saleDate: 'desc' },
    });
  }

  async getWorkEvents(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return prisma.workEvent.findMany({
      where: { propertyId },
      include: {
        contractor: true,
      },
      orderBy: { workDate: 'desc' },
    });
  }
}
