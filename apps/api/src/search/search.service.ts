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

  /**
   * Autocomplete/typeahead search for addresses
   * Returns matching addresses as user types
   */
  async autocompleteAddresses(query: string, limit: number = 8) {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          {
            AND: [
              { address: { contains: query.split(' ')[0], mode: 'insensitive' } },
              { city: { contains: query.split(' ').slice(1).join(' '), mode: 'insensitive' } },
            ],
          },
        ],
      },
      take: limit,
      orderBy: [
        // Prioritize exact address matches
        { address: 'asc' },
        { city: 'asc' },
      ],
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
      },
    });

    return {
      suggestions: properties.map((p) => ({
        id: p.id,
        fullAddress: `${p.address}, ${p.city}, ${p.state} ${p.zipCode}`,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
      })),
    };
  }
}

