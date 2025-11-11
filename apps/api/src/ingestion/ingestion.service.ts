import { Injectable } from '@nestjs/common';
import { prisma } from '@truehome/db';

@Injectable()
export class IngestionService {
  /**
   * Ingest property data from Collin CAD or other sources
   */
  async ingestProperty(data: {
    apn?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
    lotSize?: number;
    livingArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    propertyType?: string;
  }, source: string, sourceId?: string, rawPayload?: any) {
    // Find or create property
    let property = data.apn
      ? await prisma.property.findUnique({ where: { apn: data.apn } })
      : null;

    if (!property) {
      // Try to find by address
      property = await prisma.property.findFirst({
        where: {
          address: { contains: data.address, mode: 'insensitive' },
          city: { equals: data.city, mode: 'insensitive' },
          zipCode: data.zipCode,
        },
      });
    }

    if (!property) {
      // Create new property
      property = await prisma.property.create({
        data: {
          apn: data.apn,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
          lotSize: data.lotSize,
          livingArea: data.livingArea,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          yearBuilt: data.yearBuilt,
          propertyType: data.propertyType,
        },
      });
    } else {
      // Update existing property
      property = await prisma.property.update({
        where: { id: property.id },
        data: {
          apn: data.apn || property.apn,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          latitude: data.latitude ?? property.latitude,
          longitude: data.longitude ?? property.longitude,
          lotSize: data.lotSize ?? property.lotSize,
          livingArea: data.livingArea ?? property.livingArea,
          bedrooms: data.bedrooms ?? property.bedrooms,
          bathrooms: data.bathrooms ?? property.bathrooms,
          yearBuilt: data.yearBuilt ?? property.yearBuilt,
          propertyType: data.propertyType ?? property.propertyType,
        },
      });
    }

    // Record source
    if (sourceId || rawPayload) {
      await prisma.sourceRecord.create({
        data: {
          propertyId: property.id,
          source,
          sourceId,
          rawPayload: rawPayload as any,
        },
      });
    }

    return property;
  }

  /**
   * Ingest ownership event
   */
  async ingestOwnershipEvent(
    propertyId: string,
    data: {
      ownerName: string;
      ownerType?: string;
      fromDate: Date;
      toDate?: Date;
      isCurrent?: boolean;
      documentRef?: string;
    },
    source: string
  ) {
    return prisma.ownershipEvent.create({
      data: {
        propertyId,
        ...data,
        source,
      },
    });
  }

  /**
   * Ingest sale record
   */
  async ingestSale(
    propertyId: string,
    data: {
      saleDate: Date;
      salePrice: number;
      saleType?: string;
      buyerName?: string;
      sellerName?: string;
      documentRef?: string;
    },
    source: string
  ) {
    return prisma.sale.create({
      data: {
        propertyId,
        ...data,
        source,
      },
    });
  }

  /**
   * Ingest permit
   */
  async ingestPermit(
    propertyId: string,
    data: {
      permitNumber: string;
      permitType: string;
      status: string;
      issuedDate?: Date;
      completedDate?: Date;
      expirationDate?: Date;
      description?: string;
      contractorName?: string;
      jurisdiction: string;
    },
    source: string
  ) {
    // Check if permit already exists
    const existing = await prisma.permit.findFirst({
      where: {
        propertyId,
        permitNumber: data.permitNumber,
        jurisdiction: data.jurisdiction,
      },
    });

    if (existing) {
      return prisma.permit.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.permit.create({
      data: {
        propertyId,
        ...data,
        source,
      },
    });
  }

  /**
   * Ingest work event with warranty information
   */
  async ingestWorkEvent(
    propertyId: string,
    data: {
      workType: string;
      description?: string;
      workDate: Date;
      cost?: number;
      invoiceNumber?: string;
      contractorName?: string;
      contractorId?: string;
      warrantyPeriodMonths?: number;
      warrantyType?: string;
      warrantyDetails?: string;
      insuranceClaimId?: string;
    },
    source: string
  ) {
    let contractor = null;
    
    // Find or create contractor
    if (data.contractorId) {
      contractor = await prisma.contractorCompany.findUnique({
        where: { id: data.contractorId },
      });
    } else if (data.contractorName) {
      contractor = await prisma.contractorCompany.findFirst({
        where: { name: data.contractorName },
      });
      
      if (!contractor) {
        contractor = await prisma.contractorCompany.create({
          data: {
            name: data.contractorName,
            state: 'TX',
            verificationStatus: 'pending',
          },
        });
      }
    }

    // Calculate warranty expiration if period is provided
    let warrantyExpirationDate = null;
    if (data.warrantyPeriodMonths && data.workDate) {
      const workDate = new Date(data.workDate);
      warrantyExpirationDate = new Date(workDate);
      warrantyExpirationDate.setMonth(warrantyExpirationDate.getMonth() + data.warrantyPeriodMonths);
    }

    return prisma.workEvent.create({
      data: {
        propertyId,
        contractorId: contractor?.id,
        workType: data.workType,
        description: data.description,
        workDate: data.workDate,
        cost: data.cost,
        invoiceNumber: data.invoiceNumber,
        warrantyPeriodMonths: data.warrantyPeriodMonths,
        warrantyExpirationDate,
        warrantyType: data.warrantyType,
        warrantyDetails: data.warrantyDetails,
        insuranceClaimId: data.insuranceClaimId,
        verificationStatus: 'pending',
      },
    });
  }

  /**
   * Ingest insurance claim with contractor link
   */
  async ingestInsuranceClaim(
    propertyId: string,
    data: {
      claimType: string;
      claimDate: Date;
      amount?: number;
      status?: string;
      contractorName?: string;
      contractorId?: string;
      workDescription?: string;
    },
    source: string
  ) {
    let contractor = null;
    
    // Find or create contractor if provided
    if (data.contractorId) {
      contractor = await prisma.contractorCompany.findUnique({
        where: { id: data.contractorId },
      });
    } else if (data.contractorName) {
      contractor = await prisma.contractorCompany.findFirst({
        where: { name: data.contractorName },
      });
      
      if (!contractor) {
        contractor = await prisma.contractorCompany.create({
          data: {
            name: data.contractorName,
            state: 'TX',
            verificationStatus: 'pending',
          },
        });
      }
    }

    return prisma.insuranceClaim.create({
      data: {
        propertyId,
        claimType: data.claimType,
        claimDate: data.claimDate,
        amount: data.amount,
        status: data.status,
        contractorId: contractor?.id,
        workDescription: data.workDescription,
        verificationStatus: 'pending',
      },
    });
  }
}

