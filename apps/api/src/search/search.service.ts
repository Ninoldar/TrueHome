import { Injectable } from '@nestjs/common';
import { prisma } from '@truehome/db';

@Injectable()
export class SearchService {
  async searchProperties(query: string, limit: number = 10) {
    // Simple text search - will be enhanced with OpenSearch later
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { zipCode: { contains: query, mode: 'insensitive' } },
          { apn: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    return {
      results: properties.map((p) => ({
        id: p.id,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        apn: p.apn,
      })),
      count: properties.length,
    };
  }
}

