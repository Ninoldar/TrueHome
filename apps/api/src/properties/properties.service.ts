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
          },
          orderBy: { workDate: 'desc' },
        },
        rentalSignals: {
          orderBy: { startDate: 'desc' },
        },
        insuranceClaims: {
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

