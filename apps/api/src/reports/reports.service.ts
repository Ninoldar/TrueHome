import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@truehome/db';
import { PropertiesService } from '../properties/properties.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ReportsService {
  constructor(private readonly propertiesService: PropertiesService) {}

  async generateReport(propertyId: string) {
    const property = await this.propertiesService.findById(propertyId);

    // Generate comprehensive report snapshot
    const reportData = {
      property: {
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        apn: property.apn,
        lotSize: property.lotSize,
        livingArea: property.livingArea,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        yearBuilt: property.yearBuilt,
        propertyType: property.propertyType,
      },
      ownershipHistory: property.ownershipEvents,
      salesHistory: property.sales,
      permits: property.permits,
      workHistory: property.workEvents,
      rentalHistory: property.rentalSignals,
      insuranceClaims: property.insuranceClaims,
      generatedAt: new Date().toISOString(),
    };

    // Generate share token
    const shareToken = randomBytes(32).toString('hex');

    const report = await prisma.report.create({
      data: {
        propertyId,
        snapshot: reportData as any,
        shareToken,
      },
    });

    return report;
  }

  async findById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async findByShareToken(token: string) {
    const report = await prisma.report.findUnique({
      where: { shareToken: token },
      include: {
        property: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with token ${token} not found`);
    }

    return report;
  }
}

