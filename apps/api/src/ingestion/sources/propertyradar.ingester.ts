import { Injectable } from '@nestjs/common';
import { IngestionService } from '../ingestion.service';

/**
 * PropertyRadar API Ingester
 * 
 * PropertyRadar provides comprehensive property data via API.
 * Sign up at: https://www.propertyradar.com/
 * 
 * Pricing: ~$50-200/month depending on usage
 */
@Injectable()
export class PropertyRadarIngester {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Fetch property by address
   */
  async fetchPropertyByAddress(
    address: string,
    city: string,
    state: string = 'TX'
  ) {
    const apiKey = process.env.PROPERTY_RADAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('PROPERTY_RADAR_API_KEY not configured');
    }

    try {
      const response = await fetch(
        `https://api.propertyradar.com/v1/properties?address=${encodeURIComponent(address)}&city=${city}&state=${state}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`PropertyRadar API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.properties && data.properties.length > 0) {
        return this.transformToProperty(data.properties[0]);
      }
      
      return null;
    } catch (error) {
      console.error('PropertyRadar API error:', error);
      throw error;
    }
  }

  /**
   * Fetch property by APN
   */
  async fetchPropertyByApn(apn: string) {
    const apiKey = process.env.PROPERTY_RADAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('PROPERTY_RADAR_API_KEY not configured');
    }

    try {
      const response = await fetch(
        `https://api.propertyradar.com/v1/properties?apn=${apn}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`PropertyRadar API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.properties && data.properties.length > 0) {
        return this.transformToProperty(data.properties[0]);
      }
      
      return null;
    } catch (error) {
      console.error('PropertyRadar API error:', error);
      throw error;
    }
  }

  /**
   * Fetch sales history for a property
   */
  async fetchSalesHistory(propertyId: string) {
    const apiKey = process.env.PROPERTY_RADAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('PROPERTY_RADAR_API_KEY not configured');
    }

    try {
      const response = await fetch(
        `https://api.propertyradar.com/v1/properties/${propertyId}/sales`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`PropertyRadar API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sales || [];
    } catch (error) {
      console.error('PropertyRadar sales history error:', error);
      throw error;
    }
  }

  /**
   * Transform PropertyRadar API response to our property format
   */
  private transformToProperty(apiData: any) {
    return {
      apn: apiData.apn || apiData.parcelNumber,
      address: apiData.address || apiData.situsAddress,
      city: apiData.city || 'Unknown',
      state: apiData.state || 'TX',
      zipCode: apiData.zipCode || apiData.zip || apiData.postalCode,
      latitude: apiData.latitude,
      longitude: apiData.longitude,
      lotSize: apiData.lotSize || apiData.lotSizeSquareFeet,
      livingArea: apiData.livingArea || apiData.squareFeet || apiData.improvementArea,
      bedrooms: apiData.bedrooms,
      bathrooms: apiData.bathrooms || apiData.bathroomsTotal,
      yearBuilt: apiData.yearBuilt,
      propertyType: apiData.propertyType || apiData.propertyClass,
    };
  }

  /**
   * Ingest a property from PropertyRadar
   */
  async ingestPropertyByAddress(address: string, city: string, state: string = 'TX') {
    const propertyData = await this.fetchPropertyByAddress(address, city, state);
    
    if (!propertyData) {
      throw new Error(`Property not found: ${address}, ${city}, ${state}`);
    }

    // Ingest the property
    const property = await this.ingestionService.ingestProperty(
      propertyData,
      'propertyradar',
      propertyData.apn,
      propertyData
    );

    // Fetch and ingest sales history if available
    try {
      const sales = await this.fetchSalesHistory(property.id);
      for (const sale of sales) {
        await this.ingestionService.ingestSale(
          property.id,
          {
            saleDate: new Date(sale.saleDate),
            salePrice: sale.salePrice,
            saleType: sale.saleType || "Arm's Length",
            buyerName: sale.buyerName,
            sellerName: sale.sellerName,
          },
          'propertyradar'
        );
      }
    } catch (error) {
      console.warn('Could not fetch sales history:', error);
    }

    return property;
  }
}

